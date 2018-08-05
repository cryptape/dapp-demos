const nervos = require('../nervos')
const {
  abi,
  bytecode
} = require('./compiled.js')

const transaction = require('./transaction')
let _contractAddress = ''

nervos.appchain.getBlockNumber().then(current => {
  transaction.validUntilBlock = +current + 88 // update transaction.validUntilBlock
  return nervos.appchain.deploy(bytecode, transaction) // deploy contract
}).then(res => {
  const {
    contractAddress,
    errorMessage,
  } = res
  if (errorMessage) throw new Error(errorMessage)
  console.log(`contractAddress is: ${contractAddress}`)
  _contractAddress = contractAddress
  return nervos.appchain.storeAbi(contractAddress, abi, transaction) // store abi on the chain
}).then(res => {
  if (res.errorMessage) throw new Error(res.errorMessage)
  return nervos.appchain.getAbi(_contractAddress).then(console.log) // get abi from the chain
}).catch(err => console.error(err))
