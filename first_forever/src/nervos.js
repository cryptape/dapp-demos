const {
  default: Nervos
} = require('@nervos/web3')

const config = require('./config')
if (typeof window.nervos !== 'undefined') {
  window.nervos = Nervos(window.nervos.currentProvider);
  window.nervos.currentProvider.setHost("https://node.cryptape.com");
} else {
  console.log('No Nervos web3? You should consider trying Neuron!')
  // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
  window.nervos = Nervos(config.chain);
}
var nervos = window.nervos

module.exports = nervos
