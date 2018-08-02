const nervos = require('../nervos')
const {
  abi
} = require('./compiled')
const transaction = require('./transaction')

const simpleStoreContract = new nervos.appchain.Contract(abi, '0x58C688Bbb76187aa92c13DF0395a578b45aDA7d9')


nervos.appchain.getBalance(nervos.eth.accounts.wallet[0].address).then(console.log)
nervos.appchain.getBlockNumber().then(current => {
  transaction.validUntilBlock = +current + 88
  return simpleStoreContract.methods.add('123', 1).send(transaction)
}).then(receipt => {
  console.log(receipt)
  return nervos.listeners.listenToTransactionReceipt(receipt.hash)
}).then(res => {
  console.log(res)
  setTimeout(() => {
    simpleStoreContract.methods.getList().call().then(console.log)
    simpleStoreContract.methods.get(1).call().then(console.log)
  }, 6000)
})
