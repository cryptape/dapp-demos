# Demo1: First Forever

This demo shows the entire process of building a MVP Dapp on Appchain.

> Notice: This tutorial is for the developers who is able to build webapps and has basic knowledge of Blockchain and Smart Contract.

# So, how simple the Dapp is?

All interactions with Smart Contract are:

- Store Text in Smart Contract: a `sendTransaction` action;

- Get TextList from Smart Contract: a `call` action;

- Get Text from Smart Contract: a `call` action;

The final project looks like

```shell
├── README.md
├── package.json
├── public
│   ├── favicon.ico
│   ├── index.html
│   └── manifest.json
├── src
│   ├── App.css
│   ├── App.js
│   ├── App.test.js
│   ├── Routes.jsx
│   ├── components
│   ├── config.js.example
│   ├── containers
│   ├── contracts
│   ├── index.css
│   ├── index.js
│   ├── logo.svg
│   ├── nervos.js
│   ├── public
│   ├── registerServiceWorker.js
│   └── simpleStore.js
└── yarn.lock
```

# Getting Started

## 1. Use Scaffold for Project

This Demo use `create-react-app` to start the project, so you need the `create-react-app` scaffold firstly

> Notice: This demo is created by create-react-app and supported by modern browser. If es5 version needed, just eject the scaffold and add `@babel/preset-es2015` in `.babelrc`

```shell
$ yarn global add create-react-app
```

After that the project can be initiated by

```shell
$ create-react-app first-forever && cd first-forever
```

Now the project looks like

```shell
├── README.md
├── package.json
├── public
│   ├── favicon.ico
│   ├── index.html
│   └── manifest.json
└── src
    ├── App.css
    ├── App.js
    ├── App.test.js
    ├── index.css
    ├── index.js
    ├── logo.svg
    ├── public
    └── registerServiceWorker.js
```

## 2. Add Components of the Dapp

This step is very familiar to webapp developers, [Route](https://github.com/cryptape/dapp-demos/blob/develop/first-forever/src/Routes.jsx), [Containers](https://github.com/cryptape/dapp-demos/tree/develop/first-forever/src/containers) and [Components](https://github.com/cryptape/dapp-demos/tree/develop/first-forever/src/components) will be added to the Dapp

```shell
└── src
    ├── Routes.jsx
    ├── components
    └── containers
```

The Route indicates that the demo has 4 pages:

- [Homepage](https://github.com/cryptape/dapp-demos/blob/develop/first-forever/src/containers/Home/index.jsx)
- [AddMemo](https://github.com/cryptape/dapp-demos/tree/develop/first-forever/src/containers/Add/index.jsx)
- [MemoList](https://github.com/cryptape/dapp-demos/blob/develop/first-forever/src/containers/List/index.jsx)
- [Memo](https://github.com/cryptape/dapp-demos/blob/develop/first-forever/src/containers/Show/index.jsx)

All above are just traditional webapp development, and next we are going to dapp development.

## 3. Nervos.js

This step instructs how to have a Dapp running on Nervos Appchain.

The Dapp interacts with Appchain by the `nervos.js` and details of `nervos` can be accessed at [@nervos/chain](https://www.npmjs.com/package/@nervos/chain)

In order to use nervos.js, add nervos.js as other packages by yarn `yarn add @nervos/chain`, and then instantiate `nervos` in `src/nervos.js`.

```javascript
const { default: Nervos } = require('@nervos/chain')

const config = require('./config')

const nervos = Nervos(config.chain) // config.chain indicates that the address of Appchain to interact
const account = nervos.appchain.accounts.privateKeyToAccount(config.privateKey) // create account by private key from config

nervos.appchain.accounts.wallet.add(account) // add account to nervos

module.exports = nervos
```

## 4. Smart Contract

This Dapp works with an extremely simple smart contract -- [SimpleStore](https://github.com/cryptape/dapp-demos/blob/develop/first-forever/src/contracts/SimpleStore.sol).

```solidity
pragma solidity 0.4.24;

contract SimpleStore {
    mapping (address => mapping (uint256 => string)) private records;
    mapping (address => uint256[]) private categories;

    event Recorded(address _sender, string indexed _text, uint256 indexed _time);

    function _addToList(address from, uint256 time) private {
        categories[from].push(time);
    }

    function getList()
    public
    view
    returns (uint256[])
    {
        return categories[msg.sender];
    }

    function add(string text, uint256 time) public {
        records[msg.sender][time]=text;
        _addToList(msg.sender, time);
        emit Recorded(msg.sender, text, time);
    }
    function get(uint256 time) public view returns(string) {

        return records[msg.sender][time];
    }
}
```

Smart Contract can be debugged on [Remix](https://remix.ethereum.org/), an online solidity debugger

![remix](https://cdn.cryptape.com/docs/images/remix.png)

By clicking on `Detail` in the right-side panel, compiled details will show as follow

![remix](https://cdn.cryptape.com/docs/images/remix_detail.png)

In details, **bytecode** and **abi** will be used in this demo.

**bytecode** is used to deploy the contract, and **abi** is used to instantiate a contract instance for interacting.

### Deploy and Test the Contract

Create directory in `src`

```
├── contracts
│   ├── SimpleStore.sol
│   ├── compiled.js
│   ├── contracts.test.js
│   ├── deploy.js
│   └── transaction.js
```

- Store SimpleStore Source Code in [SimpleStore.sol](https://github.com/cryptape/dapp-demos/blob/develop/first-forever/src/contracts/SimpleStore.sol)

- Store **bytecode** and **abi** in [compiled.js](https://github.com/cryptape/dapp-demos/blob/develop/first-forever/src/contracts/compiled.js)

- Store transaction template in [transaction.js](https://github.com/cryptape/dapp-demos/blob/develop/first-forever/src/contracts/transaction.js)

  ```javascript
  const nervos = require('../nervos')
  const transaction = {
    from: nervos.appchain.accounts.wallet[0].address,
    privateKey: nervos.appchain.accounts.wallet[0].privateKey,
    nonce: 999999,
    quota: 1000000,
    chainId: 1,
    version: 0,
    validUntilBlock: 999999,
    value: '0x0',
  };

  module.exports = transaction
  ```

- Store deploy script in [deploy.js](https://github.com/cryptape/dapp-demos/blob/develop/first-forever/src/contracts/deploy.js)

  ```javascript
  const nervos = require('../nervos')
  const { abi, bytecode } = require('./compiled.js')

  const transaction = require('./transaction')
  let _contractAddress = ''
  // contract contract instance
  const myContract = new nervos.appchain.Contract(abi)

  nervos.appchain
    .getBlockNumber()
    .then(current => {
      transaction.validUntilBlock = +current + 88 // update transaction.validUntilBlock
      // deploy contract
      return myContract
        .deploy({
          data: bytecode,
          arguments: [],
        })
        .send(transaction)
    })
    .then(txRes => {
      if (txRes.hash) {
        // get transaction receipt
        return nervos.listeners.listenToTransactionReceipt(txRes.hash)
      } else {
        throw new Error('No Transaction Hash Received')
      }
    })
    .then(res => {
      const { contractAddress, errorMessage } = res
      if (errorMessage) throw new Error(errorMessage)
      console.log(`contractAddress is: ${contractAddress}`)
      _contractAddress = contractAddress
      return nervos.appchain.storeAbi(contractAddress, abi, transaction) // store abi on the chain
    })
    .then(res => {
      if (res.errorMessage) throw new Error(res.errorMessage)
      return nervos.appchain.getAbi(_contractAddress).then(console.log) // get abi from the chain
    })
    .catch(err => console.error(err))
  ```

- Store test script in [contracts.test.js](https://github.com/cryptape/dapp-demos/blob/develop/first-forever/src/contracts/contracts.test.js)

  ```javascript
  const nervos = require('../nervos')
  const { abi } = require('./compiled')
  const { contractAddress } = require('../config')
  const transaction = require('./transaction')

  const simpleStoreContract = new nervos.appchain.Contract(abi, contractAddress) // instantiate contract

  nervos.appchain.getBalance(nervos.appchain.accounts.wallet[0].address).then(console.log) // check balance of account
  console.log(`Interact with contract at ${contractAddress}`)
  const time = new Date().getTime()
  const text = 'hello world at ' + time

  test(
    `Add record of (${text}, ${time})`,
    async () => {
      const current = await nervos.appchain.getBlockNumber()
      transaction.validUntilBlock = +current + 88 // update transaction.validUntilBlock
      const txResult = await simpleStoreContract.methods.add(text, time).send(transaction) // sendTransaction to the contract
      const receipt = await nervos.listeners.listenToTransactionReceipt(txResult.hash) // listen to the receipt
      expect(receipt.errorMessage).toBeNull()
    },
    10000,
  )

  test(
    `Get record of (${text}, ${time})`,
    async () => {
      const list = await simpleStoreContract.methods.getList().call({
        from: transaction.from,
      }) // check list
      const msg = await simpleStoreContract.methods.get(time).call({
        from: transaction.from,
      }) // check message
      expect(+list[list.length - 1]).toBe(time)
      expect(msg).toBe(text)
    },
    3000,
  )
  ```

- Add deploy and test script in [package.json](https://github.com/cryptape/dapp-demos/blob/develop/first-forever/package.json)

  ```json
  "scripts": {
    "deploy": "node ./src/contracts/deploy.js",
    "test:contract": "jest ./src/contracts/contracts.test.js"
  }
  ```

- Create `src/config.js`, set private key and chain ip in it.

  ```shell
  $ cp src/config.js.example src/config.js
  ```

- Deploy the contract

  ```shell
  $ npm run deploy
  ```

- Add contract address to config.js and test

  For now the `config.js` should be like:

  ```javascript
  const config = {
    chain: '{addr of net you are using}',
    privateKey: '{your private key}',
    contractAddress: '{deployed contract address}',
  }
  module.exports = config
  ```

## Integrate Contract into Dapp

### Instantiate Contract

Instantiate Contract in [simpleStore.js](https://github.com/cryptape/dapp-demos/blob/develop/first-forever/src/simpleStore.js) under `src`

```javascript
const nervos = require('./nervos')
const { abi } = require('./contracts/compiled.js')
const { contractAddress } = require('./config')

const transaction = require('./contracts/transaction')
const simpleStoreContract = new nervos.appchain.Contract(abi, contractAddress)
module.exports = {
  transaction,
  simpleStoreContract,
}
```

### Add `myContract.add` in AddMemo Page

In `src/containers/Add/index.jsx`, bind the following method to submit button

```javascript
handleSubmit = e => {
  const { time, text } = this.state
  nervos.appchain
    .getBlockNumber()
    .then(current => {
      const tx = {
        ...transaction,
        validUntilBlock: +current + 88,
      }
      this.setState({
        submitText: submitTexts.submitting,
      })
      return simpleStoreContract.methods.add(text, +time).send(tx) // execute add method to store memo in the contract
    })
    .then(res => {
      if (res.hash) {
        return nervos.listeners.listenToTransactionReceipt(res.hash)
      } else {
        throw new Error('No Transaction Hash Received')
      }
    })
    .then(receipt => {
      if (!receipt.errorMessage) {
        this.setState({ submitText: submitTexts.submitted })
      } else {
        throw new Error(receipt.errorMessage)
      }
    })
    .catch(err => {
      this.setState({ errorText: JSON.stringify(err) })
    })
}
```

In `src/containers/List/index.jsx`, load memos on mount

```javascript
componentDidMount() {
  const from = nervos.appchain.accounts.wallet[0] ? nervos.appchain.accounts.wallet[0].address : ''
  simpleStoreContract.methods
    .getList()
    .call({
      from,
    })
    .then(times => {
      times.reverse()
      this.setState({ times })
      return Promise.all(times.map(time => simpleStoreContract.methods.get(time).call({ from })))
    })
    .then(texts => {
      this.setState({ texts })
    })
    .catch(console.error)
}
```

In `src/containers/Show/index.jsx`, load memo on mount

```javascript
componentDidMount() {
  const { time } = this.props.match.params
  if (time) {
    simpleStoreContract.methods
      .get(time)
      .call({
        from: nervos.appchain.accounts.wallet[0].address,
      })
      .then(text => {
        this.setState({ time, text })
      })
      .catch(error => this.setState({ errorText: JSON.stringify(error) }))
  } else {
    this.setState({ errorText: 'No Time Specified' })
  }
}
```

As all of these done, start the local server by `npm start` to launch the dapp.

![first forever](https://cdn.cryptape.com/docs/images/ff_1.png)
![first forever](https://cdn.cryptape.com/docs/images/ff_2.png)
![first forever](https://cdn.cryptape.com/docs/images/ff_3.png)
![first forever](https://cdn.cryptape.com/docs/images/ff_4.png)
