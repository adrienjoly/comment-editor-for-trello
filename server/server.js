const express = require('express');
//const bodyParser = require('body-parser');
const compression = require('compression');
const cors = require('cors');
//const mustacheExpress = require('mustache-express');

process.env.APP_KEY = '0b15414357140fe88faecea94f0a22b1' // https://trello.com/app-key
process.env.PORT = process.env.PORT || 8080;

// init web server
let app = express();
/*
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// register mustache as express' main view rendered
app.engine('mustache', mustacheExpress());
app.engine('html', mustacheExpress());
app.set('view engine', 'mustache');
app.set('views', __dirname + '/../views');
*/
// compress our client side content before sending it over the wire
app.use(compression());

// your manifest must have appropriate CORS headers, you could also use '*'
app.use(cors({ origin: '*' }));

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('./'));

// Setup server routes
//require('./routes.js')(app);

// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log(`Server up and running on port ${process.env.PORT} 🏃`);
  console.log('Run `npm run ssl` to add HTTPS support.')
});
