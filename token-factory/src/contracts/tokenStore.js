import { abi, bytecode } from "../contracts/compiled";

const nervos = require("../nervos");
const transaction = require("./transaction");

export const getAbi = function(contractAddress) {
  return nervos.appchain.getAbi(contractAddress);
};

export const getContract = function(abi, contractAddress) {
  return new nervos.appchain.Contract(abi, contractAddress);
};

export const deploy = async function(args) {
  return new Promise((resolve, reject) => {
    getTX()
      .then(tx => {
        const contract = new window.nervos.appchain.Contract(abi);
        contract
          .deploy({ data: bytecode, arguments: args })
          .send(tx)
          .then(res => {
            console.log(res);
            let hash;
            if (JSON.stringify(res).indexOf("hash") !== -1) {
              hash = res.hash;
            } else {
              hash = res;
            }
            if (hash) {
              return window.nervos.listeners
                .listenToTransactionReceipt(hash)
                .then(receipt => {
                  console.log(JSON.stringify(receipt));
                  if (!receipt.errorMessage) {
                    resolve(receipt);
                  } else {
                    reject(receipt.errorMessage);
                  }
                });
            } else {
              reject("No Transaction Hash Received");
            }
          })
          .catch(err => {
            console.log(err.errorMessage);
            reject(err.errorMessage);
          });
      })
      .catch(err => {
        console.log(err);
        reject(err.errorMessage);
      });
  });
};

export const getTokenContract = function(contractAddress) {
  return getContract(abi, contractAddress);
};

export const getTX = () =>
  nervos.appchain.getBlockNumber().then(current => {
    // const tx = {
    //   ...transaction,
    //   from: "your address",
    //   validUntilBlock: +current + 88,
    //   privateKey:
    //     "your private key"
    // };
    const tx = {
      ...transaction,
      from: window.neuron.getAccount(),
      validUntilBlock: +current + 88
    };
    return tx;
  });

export const getAttrs = async function(contract, attr) {
  return await new Promise((resolve, reject) => {
    if (attr === "name") {
      getTokenContract(contract)
        .methods.name()
        .call()
        .then(name => resolve(name))
        .catch(err => reject(err));
    } else if (attr === "symbol") {
      getTokenContract(contract)
        .methods.symbol()
        .call()
        .then(symbol => resolve(symbol))
        .catch(err => reject(err));
    } else if (attr === "decimals") {
      getTokenContract(contract)
        .methods.decimals()
        .call()
        .then(decimals => resolve(decimals))
        .catch(err => reject(err));
    } else if (attr === "totalSupply") {
      getTokenContract(contract)
        .methods.totalSupply()
        .call()
        .then(totalSupply => resolve(totalSupply))
        .catch(err => reject(err));
    }
  });
};

export const balanceOf = async function(contract, address) {
  return await new Promise((resolve, reject) => {
    getTokenContract(contract)
      .methods.balanceOf(address)
      .call()
      .then(balance => {
        resolve(balance);
      })
      .catch(err => reject(err));
  });
};

export const checkAllowance = async function(contract, owner, spender) {
  return await new Promise((resolve, reject) => {
    getTokenContract(contract)
      .methods.allowance(owner, spender)
      .call()
      .then(remaining => {
        resolve(remaining);
      })
      .catch(err => reject(err));
  });
};

export const transfer = async function(contract, to, amount) {
  return await new Promise((resolve, reject) => {
    getTX().then(tx => {
      getTokenContract(contract)
        .methods.transfer(to, amount)
        .send(tx)
        .then(res => {
          console.log(res);
          let hash;
          if (JSON.stringify(res).indexOf("hash") !== -1) {
            hash = res.hash;
          } else {
            hash = res;
          }
          if (hash) {
            window.nervos.listeners
              .listenToTransactionReceipt(hash)
              .then(receipt => {
                console.log(receipt);
                if (!receipt.errorMessage) {
                  resolve(receipt);
                } else {
                  reject(receipt.errorMessage);
                }
              })
              .catch(err => {
                console.log(err);
                reject(err);
              });
          } else {
            reject("No Transaction Hash Received");
          }
        })
        .catch(err => {
          console.log(err);
          resolve(err.errorMessage);
        });
    });
  });
};

export const approveAccount = async function(contract, to, amount) {
  return await new Promise((resolve, reject) => {
    getTX().then(tx => {
      getTokenContract(contract)
        .methods.approve(to, amount)
        .send(tx)
        .then(res => {
          console.log(res);
          let hash;
          if (JSON.stringify(res).indexOf("hash") !== -1) {
            hash = res.hash;
          } else {
            hash = res;
          }
          if (hash) {
            window.nervos.listeners
              .listenToTransactionReceipt(hash)
              .then(receipt => {
                console.log(receipt);
                if (!receipt.errorMessage) {
                  resolve(receipt);
                } else {
                  reject(receipt.errorMessage);
                }
              })
              .catch(err => {
                console.log(err);
                reject(err);
              });
          } else {
            reject("No Transaction Hash Received");
          }
        })
        .catch(err => {
          console.log(err);
          resolve(err.errorMessage);
        });
    });
  });
};

export const transferAllowance = function(contract, from, to, amount) {
  getTX().then(tx => {
    getTokenContract(contract)
      .methods.transferFrom(from, to, amount)
      .send(tx)
      .then();
  });
};
