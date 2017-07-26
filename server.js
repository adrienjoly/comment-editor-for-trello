// init project
/*
var githubhook = require('githubhook');
var github = githubhook({
  port: process.env.PORT,
  secret: process.env.GITHUB_WEBHOOK_SECRET
});
*/
// TODO: use express-github-webhook, for express ?

const express = require('express');
const bodyParser = require('body-parser');
const GithubWebHook = require('express-github-webhook');
const github = GithubWebHook({
  path: '/github/callback', // for compatibility with npm:githubhook
  secret: process.env.GITHUB_WEBHOOK_SECRET
});

// use in your express app 
let app = express();
app.use(bodyParser.json()); // must use bodyParser in express 
app.use(github); // use our middleware 

//github.listen();

github.on('push:glitch-github-sync', function (event, repo, ref, data) {
    console.log("Received a push from GitHub!");
  
    var sys  = require('util'),
        exec = require('child_process').exec,
        child;

    child = exec('sh git.sh', function (error, stdout, stderr){
        if (error){ // There was an error executing our script
          console.err(error);
        } else { // Script ran ok
          console.log("git.sh ran ok: ", stdout);
        }
    });  
});

const listener = app.listen(process.env.PORT, () => {
  console.log('Server up and running 🏃');
});
