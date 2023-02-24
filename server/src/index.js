const express = require('express');
const cors = require('cors');
const http = require('http');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { login, getUser, getBalance } = require('./controller/user.controller');
const { postTransfer, getTransactions, getTransaction } = require('./controller/transaction.controller');

mongoose.connect('mongodb://db/crypto-bank', (err, db) => {
  if(err) console.log('database is not connected');
  else console.log('database is connected');
});

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(bodyParser({extended: true}));

app.get('/balance/:account', getBalance);
app.get('/login/:account', login);
app.get('/transactions', getTransactions);
app.get('/transactions/:hash', getTransaction);
app.get('/tx/transfer', getUser);
app.post('/tx/transfer', postTransfer);

server.listen(process.env.PORT, () => {
  console.log(`Server started at ${process.env.PORT} port.`);
});
