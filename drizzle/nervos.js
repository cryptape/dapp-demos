const {
    default: Nervos
} = require('@nervos/chain')

const config = require('./config')

const nervos = Nervos(config.chain) // config.chain indicates that the address of Appchain to interact
const account = nervos.eth.accounts.privateKeyToAccount(config.privateKey) // create account by private key from config

nervos.eth.accounts.wallet.add(account) // add account to nervos

module.exports = nervos
