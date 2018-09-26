# Demo3: Drizzle Truffle Box

[中文版](doc/zh/README_zh.md)

This demo use drizzle-truffle-box as an example to show you [AppChain-Truffle-Migrate](https://github.com/cryptape/appchain-truffle-migrate) can deploy multiple contracts.

# How to run this demo

## 1. Install Truffle globally

```shell
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

or

```shell
npm install
```

## 4. Configuration

Create truffle.js.

```shell
cp truffle.js.example truffle.js
```

## 5. Compile the smart contracts

```shell
truffle compile
```

on winodws:

```shell
truffle.cmd compile
```

## 6. Deploy the contract
> Notice: We use [AppChain-Truffle-Migrate](https://github.com/cryptape/appchain-truffle-migrate) to deploy the contract, so the commend is different from truffle-box.

```shell
yarn migrate
```
If your terminal shows informations below means you successfully deployed multiple contracts.

```shell
> appchain-migrate migrate

Using network 'development'.

Running migration: 1_initial_migration.js
  Deploying Migrations...
transaction hash of deploy contract:  0x5b19395742eac3eeb34a2cc0a149358e321dd2d57bfb725224708ba0ab855ad8
  Migrations: 0xa9845100889C69Be570377DcBDc4752A8B7428D2  // contract address may be different
Saving artifacts...
Running migration: 2_deploy_simplestorage.js
  Deploying SimpleStorage...
transaction hash of deploy contract:  0xba906f2660dbfcaca1db36fbe5903e416faa5aba86f7c23f04aa3c7dadbe1b70
  SimpleStorage: 0xD57EFb761F682520EC8F96eCC97e91393dAe075d // contract address may be different
Saving artifacts...
Running migration: 3_deploy_tutorialtoken.js
  Deploying TutorialToken...
transaction hash of deploy contract:  0xa83b6834fe9722556123369c50ec08b1bd4cc8095d19b17f75edc6e2fef238f3
  TutorialToken: 0xe532D0C25C7a69fC31F63F533E29867aeE7e5d4d // contract address may be different
Saving artifacts...
Running migration: 4_deploy_complexstorage.js
  Deploying ComplexStorage...
transaction hash of deploy contract:  0x479f6359d18d725821bb59afcf2b5791124b64659ed6a081d25347415344b4e3
  ComplexStorage: 0x986Dc6372cEF71A6Ff87DC47c9A0C12712D1304E // contract address may be different
Saving artifacts...
```

## 7. Test contract

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

###### Tutoral Token Test Begin ######

Balance of account1 before transfer: 12000

Transfer 2000 from account1 to account2......

Balance of account1 after transfer: 10000

###### Tutoral Token Test End ######

###### Complex Storage Contract Test Begin ######

string1: 0x74657374310000000000000000000000

string2: 0x7465737431323336000000000000000000000000000000000000000000000000

string3: lets string something

storeduint1: 15

###### Complex Storage Contract Test End ######
```
