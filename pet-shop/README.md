# Demo2: pet-shop

This demo shows how to deploy the [pet-shop-box](https://github.com/truffle-box/pet-shop-box) on AppChain.

> Notice: This tutorial is for the developers who is able to build webapps and has basic knowledge of Blockchain and Smart Contract.

We **highly recommend** you to get familiar with the offical [pet-shop-box-tutorial](https://truffleframework.com/tutorials/pet-shop) first, this will help you fully understand what's going on in this demo.

The final project looks like

```shell
├── README.md
├── package.json
├── node_modules
├── build
│   ├── contracts
│       ├── Adoption.json
│       ├── Migrations.json
├── contracts
│   ├── Adoption.sol
│   ├── Migration.sol
├── migrations
│   ├── 1_initial_migration.js
│   ├── 2_deploy_contracts.js
├── src
│   ├── css
│       ├── bootstrap.min.css
│       ├── bootstrap.min.css.map
│   ├── fonts
│       ├── glyphicons-halflings-regular.eot
│       ├── glyphicons-halflings-regular.svg
│       ├── glyphicons-halflings-regular.ttf
│       ├── glyphicons-halflings-regular.woff
│       ├── glyphicons-halflings-regular.woff2
│   ├── images
│       ├── boxer.jpeg
│       ├── french-bulldog.jpeg
│       ├── golden-retriever.jpeg
│       ├── scottish-terrier.jpeg
│   ├── pics
│   ├── js
│       ├── app.js
│       ├── bootstrap.min.js
│       ├── bundle.js
│   ├── index.html
│   ├── pets.json
├── test
│   ├── TestAdoption.sol
├── box-img-lg.png
├── box-img-sm.png
├── bs-config-json
├── LICENSE
├── truffle-box.json
├── truffle-config.js
├── truffle.js
└── yarn.lock
```

# How to run this demo

## 1. Download repo
Download this repo to your Desktop and unzip.

Finish the [setting-up](https://truffleframework.com/tutorials/pet-shop#setting-up-the-development-environment).

## 2. Install all dependencies

```shell
yarn install
```
## 3. Compile the contract

```shell
truffle compile
```

You will get a new folder named build.

## 4. Deploy the contract
> Notice: We use [AppChain-Truffle-Box](https://github.com/cryptape/appchain-truffle-box) to deploy the contract, so the commend is different from truffle-box.

```shell
npm run migrate
```
If your terminal shows informations below means you have successed.

```shell
> appchain-migrate migrate

Using network 'development'.

Running migration: 1_initial_migration.js
  Deploying Migrations...
store abi success
  Migrations: 0xEAa463CB5ed86064CCFE52e468472f88b7eEE24B // this may be different
Saving artifacts...
Running migration: 2_deploy_contracts.js
  Deploying Adoption...

store abi success
  Adoption: 0xB48af013Cec674C37e2B4D623c6298efe30C7581 // this may be different
Saving artifacts...
```

## 5. Run the server

```shell
npm run dev
```
If everything works well, you will automatically jump to a web page like this:

![homepage](src/pics/homepage.png)


After you click the Adopt Button under any dog pic, browser will alert 'Waiting for transaction result', after click the confirm button another alert will tell you 'Transaction Done!'

The Adopt button will becomes disabled and the text will change to 'Success'. Melissa in the first row is an example.

---
# Where are the differences

From here, we assume you already read the [pet-shop-box-tutorial](https://truffleframework.com/tutorials/pet-shop), cause we will **focus on different parts** between these two demos.

> Notice: This demo use nervos.js instead of web3.js to interact with AppChain. **You can find nervos.js [here](https://github.com/cryptape/nervos.js/tree/develop/packages/nervos-chain).**

## src/index.html

```html
<script src="js/bootstrap.min.js"></script>
<script src="js/bundle.js"></script>
<script src="js/app.js"></script>
```

```
+ bundle.js
- web3.min.js
- truffle-contract.js
```
[bundle.js](src/js/bundle.js) is a JavaScript file for browser to use nervos.js.

## src/app.js


### Instantiating nervos.js

```js
var nervos = NervosWeb3('http://121.196.200.225:1337')
```
The Nervos JavaScript library interacts with the AppChain. It can retrieve user accounts, send transactions, interact with smart contracts, and more.

Set privateKey here for later useage, no more need for initWeb3.

### Instantiating the contract

```js
App.contracts.Adoption = new nervos.appchain.Contract(AdoptionArtifact.abi, contract_address)
```

Create contract instance by using abi and deployed contract address.

### Getting The Adopted Pets and Updating The UI

```js
App.contracts.Adoption.methods.getAdopters().call().then(() => {
    // do something
}).catch((err) => {
    console.log(err)
})
```
getAdopters is a method name written in the contract.

We can use App.contracts.Adoption.methods.methodName, to call the method in  deployed contract.

### Handling the adopt() Function

```js
const transaction = {
    from: '0x46a23E25df9A0F6c18729ddA9Ad1aF3b6A131160',
    privateKey: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
    nonce: 999999,
    quota: 1000000,
    data: App.contracts.bytecode,
    chainId: 1,
    version: 0,
    validUntilBlock: 999999,
    value: '0x0'
}
```
transaction object provide some configuration options to interact with AppChain.

For more details about transaction object, you can refer to [nervos.js](https://github.com/cryptape/nervos.js/tree/develop/packages/nervos-chain).

```js
nervos.appchain.getBlockNumber().then((res) => {
    const num = Number(res)
    transaction.validUntilBlock = num + 88
})
```

Check the block number right now, set an interval for valid block number.

```js
App.contracts.Adoption.methods.adopt(petId).send(transaction)
```
Call adopt method and send transaction to AppChain.

```js
return nervos.listeners.listenToTransactionReceipt(result.hash)
```
Polling to get transaction receipt by using transaction hash.

```js
((receipt) => {
    if(receipt.errorMessage === null) {
        console.log('Transaction Done!')
        alert('Transaction Done!')
        return App.markAdopted()
    } else {
        throw new Error(receipt.errorMessage)
    }
}).catch((err) => {
    console.log(err.message)
})
```
If receipt received, then call markAdopted method or throw the error.
