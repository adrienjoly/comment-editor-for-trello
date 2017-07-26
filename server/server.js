const express = require('express');
const bodyParser = require('body-parser');
const compression = require('compression');
const cors = require('cors');
const rp = require('request-promise');
const mustacheExpress = require('mustache-express');
const exec = require('child_process').exec;

if (!process.env.APP_KEY) {
  console.error('WARNING: don\'t forget to set the APP_KEY environment variable, for Trello API.');
}

if (!process.env.GITHUB_WEBHOOK_SECRET) {
  console.error('WARNING: don\'t forget to set the GITHUB_WEBHOOK_SECRET environment variable, for synchronising the source code of this Glitch with Github.');
}

// setup github hook (for sync of source code between glitch and github)
const GithubWebHook = require('express-github-webhook');
const github = GithubWebHook({
  path: '/github/callback', // for compatibility with npm:githubhook
  secret: process.env.GITHUB_WEBHOOK_SECRET
});
github.on('push', function (event, repo, ref, data) {
  console.log("Received a push from GitHub!");
  let child = exec('sh git.sh', function (error, stdout, stderr) {
    if (error) { // There was an error executing our script
      console.err(error);
    } else { // Script ran ok
      console.log("git.sh ran ok: ", stdout);
    }
  });
});

Promise = require('bluebird');

// use in your express app 
let app = express();
app.use(bodyParser.json());
app.use(github);
app.use(bodyParser.urlencoded({ extended: false }));

// Register '.mustache' extension with The Mustache Express
app.engine('mustache', mustacheExpress());
app.engine('html', mustacheExpress());
app.set('view engine', 'mustache');
app.set('views', __dirname + '/../views');

// compress our client side content before sending it over the wire
app.use(compression());

// your manifest must have appropriate CORS headers, you could also use '*'
app.use(cors({ origin: '*' }));

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// Setup server routes
require('./routes.js')(app);

// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log('Server up and running 🏃');
});

