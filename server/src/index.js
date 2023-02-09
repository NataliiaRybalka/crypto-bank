const express = require('express');
const cors = require('cors');
const http = require('http');
const mongoose = require('mongoose');
const { login } = require('./controller/user.controller');

mongoose.connect('mongodb://db/bank', (err, db) => {
  if(err) console.log('database is not connected');
  else console.log('connected');
});

const app = express();
const server = http.createServer(app);

app.use(cors());

app.get('/login/:address', login)

server.listen(process.env.PORT, () => {
  console.log(`Server started at ${process.env.PORT} port.`);
});
