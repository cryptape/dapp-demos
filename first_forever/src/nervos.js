const {
  default: Nervos
} = require('@nervos/chain')

const config = require('./config')

// const nervos = Nervos(config.chain) // config.chain indicates that the address of Appchain to interact
if (typeof window.nervos !== 'undefined') {
  window.nervos = Nervos(window.nervos.currentProvider);
  window.nervos.currentProvider.setHost("http://121.196.200.225:1337");
} else {
  console.log('No Nervos web3? You should consider trying Neuron!')
  // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
  window.nervos = Nervos(config.chain);
}
var nervos = window.nervos

module.exports = nervos
