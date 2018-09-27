const nervos = require('../nervos')
const transaction = {
<<<<<<< HEAD:first-forever/src/contracts/transaction.js
  from: nervos.appchain.accounts.wallet[0].address,
  privateKey: nervos.appchain.accounts.wallet[0].privateKey,
=======
>>>>>>> cf315606505c3dbbdf80761af9a1c94128e86990:first_forever/src/contracts/transaction.js
  nonce: 999999,
  quota: 1000000,
  chainId: 1,
  version: 0,
  validUntilBlock: 999999,
  value: '0x0'
};

module.exports = transaction
