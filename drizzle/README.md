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

## 4. Configuration

Create truffle.js.

```shell
cp truffle.js.example truffle.js
```

## 5. Compile the smart contracts

```shell
truffle compile
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
transaction hash of deploy contract:  0xe2e65438943162897c2aaaaeb8efdb00ac0f190f6a4ed78cff95ffc58f6fb45a
  Migrations: 0x46A44Fd45d775d29ce4ba3Aa2079BD7b1C2882b1 // contract address may be different
Saving artifacts...
Running migration: 2_deploy_simplestorage.js
  Deploying SimpleStorage...
transaction hash of deploy contract:  0xc33ee84de7b7cd649befdfdece8c7623380fe978ecbbd1d615c33b72a52bd4bd
  SimpleStorage: 0x06f24BC6db34229CBd258171e3310084fe20E540 // contract address may be different
Saving artifacts...
Running migration: 3_deploy_tutorialtoken.js
  Deploying TutorialToken...
transaction hash of deploy contract:  0x646f1abe3ca3c2180f290e9b0f6a67cf4ae32295d744db94fe4325d56ea8bf21
  TutorialToken: 0xe72fe688d5dADb0CeDc6681479497e7f40061cCD // contract address may be different
Saving artifacts...
Running migration: 4_deploy_complexstorage.js
  Deploying ComplexStorage...
transaction hash of deploy contract:  0x6cf131425649a9f5ce7c25bcd80342f1e1f9417558bc51d80f35f56a2b4cf4dd
  ComplexStorage: 0xD468D53CAB68BB457B9cbc28Bb04bE6D3334D800 // contract address may be different
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
