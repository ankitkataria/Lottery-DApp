# Lottery DApp

> A block-chain based Lottery System made using [Truffle](truffleframework.com)

### Features

- The owner of the Lottery contract sets a SHA3 hash of the winning guess between 1 and 1'000'000

- In order to participate a user sends required amount in ETH to the contract and gets 1 participation token per ETH in return

- The users makes guess using the `makeGuess()` function of the contract, 1 token is deducted for each guess

- The Lottery contract has a `closeGame()` function that the owner can invoke to stop any further guessing

- The unused tokens are not reimbursed

- A function `winnerAddress()` returns the address of the winner once the game is closed

- Once the game is closed the winner can call `getPrice()` to collect 50% of the ETH in the contract

- The `getPrice()` function sends the remaining 50% of ETH to the owner of the contract

- The owner receives all the money that contract holds if there are no correct guesses

### Setup

- Clone repo: `git clone git@github.com:ankitkataria/Lottery-DApp.git`

- Change directory to cloned copy and run: `npm install`

- Install truffle: `npm install -g truffle`

- Download [Ganache](http://localhost:9000/ganache/) AppImage

- Run ganache AppImage

![ganache](docs/ganache.png?raw=true "Ganache Ethereum Blockchain")

- Set the winning guess in `migrations/2_add_lottery_contract.js`

- Compile truffle contracts: `truffle compile`

- Migrate truffle contract to blockchain: `truffle migrate`

- Run server: `npm run dev`

- Open `http://localhost:8080` in browser

![dashboard1](docs/dashboard1.png?raw=true "addToken and makeGuess")

![dashboard2](docs/dashboard2.png?raw=true "closeGame and getPrice")

### Todo

- [ ] Add current lottery state to local storage
- [ ] Add functionality to reimburse tokens once game is closed

### References

- [Ethereum White Paper](https://github.com/ethereum/wiki/wiki/White-Paper)
- [Truffle Docs](truffleframework.com/docs/)
- [CrypotZombies](https://cryptozombies.io/) 
- [Bitcoin Paper](https://bitcoin.com/bitcoin.pdf)
