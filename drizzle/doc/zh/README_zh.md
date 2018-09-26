# Demo3: Drizzle Truffle Box

这个 demo 使用 drizzle-truffle-box 作为例子展示如何使用 [AppChain-Truffle-Migrate](https://github.com/cryptape/appchain-truffle-migrate) 部署多个合约。

# 如何让 demo 跑起来

## 1. 全局安装 truffle

```shell
npm install -g truffle
```

## 2. 下载仓库

下载仓库。

```shell
git clone https://github.com/cryptape/dapp-demos.git
```
进入 drizzle 文件夹。

```shell
cd dapp-demos
cd drizzle
```

## 3. 安装依赖

```shell
yarn install
```

或者

```shell
npm install
```

## 4. 配置参数

创建 truffle.js。

```shell
cp truffle.js.example truffle.js
```

## 5. 编译合约

```shell
truffle compile
```

windows 下执行：

```shell
truffle.cmd compile
```

## 6. 部署合约
> 注意: 我们使用 [AppChain-Truffle-Migrate](https://github.com/cryptape/appchain-truffle-migrate) 来部署合约, 所以使用的命令与 truffle-box 有所不同。

```shell
yarn migrate
```
如果终端显示以下信息，代表已经成功部署多个合约。

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

## 7. 测试合约

为了验证所有合约已经成功部署，将文件目录切换至 contracts，并运行 contract.test.js。

```shell
cd contracts
node contract.test.js
```
终端将会显示测试结果。

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
