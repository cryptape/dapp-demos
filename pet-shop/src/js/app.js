<<<<<<< HEAD
const nervos = Nervos(config.chain)
=======
var nervos

if (typeof nervos !== 'undefined') {
    nervos = Nervos(nervos.currentProvider)
    nervos.currentProvider.setHost(config.chain)
} else {
    console.log('No Nervos? You should consider trying Neuron!')
    nervos = Nervos(config.chain)
}

>>>>>>> cf315606505c3dbbdf80761af9a1c94128e86990
App = {
    contracts: {},

    init: () => {
        // Load pets.
<<<<<<< HEAD
        $.getJSON('../pets.json', (data) => {
=======
        $.getJSON('pets.json', (data) => {
>>>>>>> cf315606505c3dbbdf80761af9a1c94128e86990
            const petsRow = $('#petsRow')
            const petTemplate = $('#petTemplate')

            for (i = 0; i < data.length; i++) {
                petTemplate.find('.panel-title').text(data[i].name)
                petTemplate.find('img').attr('src', data[i].picture)
                petTemplate.find('.pet-breed').text(data[i].breed)
                petTemplate.find('.pet-age').text(data[i].age)
                petTemplate.find('.pet-location').text(data[i].location)
                petTemplate.find('.btn-adopt').attr('data-id', data[i].id)

                petsRow.append(petTemplate.html())
            }
        })

        return App.initContract()
    },

    initContract: () => {

        $.getJSON('Adoption.json', (data) => {
            // Get the necessary contract artifact file and instantiate it with nervos api
            const AdoptionArtifact = data;

            App.contracts.bytecode = AdoptionArtifact.bytecode
            const contract_address = AdoptionArtifact.networks.appchain1.address
            App.contracts.Adoption = new nervos.appchain.Contract(AdoptionArtifact.abi, contract_address)


            // Use our contract to retrieve and mark the adopted pets
            return App.markAdopted()
        })

        return App.bindEvents()
    },

    bindEvents: () => {
        $(document).on('click', '.btn-adopt', App.handleAdopt)
    },

    markAdopted: (adopters, account) => {
        App.contracts.Adoption.methods.getAdopters().call().then((adopters) => {
            for (i = 0; i < adopters.length; i++) {
                if (adopters[i] !== '0x0000000000000000000000000000000000000000') {
                    $('.panel-pet').eq(i).find('button').text('Success').attr('disabled', true)
                }
            }
        }).catch((err) => {
            console.log(err.message)
        })
    },

    handleAdopt: (event) => {
        event.preventDefault()

        let petId = parseInt($(event.target).data('id'))

        const transaction = {
            from: '0x46a23E25df9A0F6c18729ddA9Ad1aF3b6A131160',
<<<<<<< HEAD
            privateKey: config.privateKey,
=======
            // privateKey: config.privateKey,
>>>>>>> cf315606505c3dbbdf80761af9a1c94128e86990
            nonce: 999999,
            quota: 1000000,
            data: App.contracts.bytecode,
            chainId: 1,
            version: 0,
            validUntilBlock: 999999,
            value: '0x0'
        }

        nervos.appchain.getBlockNumber().then((res) => {
            const num = Number(res)
            transaction.validUntilBlock = num + 88
        }).then(() => {
<<<<<<< HEAD
            return App.contracts.Adoption.methods.adopt(petId).send(transaction)
        }).then((result) => {
            console.log('Waiting for transaction result')
            alert('Waiting for transaction result')
            return nervos.listeners.listenToTransactionReceipt(result.hash)
        }).then((receipt) => {
            if(receipt.errorMessage === null) {
                console.log('Transaction Done!')
                alert('Transaction Done!')
                return App.markAdopted()
            } else {
                throw new Error(receipt.errorMessage)
            }
        }).catch((err) => {
            console.log(err.message)
=======
            console.log(transaction)
            App.contracts.Adoption.methods.adopt(petId).send(transaction, function(err, res) {
                if (res) {
                    console.log("transaction response: " + JSON.stringify(res))
                    nervos.listeners.listenToTransactionReceipt(res)
                        .then(receipt => {
                            if (!receipt.errorMessage) {
                                console.log('Transaction Done!')
                                alert('Transaction Done!')
                                return App.markAdopted()
                            } else {
                                throw new Error(receipt.errorMessage)
                            }
                        })
                } else {
                    console.log(err.message)
                }
            })
>>>>>>> cf315606505c3dbbdf80761af9a1c94128e86990
        })
    }
}

$(() => {
    $(window).load(() => {
        App.init()
    })
})
