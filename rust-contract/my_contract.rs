use super::*;
use byteorder::BigEndian;
use byteorder::ByteOrder;
use evm::ReturnData;
use native::storage::*;
use cita_types::{H256, U256};
#[derive(Clone)]

// 这里的balance可以直接取值吗？
pub struct HelloWorld {
    balance: Scalar,
    output: Vec<u8>,
}

impl Contract for HelloWorld {
    fn exec(&mut self, params: ActionParams, ext: &mut Ext) -> Result<GasLeft, evm::Error> {
        let signature = BigEndian::read_u32(params.clone().data.unwrap().get(0..4).unwrap());

        match signature {
            0 => self.init(params, ext),

            // 注册变量get/set方法到合约里。
            // 在原生合约里，需要自己实现变量的get方法，而在solidity里由系统提供
            0x832b4580 => self.balance_get(params, ext),

            // 注册upate方法到合约里。
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
        info!("====set balance to {:?}", _balance);
         
        _balance.to_big_endian(self.output.as_mut_slice());

        Ok(GasLeft::NeedsReturn {
            gas_left: U256::from(100),
            data: ReturnData::new(self.output.clone(), 0, self.output.len()),
            apply_state: true,
        })
    }
}
