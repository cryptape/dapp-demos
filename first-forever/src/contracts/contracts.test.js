const nervos = require('../nervos')
const {
  abi
} = require('./compiled')
const {
  contractAddress
} = require('../config')
const transaction = require('./transaction')

const simpleStoreContract = new nervos.appchain.Contract(abi, contractAddress) // instantiate contract


nervos.appchain.getBalance(nervos.eth.accounts.wallet[0].address).then(console.log) // check balance of account
console.log(`Interact with contract at ${contractAddress}`)
const time = new Date().getTime()
const text = 'hello world at ' + time

test(`Add record of (${text}, ${time})`, async () => {
  const current = await nervos.appchain.getBlockNumber()
  transaction.validUntilBlock = +current + 88 // update transaction.validUntilBlock
  const txResult = await simpleStoreContract.methods.add(text, time).send(transaction) // sendTransaction to the contract
  const receipt = await nervos.listeners.listenToTransactionReceipt(txResult.hash) // listen to the receipt
  expect(receipt.errorMessage).toBeNull()
}, 10000)

test(`Get record of (${text}, ${time})`, async () => {
  const list = await simpleStoreContract.methods.getList().call({
    from: transaction.from
  }) // check list
  const msg = await simpleStoreContract.methods.get(time).call({
    from: transaction.from
  }) // check message
  expect(+list[list.length - 1]).toBe(time)
  expect(msg).toBe(text)
}, 3000)
