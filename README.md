# twitter-api-app
A simple twitter based versioning api to post, read, update and delete tweets to authenticate users using [JWT](https://jwt.io/) and keep previous versions of a tweet.

### How to use this repository ?
- Clone or download repository.  [Refer](https://help.github.com/articles/cloning-a-repository/)
- Go to application folder. 
- Install dependencies. Run `npm install`.
- Run `npm start` to start server.
- To test the authentication, run `npm run test`. It will return false for username and password.
- 
### API's

- To authenticate, keep http method as POST and request to (https://twitter-api-app.herokuapp.com/authenticate). Keep username as **user** and password as **admin**.
- Once authenticated, it will create token. This token will be used for further api operations. Keep headers as x-access-token and put token value in it.
- To view all tweets : (https://twitter-api-app.herokuapp.com/v1/tweets) and keep http method as GET.
- To view specific tweets : (https://twitter-api-app.herokuapp.com/v1/tweets/1). Tweet id at the end and keep http method as GET. It will also gives previous versions of tweet.
- To post tweet, (https://twitter-api-app.herokuapp.com/v1/tweets), send body as text = 'YOUR TWEET' and keep http method as POST.
- To delete a tweet, (https://twitter-api-app.herokuapp.com/v1/tweets/1), with tweet id at the end and keep http method as DELETE.
- To update a tweet, (https://twitter-api-app.herokuapp.com/v1/tweets/1), with tweet id at the end and keep http method as PUT and send body as text = 'YOUR UPDATED TWEET'. Once updated, it will keep previous version of tweet also.
- To access history of a tweet, (https://twitter-api-app.herokuapp.com/v1/history/1/1), with tweet-id and version-id at the end and keep http method as GET.
- To delete a history of a tweet, (https://twitter-api-app.herokuapp.com/v1/history/1/1), with tweet-id and version-id at the end and keep http method as DELETE.
- To update a history of a tweet, (https://twitter-api-app.herokuapp.com/v1/history/1/1), with tweet-id and version-id at the end and keep http method as PUT.