var express = require('express');
var router = express();
const ethers = require('ethers');

// ใส่ Infura Project ID ของคุณที่นี่
const projectId = '7019c0c0ff9c421d9445919ffa54a92e';
// ใส่ ABI และ Address ของสัญญาอัจฉริยะที่นี่
const contractABI = [
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "memberAddress",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "level",
				"type": "uint256"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "referrerAddress",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "MemberAdded",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "memberAddress",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "level",
				"type": "uint256"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "referrerAddress",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "round",
				"type": "uint256"
			}
		],
		"name": "MemberJoined",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "level",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "round",
				"type": "uint256"
			}
		],
		"name": "RoundCompleted",
		"type": "event"
	},
	{
		"inputs": [
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
		"name": "addLevel",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
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
				"internalType": "uint256",
				"name": "level",
				"type": "uint256"
			}
		],
		"name": "getLevelInfo",
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
			},
			{
				"internalType": "uint256",
				"name": "currentRound",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "currentMemberCount",
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
				"name": "level",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "roundNumber",
				"type": "uint256"
			}
		],
		"name": "getLevelRoundInfo",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "returnedRoundNum",
				"type": "uint256"
			},
			{
				"internalType": "address[]",
				"name": "returnedMembers",
				"type": "address[]"
			},
			{
				"internalType": "bool",
				"name": "returnedCompleted",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "memberAddress",
				"type": "address"
			}
		],
		"name": "getMemberInfo",
		"outputs": [
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
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			},
			{
				"internalType": "address[]",
				"name": "",
				"type": "address[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "memberAddress",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "level",
				"type": "uint256"
			}
		],
		"name": "getMemberLevelInfo",
		"outputs": [
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
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getTotalMembers",
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
		"name": "level1Members",
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
			},
			{
				"internalType": "uint256",
				"name": "currentRound",
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
				"name": "memberAddress",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "level",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "downlines",
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
	},
	{
		"inputs": [],
		"name": "totalMembers",
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
				"name": "level",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "price",
				"type": "uint256"
			}
		],
		"name": "updateLevelPrice",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	}
];
const contractAddress = '0xC79E15AB9da782ad4093dCA07F967040C2192f85';
const provider = new ethers.providers.JsonRpcProvider(`https://polygon-mainnet.infura.io/v3/${projectId}`);
const contract = new ethers.Contract(contractAddress, contractABI, provider);

// async function callContract() {
//   try {
//     const data = await contract.owner();
//     console.log(data);
//   } catch (error) {
//     console.error(error);
//   }
// }
// callContract();

// router.post('/getOwner', async (req, res) => {
//   const provider = new ethers.providers.JsonRpcProvider(`https://polygon-mainnet.infura.io/v3/${projectId}`);
//   const contract = new ethers.Contract(contractAddress, contractABI, provider);
//   try {
//     const data = await contract.owner();
//     res.json({ success: true, data: data });
//   } catch (error) {
//     res.status(500).json({ success: false, error: error.message });
//   }
// });

router.get("/", function (req, res, next) {
  res.render("index");
});
router.get("/dashboard", function (req, res, next) {
  res.render("dashboard");
});

router.get('/build', function(req, res, next) {
  res.render('test2')
})
router.get('/test1', function(req, res, next) {
  res.render('test_logo')
})


router.post('/getBalance', async (req, res) => {
  const provider = new ethers.providers.JsonRpcProvider(`https://polygon-mainnet.infura.io/v3/${projectId}`);
  const contract = new ethers.Contract(contractAddress, contractABI, provider);
  try {
    const data = await contract.checkBalance();
    res.json({ success: true, data: data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/getMemberInfo', async (req, res) => {
  const provider = new ethers.providers.JsonRpcProvider(`https://polygon-mainnet.infura.io/v3/${projectId}`);
  const contract = new ethers.Contract(contractAddress, contractABI, provider);
  try {
    const data = await contract.getMemberInfo();
    res.json({ success: true, data: data } );
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

router.post('/getLevel', async (req, res) => {
  const provider = new ethers.providers.JsonRpcProvider(`https://polygon-mainnet.infura.io/v3/${projectId}`);
  const contract = new ethers.Contract(contractAddress, contractABI, provider);
  try {
    const data = await contract.levels(req.body.level);
    res.json({ success: true, data: data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/getMember', async (req, res) => {
  const provider = new ethers.providers.JsonRpcProvider(`https://polygon-mainnet.infura.io/v3/${projectId}`);
  const contract = new ethers.Contract(contractAddress, contractABI, provider);
  try {
    const data = await contract.members();
    res.json({ success: true, data: data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

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

router.post('/TotalMember', async (req, res) => {
  const provider = new ethers.providers.JsonRpcProvider(`https://polygon-mainnet.infura.io/v3/${projectId}`);
  const contract = new ethers.Contract(contractAddress, contractABI, provider);
  try {
    const data = await contract.totalMembers();
    res.json({ success: true, data: data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});
router.post('/addLevel', async (req, res) => {
  const provider = new ethers.providers.JsonRpcProvider(`https://polygon-mainnet.infura.io/v3/${projectId}`);
  const contract = new ethers.Contract(contractAddress, contractABI, provider);
  try {
    const data = await contract.addLevel();
    res.json({ success: true, data: data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});
router.post('/updateLevel', async (req, res) => {
  const provider = new ethers.providers.JsonRpcProvider(`https://polygon-mainnet.infura.io/v3/${projectId}`);
  const contract = new ethers.Contract(contractAddress, contractABI, provider);
  try {
    const data = await contract.updateLevelPrice();
    res.json({ success: true, data: data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});
router.post('/withdraw', async (req, res) => {
  const provider = new ethers.providers.JsonRpcProvider(`https://polygon-mainnet.infura.io/v3/${projectId}`);
  const contract = new ethers.Contract(contractAddress, contractABI, provider);
  try {
    const data = await contract.withdraw();
    res.json({ success: true, data: data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});
router.post('/members', async (req, res) => {
  const provider = new ethers.providers.JsonRpcProvider(`https://polygon-mainnet.infura.io/v3/${projectId}`);
  const contract = new ethers.Contract(contractAddress, contractABI, provider);
  try {
    const data = await contract.members(req.body.address);
    res.json({ success: true, data: data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});
router.post('/buyLevel', async (req, res) => {
  const provider = new ethers.providers.JsonRpcProvider(`https://polygon-mainnet.infura.io/v3/${projectId}`);
  const contract = new ethers.Contract(contractAddress, contractABI, provider);
  try {
    const data = await contract.members(req.body.address);
    res.json({ success: true, data: data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});
router.post('/JoinLevel', async (req, res) => {
  const { referrer, level } = req.body;
  console.log(req.body);
  const provider = new ethers.providers.JsonRpcProvider(`https://polygon-mainnet.infura.io/v3/${projectId}`);
  const contract = new ethers.Contract(contractAddress, contractABI, provider);
  try {
    const data = await contract.joinLevel(referrer,level,{gasLimit:138000000000,gasPrice:115000000000});
    // const data = await contract.joinLevel({referrerAddress: req.body.referrer,desiredLevel: req.body.level});
    res.json({ success: true, data: data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/test2', function(req, res, next) {
  res.render('test2', { title: 'Express' });
});

module.exports = router;
