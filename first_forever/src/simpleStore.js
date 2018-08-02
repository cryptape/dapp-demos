const nervos = require('./nervos')
const {
  abi
} = require('./contracts/compiled.js')

const contractAddress = '0xfA18183919B7D8555C490eC148C91A94a60ddE67'

const transaction = require('./contracts/transaction')
const simpleStoreContract = new nervos.appchain.Contract(abi, contractAddress)
module.exports = {
  transaction,
  simpleStoreContract
}
