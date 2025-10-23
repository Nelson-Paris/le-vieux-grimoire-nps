require('dotenv').config();
const http = require('http');
const app = require('./app');

const port = process.env.PORT || 4000;
app.set('port', port);
http.createServer(app).listen(port, () =>
  console.log(`API: http://localhost:${port}`)
);