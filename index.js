const connectToMongo = require('./db')
const cors = require('cors')
const express = require("express");
const app = express();
const port = 5000;
const bodyparser = require('body-parser');
const KeyStore = require("./models/apikeys");
const { body, validationResult } = require('express-validator');
const md5 = require('md5');
const sha256 = require('sha256');
const authifyMailer = require('./authifyMailer');
const MessageStore = require('./models/message');
const LinkStore = require('./models/link');


app.use(express.static('static'))
app.use(bodyparser.json()); // support json encoded bodies
app.use(bodyparser.urlencoded({ extended: true })); // support encoded bodies


// connect to database
connectToMongo();

app.post('/user/new', [
    body('email', 'Enter a valid email address').isEmail(),
], async (req, res) => {

    // console.log(req.body.email)
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors)
        return res.json({ message: errors.errors[0].msg })
    }

    const user = await KeyStore.findOne({ email: req.body.email });

    if (user) {
        return res.json({ message: "User with given email address already exists" })
    }

    try {
        const now = new Date;
        const publicKey = await md5(String(now + req.body.email));
        const privateKey = await sha256(String(now.getMinutes() + now.getMilliseconds() + req.body.email));

        let newUser = await KeyStore.create({
            email: req.body.email,
            public_key: publicKey,
            private_key: privateKey,
        })

        await authifyMailer(req.body.email, "API Key for Secret", `Public Key : ${publicKey}\nPrivate Key : ${privateKey}\nPlease read the readme provided at secrect.azurewebsites.net to properly use th API`);

        res.status(200).json({ message: "Account created successflly, Please check your email for api key" });

    } catch (error) {
        console.log(error);
        res.status(400).json({ message: error });
    }
})

app.post('/msg/new', [
    body('sKey', 'Invalid key senders key').isString(),
    body('rKey', 'Invalid key recievers key').isString(),
    body('sKey', 'Invalid key senders key').isLength({ min: 64, max: 64 }),
    body('rKey', 'Invalid key recievers key').isLength({ min: 32, max: 32 }),
    body('message', 'Enter a valid message').isLength({ min: 1, max: 2000 }),
], async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors)
        return res.json({ message: errors.errors[0].msg })
    }

    const Sender = await KeyStore.findOne({ private_key: req.body.sKey });
    const Reciever = await KeyStore.findOne({ public_key: req.body.rKey });

    // checking the validity of given keys against our database
    if (!Sender) {
        return res.status(400).json({ message: "Invalid sKey key" });
    }
    if (!Reciever) {
        return res.status(400).json({ message: "Invalid rKey key" });
    }

    try {
        // store the message
        let newMsg = await MessageStore.create({
            sender: Sender.private_key,
            reciever: Reciever.private_key,
            msg: req.body.message
        });

        // gen link
        let existinngLink = await LinkStore.findOne({ reciever: Reciever.private_key })

        if (!existinngLink || existinngLink.exp <= Date.now()) {
            
            const exp = new Date();
            exp.setFullYear(exp.getFullYear() + 1);

            let newLink = await LinkStore.create({
                reciever: Reciever.private_key,
                exp : exp,
                url : sha256((Date.now()+Reciever.public_key+ Reciever.email))
            })

            existinngLink = newLink
        }

        // sending email to reciever
        const count = await MessageStore.find({ reciever: Reciever.private_key });
        if (count.length > 0) {
            authifyMailer(Reciever.email, `You have ${count.length} new messages`, `Hi anonymous user,\nYou have ${count.length} new messages.Click on the following link to view https://axonify.azurewebsites.net/auth/email/${existinngLink.url}\nRegards\nAxonify`)
        }

        return res.status(200).json({ message: "Message sent successfully" })

    }
    catch (error) {
        console.log(error);
        res.status(400).json({ message: error });
    }

})


app.get('/msg/view', [
    body('priKey', 'Invalid key private key').isString(),
    body('priKey', 'Invalid key private key').isLength({ min: 64, max: 64 }),
], async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors)
        return res.json({ message: errors.errors[0].msg })
    }

    const user = await KeyStore.findOne({ private_key: req.body.priKey });

    // checking the validity of given keys against our database
    if (!user) {
        return res.status(400).json({ message: "Invalid key" });
    }

    try {

        // finding the messages
        const msg = await MessageStore.find({ reciever: user.private_key }).select(['msg', '-_id']);

        if (msg.length == 0) {
            return res.status(200).json({ message: "No New Messages" })
        }

        // deleting all the messages
        await MessageStore.deleteMany({ reciever: user.private_key });

        return res.status(200).json({ message: `${msg.length} New Messages`, data: msg })
    }
    catch (error) {
        console.log(error);
        res.status(400).json({ message: error });
    }

})

app.get('/auth/email/:key', [
], async (req, res) => {

    console.log(req.params.key)
    const link = await LinkStore.findOne({ url: req.params.key});

    // checking the validity of given keys against our database
    if (!link) {
        return res.status(400).send({ message: "Invalid Link. Please go the website to view your messeges." });
    }
    
    try {
        
        await LinkStore.deleteOne({url: req.params.key});
        // finding the messages

        const msg = await MessageStore.find({ reciever: link.reciever }).select(['msg', '-_id']);
        console.log(msg)

        if (msg.length == 0) {
            return res.status(200).send({ message: "No New Messages" })
        }

        // deleting all the messages
        await MessageStore.deleteMany({ reciever: link.reciever });

        return res.status(200).send({ message: `${msg.length} New Messages`, data: msg })
    }
    catch (error) {
        console.log(error);
        res.status(400).json({ message: error });
    }

})


app.listen(process.env.PORT || port, () => {
    console.log(`Server started on  port ${port}`);
})