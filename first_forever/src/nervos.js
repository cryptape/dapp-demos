const {
  default: Nervos
} = require('@nervos/web3')

const config = require('./config')

const nervos = Nervos(config.chain)
const account = nervos.eth.accounts.privateKeyToAccount(config.privateKey)

nervos.eth.accounts.wallet.add(account)

module.exports = nervos
