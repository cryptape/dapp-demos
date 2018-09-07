//初始化 nervos
const Nervos = require('@nervos/chain').default
const nervos = Nervos('http://121.196.200.225:1337')

const log = console.log.bind(console)

const transaction = {
    from: '0XB4061FA8E18654A7D51FEF3866D45BB1DC688717',
    privateKey: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
    nonce: 999999,
    quota: 99999999,
    chainId: 1,
    version: 0,
    validUntilBlock: 999999,
    value: '0x0'
};

// 获取账户地址
const {address} = nervos.appchain.accounts.privateKeyToAccount(
    transaction.privateKey
)

const fs = require('fs')

// 读取 SimpleStorage.json 文件
const simpleStorage = fs.readFileSync('../build/contracts/SimpleStorage.json', {encoding: 'utf-8'})
const simpleStorageArtifact = JSON.parse(simpleStorage)
const contract_address = simpleStorageArtifact.networks.appchain1.address

//实例化合约
const simpleContractInstance = new nervos.appchain.Contract(simpleStorageArtifact.abi, contract_address)

simpleContractInstance.methods.storedData().call().then((storedData) => {
    log('###### Simple Storage Contract Test Begin ######\n')
    log('Stored Data before set:', `${storedData} \n`)
    return nervos.appchain.getBlockNumber()
}).then((blockNumber) => {
    const num = Number(blockNumber)
    transaction.validUntilBlock = num + 88
}).then(() => {
    log(`Set stored date to 40 \n`)
    return simpleContractInstance.methods.set(40).send(transaction)
}).then((tx) => {
    return nervos.listeners.listenToTransactionReceipt(tx.hash)
}).then((receipt) => {
    if(receipt.errorMessage === null) {
        return simpleContractInstance.methods.storedData().call()
    } else {
        throw new Error(receipt.errorMessage)
    }
}).then((storedData) => {
    log('Stored Data after set:', `${storedData} \n`)
    log('###### Simple Storage Contract Test End ###### \n')
}).catch((err) => {
    log(err.message)
})
