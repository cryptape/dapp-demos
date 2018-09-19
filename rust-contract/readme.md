# Rust 语言智能合约示例
这个教程讲解了如何用 Rust 来实现一个 AppChain 上的智能合约。

## 依赖说明

Rust原生智能合约目前需要与CITA源码工程一起编译、部署，尚未支持通过发送交易进行独立部署。因此，使用Rust原生合约，需要首先获得[CITA源码库](https://github.com/cryptape/cita)，推荐在CITA工程（$CITA_SRC_PATH/cita-executor/core/src/native，其中CITA_SRC_PATH为cita的源码根目录）中编写Rust原生合约代码。


## 编写智能合约

也许你已经熟悉了solidity的智能合约编写，本说明材料以solidity智能合约为样例，为你展现如何用Rust完成一个同样逻辑能力的原生合约，并进一步为您说明为何当前Rust语言需要如是实现。

```
pragma solidity ^0.4.19;

contract HelloWorld {
    uint public balance;

    function update(uint amount) public returns (uint) {
        balance += amount;
        return (balance);
    }
}
```

上面的代码段定义了一个名HelloWorld的合约，合约的内容也非常简单，定义了一个变量balance，然后定义一个对这个变量的update操作，非常易懂。然而，要用Rust语言去定义同样的合约逻辑就需要劳神许多，原因在于Rust原生合约接口封装层次还不够高的原故（期待后续我们会有更多的优化！！）。不过没有关系，下文将带你风风火火走一回：

### I. 定义合约变量

 这里定义了合约变量balance。你是不是觉得很奇怪，为什么还要定义一个output的变量？因为update操作中有返回值，在solidity中返回值的处理由系统封装好了，对编写合约者呈现；但在Rust中，返回值则需要合约编写者自己处理，而这里定义的output是用来处理返回值的，你将在下文的合约实现看到。

```
pub struct HelloWorld {
    balance: Scalar,
    output: Vec<u8>,
}
```

### II. 定义合约

下面的示例代码看起来有点复杂，对吗？实现Rust原生合约至少需要实现exec与create这两个方法，当创建合约时，CITA会调用合约的create方法；而当外部调用合约（如下文的合约调用）时，CITA调用的是exec方法。

```
impl Contract for HelloWorld {
    fn exec(&mut self, params: ActionParams, ext: &mut Ext) -> Result<GasLeft, evm::Error> {
        let signature = BigEndian::read_u32(params.clone().data.unwrap().get(0..4).unwrap());
        match signature {
            0 => self.init(params, ext),
            0x832b4580 => self.balance_get(params, ext),
            0xaa91543e => self.update(params, ext),
            _ => Err(evm::Error::OutOfGas),
        }
    }
    fn create(&self) -> Box<Contract> {
        Box::new(HelloWorld::default())
    }
}

impl Default for HelloWorld {
    fn default() -> Self {
        HelloWorld {
            output: Vec::new(),
            balance: Scalar::new(H256::from(0)),
        }
    }
}
```

一个智能合约里会存在多个方法，而所有调用都会从exec入口进入，正如你所料，exec中还需要你为每个合约方法进行分类执行：

```
0xaa91543e => self.update(params, ext)
```

前面的字符串“0xaa91543e”称为方法的签名，这个值由你随意确定，只要保证在这个合约中各个方法的签名同便可。
solidity会为其合约中的public变量自动生成get方法，而在Rust中，变量的get方法需由你来实现，因此，在上面的合约实现中还有一个self.balance_get方法。

```
0x832b4580 => self.balance_get(params, ext)
```

### III. 实现合约接口

在这小节里，首先看一下HelloWorld实现的总体代码，也有些难懂！不过没有关系，这里将重点介绍实现合约方法update的实现，相信你能get到Rust合约方法实现的大概。

```
impl HelloWorld {
    fn init(&mut self, _params: ActionParams, _ext: &mut Ext) -> Result<GasLeft, evm::Error> {
        Ok(GasLeft::Known(U256::from(100)))
    }

    fn balance_get(&mut self, _params: ActionParams, ext: &mut Ext) -> Result<GasLeft, evm::Error> {
        self.output.resize(32, 0);
        self.balance
            .get(ext)?
            .to_big_endian(self.output.as_mut_slice());
        Ok(GasLeft::NeedsReturn {
            gas_left: U256::from(100),
            data: ReturnData::new(self.output.clone(), 0, self.output.len()),
            apply_state: true,
        })
    }

    fn update(&mut self, params: ActionParams, ext: &mut Ext) -> Result<GasLeft, evm::Error> {
        self.output.resize(32, 0);

        // 从params获取update的参数
        let amount = U256::from(
            params
                .data
                .expect("invalid data")
                .get(4..36)
                .expect("no enough data"),
        );
        let _balance = self.balance.get(ext)?.saturating_add(amount);
        self.balance.set(ext, _balance)?;

        _balance.to_big_endian(self.output.as_mut_slice());
        Ok(GasLeft::NeedsReturn {
            gas_left: U256::from(100),
            data: ReturnData::new(self.output.clone(), 0, self.output.len()),
            apply_state: true,
        })
    }
}
```

**a. 获得参数amount**
update方法中的参数amount需要从params中解析，取的是参数据4..36字节。那么，params是何方神圣？它其实是你在make_tx时传入的`--code "aa91543e0000000000000000000000000000000000000500"`值（详见下文的构造交易），聪明的你，相信很清楚地知道4..36字节表示的是什么！

```
       let amount = U256::from(
            params
                .data
                .expect("invalid data")
                .get(4..36)
                .expect("no enough data"),
        );
```

**b. 实现逻辑`balance += amount`**
这段代码很简单，不作过多解释。

```
        let _balance = self.balance.get(ext)?.saturating_add(amount);
        self.balance.set(ext, _balance)?;
```

**c. 处理返回值return balance**

```
       _balance.to_big_endian(self.output.as_mut_slice());
        Ok(GasLeft::NeedsReturn {
            gas_left: U256::from(100),
            data: ReturnData::new(self.output.clone(), 0, self.output.len()),
            apply_state: true,
        })
```

## 编写合约部署

Rust原生合约当前是随CITA启动直接启动的，并不像部署solidity需要发送交易来部署合约。这里需要在CITA factory.rs（$CITA_SRC_PATH/cita-executor/core/src/native，其中CITA_SRC_PATH为cita的源码根目录）中的加入合约的注册代码便可。

```
...
impl Default for Factory {
    fn default() -> Self {
        let mut factory = Factory {
            contracts: HashMap::new(),
        };

        // here we register contracts with addresses defined in genesis.json.
        {
            use native::myContract::HelloWorld;
            factory.register(Address::from(0x500), Box::new(HelloWorld::default()));
        }
        ...
        factory
    }
}
```

同时还需要在同目录下的代码mod.rs中加入my_contract的模块，使得rust在编译时，可以正确编译my_contract.rs.

```
...
pub mod factory;
pub mod myContract;
#[cfg(test)]
mod tests;
...
```

## 编译合约

将合约代码放到$CITA_SRC_PATH/cita-executor/core/src/native下，启动编译CITA的命令。

```
./env.sh make release
```

编译整个工程会比较慢，如果你已经编译过整个工程，可以选择仅编译cita-executor，这样会快很多。在docker中，执行：

```
cd $CITA_SRC_PATH/cita-executor
cargo build

# 将编译结果cita-executor拷贝到安装目录下
cp $CITA_SRC_PATH/target/debug/cita-executor $CITA_SRC_PATH/target/install/bin/
```



## 调用合约

同样通过发交易来调用合约中的`update`函数，通过[JSON-RPC](https://docs.nervos.org/cita/#/zh-CN/latest/rpc_guide/rpc)的`eth_call`方法来验证`balance`
的值。

### i.  查询balance

**执行：**

```
`curl -X POST —data '{"jsonrpc":"2.0","method":"call", "params":[{"to":"0x0000000000000000000000000000000000000500", "data":"0x832b4580"}, "latest"],"id":2}' 127.0.0.1:1337`
```

关键信息简释：
“to” → 这是合约地址，与前文“编写合约部署”中注册的地址相一致。
“data” → 调用的方法签名，与前文“定义合约”中的描述相一致。

**返回：**

```
{"jsonrpc":"2.0","id":2,"result":"0x0000000000000000000000000000000000000000000000000000000000000000"}
```

### II. 构造交易

```
python3 make_tx.py —to "0x0000000000000000000000000000000000000500" —code "aa91543e0000000000000000000000000000000000000000000000000000000000000011"
```

关键信息简释：
code → 前4个bytes为函数签名，后32bytes为update参数。相当于执行`HelloWorld.update(11)`。

### III. 发送交易

```
python3 send_tx.py
```

返回：

```
{
"hash": "0xf2d2889028a322582efc933f9adc5930b3f40d56ab07e1d0d912b6123a0968da",
"status": "OK"
}
```

### IV. 获取回执

```
python3 get_receipt.py
```

返回：

```
{
"transactionHash": "0x32d93ffe920a7f683607f2cfe621b78ff1d74a82df3825c7184ad9d64701ee4f",
"transactionIndex": "0x0",
"blockHash": "0x5c522dbd5fb1d7a682dbaec3b0f16c297e32abe69e17f5fafacc709f1d97d487",
"blockNumber": "0xb1",
"cumulativeGasUsed": "0xf41dc",
"gasUsed": "0xf41dc",
"contractAddress": null,
"logs": [],
"root": null,
"logsBloom": "0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
"errorMessage": null
}
```

### V. 再查询BALANCE

```
curl -X POST —data '{"jsonrpc":"2.0","method":"call", "params":[{"to":"0x0000000000000000000000000000000000000500", "data":"0x832b4580"}, "latest"],"id":2}' 127.0.0.1:1337
```

返回：

```
{"jsonrpc":"2.0","id":2,"result":"0x0000000000000000000000000000000000000000000000000000000000000011"}
```

如果你有兴趣再重复执行II~V，你会发现结果为11 → 22 → 33 → ...，符合我们编写的智能合约预期。


## **附件：**

能够读到这里，说明你非常有耐心与诚意，是真的想学习并尝试一下Rust原生智能合约。为了表示我的诚意，特附一个已经写好的合约示例代码，你只需将它们放到$CITA_SRC_PATH/cita-executor/core/src/native下，就能尝试上面的所有执行步骤。Enjoy yourself!

[my_contract.rs](my_contract.rs)
