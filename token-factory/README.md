# Token Factory

The Token Factory can create a simple standard ERC20 token on AppChain. It requires @nervos/chain  and it runs on the Neuron.(We highly recommend using the Neuron for a better experience).
It will tell you how transplant a Eth Dapp to AppChain.We build a [ConsenSys/Token-Factory](https://github.com/ConsenSys/Token-Factory) in AppChain and we use his contract.You can compare the transplant.
> Notice: Please read [First Forever](https://github.com/cryptape/dapp-demos/tree/develop/first-forever) first.It will show the entire process of building a MVP Dapp on Appchain.

>Notice: This demo build by create-react-app

>Notice：Fuction store in here[tokenStore](https://github.com/cryptape/dapp-demos/blob/develop/token-factory/src/contracts/tokenStore.js)

# Getting Started
## 1. Use Scaffold for Project

This Demo use `create-react-app` to start the project, so you need the `create-react-app` scaffold firstly

```shell
$ yarn global add create-react-app
```

After that the project can be initiated by

```shell
$ create-react-app first-forever && cd first-forever
```

Now the project looks like

```shell
├── README.md
├── package.json
├── public
│   ├── favicon.ico
│   ├── index.html
│   └── manifest.json
└── src
    ├── App.css
    ├── App.js
    ├── App.test.js
    ├── index.css
    ├── index.js
    ├── logo.svg
    ├── public
    └── registerServiceWorker.js
```

## 2. Add Components of the Dapp

This step is very familiar to webapp developers, [Router](https://github.com/cryptape/dapp-demos/blob/develop/token-factory/src/Router.jsx), [containers](https://github.com/cryptape/dapp-demos/tree/develop/token-factory/src/containers) and [components](https://github.com/cryptape/dapp-demos/tree/develop/token-factory/src/components) will be added to the Dapp

```shell
└── src
    ├── Router.jsx
    ├── components
    └── containers
```
All above are just traditional webapp development, and next we are going to dapp development.
## 3. Nervos.js

This step instructs how to have a Dapp running on Nervos Appchain and Neuron.

The Dapp interacts with Appchain by the `nervos.js` and details of `nervos` can be accessed at [@nervos/chain](https://www.npmjs.com/package/@nervos/chain)

In order to use nervos.js, add nervos.js as other packages by yarn `yarn add @nervos/chain`, and then instantiate `nervos` in `src/nervos.js`.

```javascript
const {
    default: Nervos
} = require('@nervos/chain')

if (typeof window.nervos !== 'undefined') {
    window.nervos = Nervos(window.nervos.currentProvider);
    window.nervos.currentProvider.setHost("http://121.196.200.225:1337");
} else {
    console.log('No Nervos web3? You should consider trying Neuron!')
    window.nervos = Nervos('http://121.196.200.225:1337');
}
var nervos = window.nervos

module.exports = nervos

```
##4.Basic ERC20 Contract
[Token.sol](https://github.com/cryptape/dapp-demos/blob/develop/token-factory/src/contracts/soli/Token.sol)
```
pragma solidity ^0.4.4;

contract Token {

    /// @return total amount of tokens
    function totalSupply() constant returns (uint256 supply) {}

    /// @param _owner The address from which the balance will be retrieved
    /// @return The balance
    function balanceOf(address _owner) constant returns (uint256 balance) {}

    /// @notice send `_value` token to `_to` from `msg.sender`
    /// @param _to The address of the recipient
    /// @param _value The amount of token to be transferred
    /// @return Whether the transfer was successful or not
    function transfer(address _to, uint256 _value) returns (bool success) {}

    /// @notice send `_value` token to `_to` from `_from` on the condition it is approved by `_from`
    /// @param _from The address of the sender
    /// @param _to The address of the recipient
    /// @param _value The amount of token to be transferred
    /// @return Whether the transfer was successful or not
    function transferFrom(address _from, address _to, uint256 _value) returns (bool success) {}

    /// @notice `msg.sender` approves `_addr` to spend `_value` tokens
    /// @param _spender The address of the account able to transfer the tokens
    /// @param _value The amount of wei to be approved for transfer
    /// @return Whether the approval was successful or not
    function approve(address _spender, uint256 _value) returns (bool success) {}

    /// @param _owner The address of the account owning tokens
    /// @param _spender The address of the account able to transfer the tokens
    /// @return Amount of remaining tokens allowed to spent
    function allowance(address _owner, address _spender) constant returns (uint256 remaining) {}

    event Transfer(address indexed _from, address indexed _to, uint256 _value);
    event Approval(address indexed _owner, address indexed _spender, uint256 _value);
}

```
[Standardtoken.sol](https://github.com/cryptape/dapp-demos/blob/develop/token-factory/src/contracts/soli/StandardToken.sol)
```
/*
This implements ONLY the standard functions and NOTHING else.
For a token like you would want to deploy in something like Mist, see HumanStandardToken.sol.

If you deploy this, you won't have anything useful.

Implements ERC 20 Token standard: https://github.com/ethereum/EIPs/issues/20
.*/

pragma solidity ^0.4.4;

import "./Token.sol";

contract StandardToken is Token {

    function transfer(address _to, uint256 _value) returns (bool success) {
        //Default assumes totalSupply can't be over max (2^256 - 1).
        //If your token leaves out totalSupply and can issue more tokens as time goes on, you need to check if it doesn't wrap.
        //Replace the if with this one instead.
        //if (balances[msg.sender] >= _value && balances[_to] + _value > balances[_to]) {
        if (balances[msg.sender] >= _value && _value > 0) {
            balances[msg.sender] -= _value;
            balances[_to] += _value;
            Transfer(msg.sender, _to, _value);
            return true;
        } else { return false; }
    }

    function transferFrom(address _from, address _to, uint256 _value) returns (bool success) {
        //same as above. Replace this line with the following if you want to protect against wrapping uints.
        //if (balances[_from] >= _value && allowed[_from][msg.sender] >= _value && balances[_to] + _value > balances[_to]) {
        if (balances[_from] >= _value && allowed[_from][msg.sender] >= _value && _value > 0) {
            balances[_to] += _value;
            balances[_from] -= _value;
            allowed[_from][msg.sender] -= _value;
            Transfer(_from, _to, _value);
            return true;
        } else { return false; }
    }

    function balanceOf(address _owner) constant returns (uint256 balance) {
        return balances[_owner];
    }

    function approve(address _spender, uint256 _value) returns (bool success) {
        allowed[msg.sender][_spender] = _value;
        Approval(msg.sender, _spender, _value);
        return true;
    }

    function allowance(address _owner, address _spender) constant returns (uint256 remaining) {
      return allowed[_owner][_spender];
    }

    mapping (address => uint256) balances;
    mapping (address => mapping (address => uint256)) allowed;
    uint256 public totalSupply;
}
```
[HumanStandardToken.sol](https://github.com/cryptape/dapp-demos/blob/develop/token-factory/src/contracts/soli/HumanStandardToken.sol)
```
/*
This Token Contract implements the standard token functionality (https://github.com/ethereum/EIPs/issues/20) as well as the following OPTIONAL extras intended for use by humans.

In other words. This is intended for deployment in something like a Token Factory or Mist wallet, and then used by humans.
Imagine coins, currencies, shares, voting weight, etc.
Machine-based, rapid creation of many tokens would not necessarily need these extra features or will be minted in other manners.

1) Initial Finite Supply (upon creation one specifies how much is minted).
2) In the absence of a token registry: Optional Decimal, Symbol & Name.
3) Optional approveAndCall() functionality to notify a contract if an approval() has occurred.

.*/
pragma solidity ^0.4.4;

import "./StandardToken.sol";

contract HumanStandardToken is StandardToken {

    function () {
        //if ether is sent to this address, send it back.
        throw;
    }

    /* Public variables of the token */

    /*
    NOTE:
    The following variables are OPTIONAL vanities. One does not have to include them.
    They allow one to customise the token contract & in no way influences the core functionality.
    Some wallets/interfaces might not even bother to look at this information.
    */
    string public name;                   //fancy name: eg Simon Bucks
    uint8 public decimals;                //How many decimals to show. ie. There could 1000 base units with 3 decimals. Meaning 0.980 SBX = 980 base units. It's like comparing 1 wei to 1 ether.
    string public symbol;                 //An identifier: eg SBX
    string public version = 'H0.1';       //human 0.1 standard. Just an arbitrary versioning scheme.

    function HumanStandardToken(
        uint256 _initialAmount,
        string _tokenName,
        uint8 _decimalUnits,
        string _tokenSymbol
        ) {
        balances[msg.sender] = _initialAmount;               // Give the creator all initial tokens
        totalSupply = _initialAmount;                        // Update total supply
        name = _tokenName;                                   // Set the name for display purposes
        decimals = _decimalUnits;                            // Amount of decimals for display purposes
        symbol = _tokenSymbol;                               // Set the symbol for display purposes
    }

    /* Approves and then calls the receiving contract */
    function approveAndCall(address _spender, uint256 _value, bytes _extraData) returns (bool success) {
        allowed[msg.sender][_spender] = _value;
        Approval(msg.sender, _spender, _value);

        //call the receiveApproval function on the contract you want to be notified. This crafts the function signature manually so one doesn't have to include a contract in here just for this.
        //receiveApproval(address _from, uint256 _value, address _tokenContract, bytes _extraData)
        //it is assumed that when does this that the call *should* succeed, otherwise one would use vanilla approve instead.
        if(!_spender.call(bytes4(bytes32(sha3("receiveApproval(address,uint256,address,bytes)"))), msg.sender, _value, this, _extraData)) { throw; }
        return true;
    }
}
```
Smart Contract can be debugged on [Remix](https://remix.ethereum.org/), an online solidity debugger

In details, **bytecode** and **abi** will be used in this demo.

**bytecode** is used to deploy the contract, and **abi** is used to instantiate a contract instance for interacting.
### Deploy
- Store SimpleStore Source Code in [contracts](https://github.com/cryptape/dapp-demos/tree/develop/token-factory/src/contracts/soli)

- Store **bytecode** and **abi** in [compiled.js](https://github.com/cryptape/dapp-demos/blob/develop/token-factory/src/contracts/compiled.js)

- Store transaction template in [transaction.js](https://github.com/cryptape/dapp-demos/blob/develop/token-factory/src/contracts/transaction.js)
```
const transaction = {
    nonce: 999999,
    quota: 1000000000,
    chainId: 1,
    version: 0,
    validUntilBlock: 999999,
};

module.exports = transaction
```
-Depoly with args
```
export const getTX = () =>
  nervos.appchain.getBlockNumber().then(current => {
    //const tx = {
    //  ...transaction,
    //  from: "your address",
    //  validUntilBlock: +current + 88,
    //  privateKey: "your private key"
    //};
     const tx = {
       ...transaction,
       from: window.neuron.getAccount(),
       validUntilBlock: +current + 88
     };
    return tx;
  });
```
First setting is deploy by @nervos/chain.Second setting is deploy on Neuron.
```
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
            console.log(err);
            reject(err.errorMessage);
          });
      })
      .catch(err => {
        console.log(err);
        reject(err.errorMessage);
      });
  });
};
```
<h5>Notice:There is a different in send(tx) return,if you run in Neuron,it will return just hash like this </h5>

0x0f3304454f47bd1c4a60ef68547d279f5c4deba6f30947c8ed53526f2bed099c

<h5>If you run in explorer,it will return a json like this</h5>

{hash: "0x0f3304454f47bd1c4a60ef68547d279f5c4deba6f30947c8ed53526f2bed099c", status: "OK"}

```
deploy([
        this.state.input_totally_supply,
        this.state.input_name,
        this.state.input_decimal_places,
        this.state.input_symbol
      ])
        .then(receipt => {
          console.log(receipt.contractAddress);
          if (receipt.contractAddress) {
            this.setState({ button_text: "Success!" });
            this.props.history.push("/token/" + receipt.contractAddress);
          } else {
            this._error(receipt.errorMessage);
          }
        })
        .catch(err => this._error(err));
    }
```
## Integrate Contract into Dapp
[tokenStore.js](https://github.com/cryptape/dapp-demos/blob/develop/token-factory/src/contracts/tokenStore.js)
### 1.Get Name,Symbol,Decimals,TotalSupply
```
export const getAttrs = async function (contract, attr) {
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
```
### 2.Get BalanceOf,CheckAllowance
```
export const balanceOf = async function (contract, address) {
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

export const checkAllowance = async function (contract, owner, spender) {
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
```
### 2.Transfer send(tx)
```
export const getTX = () =>
  nervos.appchain.getBlockNumber().then(current => {
    //const tx = {
    //  ...transaction,
    //  from: "your address",
    //  validUntilBlock: +current + 88,
    //  privateKey: "your private key"
    //};
     const tx = {
       ...transaction,
       from: window.neuron.getAccount(),
       validUntilBlock: +current + 88
     };
    return tx;
  });
```
```
export const transfer = async function (contract, to, amount) {
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
```
### 3.Neuron special callback
If you run on the Neuron,we have two callbacks.There are not in @nervos/chain.

```
onSignError(position, protocol)
```
When you cancel action of sign or get some error,we will callback on onSignError.

```
onSignSuccessful(position, protocol)
```
When sign successfully,we will callback on onSignSuccessful.
<h4>Notice: If you add onSignSuccess callback,send(tx) will not return Promise!You can use it like this.</h4>

[TransferAllowance.jsx](https://github.com/cryptape/dapp-demos/blob/develop/token-factory/src/containers/TokenPage/func/TransferAllowance.jsx)

```
 export const transferAllowance = function (contract, from, to, amount) {
     getTX().then(tx => {
         getTokenContract(contract)
             .methods.transferFrom(from, to, amount)
             .send(tx)
             .then()
     });
 };
 
 _transferFrom() {
    if (
      this.state.to !== "" &&
      this.state.from !== "" &&
      this.state.amount !== ""
    ) {
      window.onSignError = (position, protocol) =>
        this._onSignError(position, protocol);
      window.onSignSuccessful = (position, protocol) =>
        this._onSignSuccessful(position, protocol);
      this.setState({ button_status: false, button_text: "Submitting..." });
      transferAllowance(
        this.props.contractAddress,
        this.state.from,
        this.state.to,
        this.state.amount
      );
    }
  }

  _onSignError(position, protocol) {
    alert(protocol);
    this.setState({
      button_status: true,
      button_text: "Transfer Amount"
    });
  }

  _onSignSuccessful(position, protocol) {
    alert(protocol);
    this.setState({
      button_text: "pending..."
    });
    window.onSignSuccessful = null;
    window.nervos.listeners
      .listenToTransactionReceipt(protocol)
      .then(receipt => {
        console.log(receipt);
        if (!receipt.errorMessage) {
          this.setState({
            result:
              this.state.amount +
              " has been transferred to " +
              this.state.to +
              " from " +
              this.state.from,
            button_status: true,
            button_text: "Transfer Allowance"
          });
        } else {
          alert(receipt.errorMessage);
          this.setState({
            button_status: true,
            button_text: "Transfer Allowance"
          });
        }
      })
      .catch(err => {
        alert(JSON.stringify(err));
        this.setState({
          button_status: true,
          button_text: "Transfer Allowance"
        });
      });
  }
```

<h4>It just works on Neuron!If you use explorer,it will not works.Please use 2.Transfer send(tx) </h4>
