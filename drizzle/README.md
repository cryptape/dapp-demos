# Demo3: Drizzle Truffle Box

This demo use drizzle-truffle-box as an example to show you [AppChain-Truffle-Migrate](https://github.com/cryptape/appchain-truffle-migrate) can deploy multiple contracts.

# How to run this demo

## 1. Install Truffle globally

```javascript
npm install -g truffle
```

## 2. Download repo
Download this repo.

```shell
git clone https://github.com/cryptape/dapp-demos.git
```
Change directory to drizzle.

```shell
cd dapp-demos
cd drizzle
```

## 3. Install all dependencies

```shell
yarn install
```

## 4. Compile the smart contracts

```javascript
truffle compile
```

## 5. Deploy the contract
> Notice: We use [AppChain-Truffle-Migrate](https://github.com/cryptape/appchain-truffle-migrate) to deploy the contract, so the commend is different from truffle-box.

```shell
npm run migrate
```
If your terminal shows informations below means you successfully deployed multiple contracts.

```shell
> appchain-migrate migrate

Using network 'development'.

Running migration: 1_initial_migration.js
  Deploying Migrations...
store abi success

  Migrations: 0xfEDaB71B8C899f53CF6af5AfFdf300bf0b8Dc9B6 // contract address may be different
Saving artifacts...
Running migration: 2_deploy_simplestorage.js
  Deploying SimpleStorage...
store abi success
  SimpleStorage: 0xe7F8Ea1857906a7736bBDB500e82f092242347F8 // contract address may be different
Saving artifacts...
Running migration: 3_deploy_tutorialtoken.js
  Deploying TutorialToken...
store abi success
  TutorialToken: 0xB87a2fDC7cb9cce5b260ae460A72c4cf89Cb1a4C // contract address may be different
Saving artifacts...
Running migration: 4_deploy_complexstorage.js
  Deploying ComplexStorage...
store abi success
  ComplexStorage: 0xB6C3B3b23DcE145bC13FB29233E7Dd78c7f4Ea41 // contract address may be different
Saving artifacts...
```

## 6. Test contract

To test whether contracts already deployed, you can change directory to contracts then run contract.test.js.

```shell
cd contracts
node contract.test.js
```
In the shell will display the test result.

```shell
###### Simple Storage Contract Test Begin ######

Stored Data before set: 0

Set stored date to 40......

Stored Data after set: 40

###### Simple Storage Contract Test End ######

###### Complex Storage Contract Test Begin ######

string1: 0x74657374310000000000000000000000

string2: 0x7465737431323336000000000000000000000000000000000000000000000000

string3: lets string something

storeduint1: 15

###### Complex Storage Contract Test End ######
```
