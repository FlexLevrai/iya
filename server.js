//Install express server
const express = require('express');
const path = require('path');
const rendertron = require('rendertron-middleware');

const app = express();
const bots = [
  'baiduspider',
  'bingbot',
  'embedly',
  'facebookexternalhit',
  'linkedinbot',
  'outbrain',
  'pinterest',
  'quora link preview',
  'rogerbot',
  'showyoubot',
  'slackbot',
  'twitterbot',
  'vkShare',
  'W3C_Validator',
  'whatsapp',
];

app.use(
    rendertron.makeMiddleware({
      proxyUrl: 'https://render-tron.appspot.com/render',
      userAgentPattern: new RegExp(bots.join('|'), 'i')
    })
  );
// Serve only the static files form the dist directory
app.use(express.static(__dirname + '/dist/iyafrontend'));
app.use('*', express.static(path.join(__dirname, 'dist/iyafrontend/')));

// app.get('/*', function(req,res) {

// res.sendFile(path.join(__dirname+'/dist/iyafrontend/index.html'));
// });

// Start the app by listening on the default Heroku port
app.listen(process.env.PORT || 8080);
