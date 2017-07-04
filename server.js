// init project
var githubhook = require('githubhook');
var github = githubhook({
  port: process.env.PORT,
  secret: process.env.GITHUB_WEBHOOK_SECRET
});

github.listen();

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
