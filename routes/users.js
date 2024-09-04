var express = require("express");
var router = express();
const util = require("ethereumjs-util");
const { ethers } = require("ethers");
// const polygonMainnetRpcUrl = 'https://polygon-mainnet.infura.io/v3/7019c0c0ff9c421d9445919ffa54a92e';
// const provider = new ethers.providers.InfuraProvider(polygonMainnetRpcUrl);

const customRpcUrl = "https://polygon-rpc.com/";
const provider = new ethers.providers.JsonRpcProvider(customRpcUrl);

const signer = new ethers.Wallet(
  "49a47226c592a80b76b1024b5cfc5d939653940edc284bc97253ba1b99deab19",
  provider
);
const contractAddress = "0x052eF105fE192171a844B6a79d5297FAaDe1B57f";
const contractABI = [
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [],
		"name": "MAX_LEVELS",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_price",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_maxDownlines",
				"type": "uint256"
			}
		],
		"name": "addLevel",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "balances",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_levelId",
				"type": "uint256"
			}
		],
		"name": "buyLevel",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_user",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "_levelId",
				"type": "uint256"
			}
		],
		"name": "checkBalance",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "defaultReferrer",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_user",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "_levelId",
				"type": "uint256"
			}
		],
		"name": "getUserJoinedLevels",
		"outputs": [
			{
				"internalType": "uint256[]",
				"name": "",
				"type": "uint256[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_levelId",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "_user",
				"type": "address"
			}
		],
		"name": "getUserReferrals",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_levelId",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_referrerId",
				"type": "uint256"
			}
		],
		"name": "joinLevel",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "joinedLevels",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "levels",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "price",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "maxDownlines",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "numLevels",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "referrals",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_levelId",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_price",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_maxDownlines",
				"type": "uint256"
			}
		],
		"name": "updateLevel",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_levelId",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_amount",
				"type": "uint256"
			}
		],
		"name": "withdraw",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	}
]

// Create a contract instance
const contract = new ethers.Contract(contractAddress, contractABI, signer);
router.post('/test',async function(req, res) {
	const currentGasPrice = await provider.getGasPrice();
	const gasPrice = util.bufferToHex(currentGasPrice.mul(2).toHexString());
	const gasLimit = util.bufferToHex(258000);
	const param1 = req.body.address;
	const param2 = req.body.level;
	try {
	  const result = await contract.joinLevel(param1, param2, {
		  gasPrice: gasPrice,
		  gasLimit: gasLimit
		});
  
	  console.log("Function result:", result);
	} catch (error) {
	  console.error("Error calling contract function:", error);
	}
})
router.get('/test', function(req, res) {
	res.render('test')
})
// Call the function with parameters
async function callExampleFunction() {
  const currentGasPrice = await provider.getGasPrice();
  const gasPrice = util.bufferToHex(currentGasPrice.mul(2).toHexString());
  const gasLimit = util.bufferToHex(258000);
  const param1 = "0";
  const param2 =  "0x8Aa2942afA8FF551769024a66784153DdC8bDB1F";
  try {
    const result = await contract.joinLevel(param1, param2, {
    value: ethers.utils.parseEther("1"),
		gasPrice: gasPrice,
		gasLimit: gasLimit
	  });

    console.log("Function result:", result);
  } catch (error) {
    console.error("Error calling contract function:", error);
  }
}


// callExampleFunction();

// async function main() {
//     const gasPrice = await provider.getGasPrice();
//     const modifiedGasPrice = gasPrice.mul(ethers.BigNumber.from("110")).div(ethers.BigNumber.from("100"));  // Increase by 10%
//     console.log(`Current Gas Price: ${ethers.utils.formatUnits(gasPrice, 'gwei')} gwei`);
//     console.log(`Modified Gas Price: ${ethers.utils.formatUnits(modifiedGasPrice, 'gwei')} gwei`);
//     const txResponse = await contract.yourContractMethod('arg1', 'arg2', {
//         gasPrice: modifiedGasPrice
//     });
//     console.log(`Transaction hash: ${txResponse.hash}`);
//     const receipt = await txResponse.wait();
//     console.log(`Transaction confirmed in block: ${receipt.blockNumber}`);
// }
// main().catch(console.error);

module.exports = router;
