const nervos = require('../nervos')
const {
  abi
} = require('./compiled')
const {
  contractAddress
} = require('../config')
const transaction = require('./transaction')

const simpleStoreContract = new nervos.appchain.Contract(abi, contractAddress)


nervos.appchain.getBalance(nervos.eth.accounts.wallet[0].address).then(console.log)
console.log(`Interact with contract at ${contractAddress}`)
const text = 'hello world'
const time = new Date().getTime()
nervos.appchain.getBlockNumber().then(current => {
  transaction.validUntilBlock = +current + 88
  console.log(`Add record of (${text}, ${time})`)
  return simpleStoreContract.methods.add(text, time).send(transaction)
}).then(receipt => {
  console.log(receipt)
  return nervos.listeners.listenToTransactionReceipt(receipt.hash)
}).then(res => {
  console.log(res)
  setTimeout(() => {
    simpleStoreContract.methods.getList().call({
      from: transaction.from
    }).then(console.log)
    simpleStoreContract.methods.get(time).call({
      from: transaction.from
    }).then(console.log)
  }, 6000)
})
