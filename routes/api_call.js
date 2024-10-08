var express = require('express');
var router = express();
const ethers = require('ethers');
const projectId = '7019c0c0ff9c421d9445919ffa54a92e';
const contractABI = [
    {
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [],
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
		"inputs": [
			{
				"internalType": "address",
				"name": "referrerAddress",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "desiredLevel",
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
				"name": "maxMembers",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "members",
		"outputs": [
			{
				"internalType": "address",
				"name": "referrer",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "level",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "totalPaid",
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
	}
];
const contractAddress = '0x061BA659cD50704b7A8177815FDC789c9c137906';
const provider = new ethers.providers.JsonRpcProvider(`https://polygon-mainnet.infura.io/v3/${projectId}`);
const contract = new ethers.Contract(contractAddress, contractABI, provider);

router.get('/', function(req, res) {
    res.send('test')
})

router.post('/getOwner', async (req, res) => {
    const provider = new ethers.providers.JsonRpcProvider(`https://polygon-mainnet.infura.io/v3/${projectId}`);
    const contract = new ethers.Contract(contractAddress, contractABI, provider);
    try {
      const data = await contract.owner();
      res.json({ success: true, data: data });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

router.post('/getTotalMember', async (req, res) => {
    const provider = new ethers.providers.JsonRpcProvider(`https://polygon-mainnet.infura.io/v3/${projectId}`);
    const contract = new ethers.Contract(contractAddress, contractABI, provider);
    try {
      const data = await contract.getTotalMembers();
      res.json({ success: true, data: data });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;