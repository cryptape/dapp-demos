const Nervos = require('@nervos/chain').default
const nervos = Nervos('http://121.196.200.225:1337')
const fs = require('fs')
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

const {address} = nervos.appchain.accounts.privateKeyToAccount(
    transaction.privateKey
)

const simpleStorage = fs.readFileSync('../build/contracts/SimpleStorage.json', {encoding: 'utf-8'})
const simpleStorageArtifact = JSON.parse(simpleStorage)
const contract_address = simpleStorageArtifact.networks.appchain1.address

const simpleContractInstance = new nervos.appchain.Contract(simpleStorageArtifact.abi, contract_address)

const testSimpleStorage = () => {
    simpleContractInstance.methods.storedData().call().then((storedData) => {
        log('###### Simple Storage Contract Test Begin ######\n')
        log('Stored Data before set:', `${storedData} \n`)
        return nervos.appchain.getBlockNumber()
    }).then((blockNumber) => {
        const num = Number(blockNumber)
        transaction.validUntilBlock = num + 88
    }).then(() => {
        log(`Set stored date to 40...... \n`)
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
}

const complexStorage = fs.readFileSync('../build/contracts/ComplexStorage.json', {encoding: 'utf-8'})
const complexStorageArtifact = JSON.parse(complexStorage)
const complex_contract_address = complexStorageArtifact.networks.appchain1.address

const complexContractInstance = new nervos.appchain.Contract(complexStorageArtifact.abi, complex_contract_address)

const testComplexStorage = () => {
    complexContractInstance.methods.string1().call().then((string1) => {
        log('###### Complex Storage Contract Test Begin ######\n')
        log('string1:', `${string1} \n`)
        return complexContractInstance.methods.string2().call()
    }).then((string2) => {
        log('string2:', `${string2} \n`)
        return complexContractInstance.methods.string3().call()
    }).then((string3) => {
        log('string3:', `${string3} \n`)
        return complexContractInstance.methods.storeduint1().call()
    }).then((storeduint1) => {
        log('storeduint1:', `${storeduint1} \n`)
        log('###### Complex Storage Contract Test End ######\n')
    }).catch((err) => {
        log(err.message)
    })
}

const __test = () => {
    testSimpleStorage()
    testComplexStorage()
}

__test()
