const config = require('../truffle')
const transaction = {
    from: '0XB4061FA8E18654A7D51FEF3866D45BB1DC688717',
    privateKey: config.networks.development.privateKey,
    nonce: 999999,
    quota: 99999999,
    chainId: 1,
    version: 0,
    validUntilBlock: 999999,
    value: '0x0'
}

module.exports = transaction
