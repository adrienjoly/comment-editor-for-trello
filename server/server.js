const express = require('express');
const compression = require('compression');
const cors = require('cors');

process.env.PORT = process.env.PORT || 8080;

// init web server
let app = express();
app.use(compression());

// your manifest must have appropriate CORS headers, you could also use '*'
app.use(cors({ origin: '*' }));

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('./'));

// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log(`Server up and running on port ${process.env.PORT} 🏃`);
  console.log('Run `npm run ssl` to add HTTPS support.')
});
