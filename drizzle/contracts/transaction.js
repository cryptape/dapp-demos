const nervos = require('../nervos')
const transaction = {
  from: nervos.eth.accounts.wallet[0].address,
  privateKey: nervos.eth.accounts.wallet[0].privateKey,
  nonce: 999999,
  quota: 99999999,
  chainId: 1,
  version: 0,
  validUntilBlock: 999999,
  value: '0x0'
};

module.exports = transaction
