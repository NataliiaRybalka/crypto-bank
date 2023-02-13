const express = require('express');
const cors = require('cors');
const http = require('http');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { login, transfer } = require('./controller/user.controller');

mongoose.connect('mongodb://db/crypto-bank', (err, db) => {
  if(err) console.log('database is not connected');
  else console.log('connected');
});

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(bodyParser({extended: true}));

app.get('/login/:account', login);
app.post('/user/transfer', transfer);

server.listen(process.env.PORT, () => {
  console.log(`Server started at ${process.env.PORT} port.`);
});
