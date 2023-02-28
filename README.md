# crypto-bank
Crypto-bank - Cryptocurrency Bank.
Project has next function:
1. Connect Phantom account.
2. Transfer sol or usdc from your account.
3. Watch your balance.
4. Watch your transactions.

## Technologies
Project is created with:
* Node
* TypeScript
* Solana
* MongoDB
* React
* Next

## Run project
1) Start backend part of the project: 
```bash
$ cd server/
$ docker-compose -p server build && docker-compose -p server up -d
```
3) Start frontend part of the project: 
```bash
$ cd ../web/
$ npm install
$ npm run start
```