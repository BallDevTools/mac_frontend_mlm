var express = require('express');
var router = express();

const util = require("ethereumjs-util");
const { ethers } = require("ethers");


const customRpcUrl = "https://polygon-rpc.com/";
const provider = new ethers.providers.JsonRpcProvider(customRpcUrl);

const signer = new ethers.Wallet(
  "0x91c73518368d2554718d9853d2d51c2ae4750a61fc14bb09ea5ef51fb519d449",
  provider
);


const contractAddress = "0x061BA659cD50704b7A8177815FDC789c9c137906";
const contractABI = [
  {
    inputs: [
      {
        internalType: "address",
        name: "referrerAddress",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "desiredLevel",
        type: "uint256",
      },
    ],
    name: "joinLevel",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "checkBalance",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "levels",
    outputs: [
      {
        internalType: "uint256",
        name: "price",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "maxMembers",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "members",
    outputs: [
      {
        internalType: "address",
        name: "referrer",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "level",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "totalPaid",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];
const contract = new ethers.Contract(contractAddress, contractABI, signer);

router.get('/test', function(req, res) {
    
    res.render('test_wallet', {contractABI: JSON.stringify(contractABI), contractAddress: contractAddress})
})

router.post('/buyLevel',async function(req, res) {
	const currentGasPrice = await provider.getGasPrice();
	const gasPrice = util.bufferToHex(currentGasPrice.mul(2).toHexString());
	const gasLimit = util.bufferToHex(258000);
	const param1 = req.body.address;
	const param2 = req.body.level;
	try {
	  const result = await contract.buyLevel(param1, param2, {
		  gasPrice: gasPrice,
		  gasLimit: gasLimit
		});
  
	  console.log("Function result:", result);
	} catch (error) {
	  console.error("Error calling contract function:", error);
	}
})

router.post('/joinLevel',async function(req, res) {
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

module.exports = router;