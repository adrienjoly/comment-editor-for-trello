// server.js
// where your node app starts

// init project
var express = require('express');
var app = express();
var githubhook = require('githubhook');
var github = githubhook({
  port: process.env.PORT,
  secret: process.env.GITHUB_WEBHOOK_SECRET
});

github.listen();

github.on('*', function (event, repo, ref, data) {
    console.log("Pinged by GitHub!");
  
    var sys  = require('util'),
        exec = require('child_process').exec,
        child;

    child = exec('sh git.sh', function (error, stdout, stderr){
        if (error){ // There was an error executing our script
          console.err(error);
        } else { // Script ran ok
          console.log("git.sh run ok: ", stdout);
        }
    });  
});
