
# Axonify : The Secret Messenging API
- A simple API where you can send messages to anyone anonymously.

## Endpoints

### Getting API key
- User will be provided with two keys, a public and a private key
- Private key will be used to send and recieve messages 
- Public key will be used to determine the reciever. You can broadcast you public key to recieve messages.

```js
  POST https://axonify.azurewebsites.net/user/new
```

#### Body (json) :

| Parameter  | Type     | Description                           |
| :--------- | :------- | :-------------------------------------- |
| `email`    | `string` | **Required**               |


#### response
```javascript
{
  "message": "Account created successflly, Please check your email for api key" 
}

```
<hr>

### Sending Messages:

```js
  POST https://axonify.azurewebsites.net/msg/new
```

#### Body (json) :

| Parameter  | Type     | Description                             |
| :--------- | :------- | :-------------------------------------- |
| `sKey`     | `string` | **Required** , Sender's private key | 
| `rKey`     | `string` | **Required** , Receiver's public key|
| `message`    | `string` | **Required** , Message                |




#### response

```javascript
{
    message: "Message sent successfully"
}

```
<hr>

### Viewing Messages

```js
  GET https://axonify.azurewebsites.net/msg/view
```

#### Body (json) :

| Parameter  | Type     | Description                             |
| :--------- | :------- | :-------------------------------------- |
| `priKey`     | `string` | **Required** , Your private key | 


#### response

```javascript
{
  "message": "1 New Messages",
  "data": [
    {
      "msg": "hello world"
    }
  ]
}
```

<hr>

## Support

For any issue or query I'll love to hear at : developer.authify@gmail.com

**We love contributions ❤️** <br>Contribute to this api <a href="https://github.com/MR-DHRUV/axonify-The-secret-messenging-API" target="_blank" rel="noopener noreferrer">here</a>

## Contact Me <br>


<a href="https://www.linkedin.com/in/dhruv-gupta-55034a228/" target="_blank" rel="noopener noreferrer">
  <img src="https://cdn-icons-png.flaticon.com/512/1384/1384014.png" alt="" width="50px" height="50px">
</a>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
<a href="https://github.com/MR-DHRUV" target="_blank" rel="noopener noreferrer">
  <img src="https://cdn-icons-png.flaticon.com/512/733/733609.png" alt="" width="50px" height="50px">
</a>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
<a href="mailto://developer.authify@gmail.com" target="_blank" rel="noopener noreferrer">
  <img src="https://cdn-icons-png.flaticon.com/512/60/60543.png" alt="" width="50px" height="50px">
</a>

