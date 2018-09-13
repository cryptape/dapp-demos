const config = require('../truffle')
const host = `http://${config.networks.development.host}:${config.networks.development.port}`
const Nervos = require('@nervos/chain').default
const nervos = Nervos(host)
const fs = require('fs')
const transaction = require('./transaction.js')
const log = console.log.bind(console)

const createInstance = (jsonFileName) => {
    const storage = fs.readFileSync(`../build/contracts/${jsonFileName}.json`, {encoding: 'utf-8'})
    const artifact = JSON.parse(storage)
    const contractAddress = artifact.networks.appchain1.address
    const instance = new nervos.appchain.Contract(artifact.abi, contractAddress)
    return instance
}

//Test case for SimpleStorage.sol
const simpleContractInstance = createInstance('SimpleStorage')

const testSimpleStorage = () => {
    return simpleContractInstance.methods.storedData().call().then((storedData) => {
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

//Test case for TutorialToken.sol
// account 1
const account1 = nervos.appchain.accounts.privateKeyToAccount(transaction.privateKey).address
// fake account 2
// '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeef' is a fake address
const account2 = nervos.appchain.accounts.privateKeyToAccount('0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeef').address
const tutorialTokenInstance = createInstance('TutorialToken')

const testTutorialToken = () => {
    return tutorialTokenInstance.methods.balanceOf(account1).call().then((balance) => {
        log('###### Tutoral Token Test Begin ######\n')
        log('Balance of account1 before transfer:', `${balance} \n`)
        return nervos.appchain.getBlockNumber()
    }).then((blockNumber) => {
        const num = Number(blockNumber)
        transaction.validUntilBlock = num + 88
    }).then(() => {
        log(`Transfer 2000 from account1 to account2...... \n`)
        return tutorialTokenInstance.methods.transfer(account2, 2000).send(transaction)
    }).then((tx) => {
        return nervos.listeners.listenToTransactionReceipt(tx.hash)
    }).then((receipt) => {
        if(receipt.errorMessage === null) {
            return tutorialTokenInstance.methods.balanceOf(account1).call()
        } else {
            throw new Error(receipt.errorMessage)
        }
    }).then((balance) => {
        log('Balance of account1 after transfer:', `${balance} \n`)
        log('###### Tutoral Token Test End ###### \n')
    }).catch((err) => {
        log(err.message)
    })
}

//Test case for ComplexStorage.sol
const complexContractInstance = createInstance('ComplexStorage')

const testComplexStorage = () => {
    return complexContractInstance.methods.string1().call().then((string1) => {
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
    testSimpleStorage().then(() => {
        return testTutorialToken()
    }).then(() => {
        testComplexStorage()
    }).catch((err) => {
        log(err.message)
    })
}

__test()
