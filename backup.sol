// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract MLMSystem {
    struct Level {
        uint256 price;
        uint256 maxDownlines;
    }

    mapping(uint256 => Level) public levels;
    uint256 public numLevels;
    uint256 public constant MAX_LEVELS = 10;

    mapping(uint256 => mapping(address => uint256)) public referrals;
    mapping(address => mapping(uint256 => uint256[])) public joinedLevels;
    mapping(address => mapping(uint256 => uint256)) public balances;

    address public owner;

    constructor() {
        owner = msg.sender;
        levels[0] = Level(10 ether, 2);
        levels[1] = Level(25 ether, 3);
        levels[2] = Level(50 ether, 4);
        levels[3] = Level(100 ether, 5);
        levels[4] = Level(200 ether, 6);
        levels[5] = Level(400 ether, 7);
        levels[6] = Level(800 ether, 8);
        levels[7] = Level(1600 ether, 9);
        levels[8] = Level(3200 ether, 10);
        levels[9] = Level(6400 ether, 11);
        numLevels = 10;
    }

    function addLevel(uint256 _price, uint256 _maxDownlines) external onlyOwner {
        require(numLevels < MAX_LEVELS, "Maximum number of levels reached");
        levels[numLevels] = Level(_price, _maxDownlines);
        numLevels++;
    }

    function updateLevel(uint256 _levelId, uint256 _price, uint256 _maxDownlines) external onlyOwner {
        require(_levelId < numLevels, "Invalid level ID");
        levels[_levelId] = Level(_price, _maxDownlines);
    }

    function buyLevel(uint256 _levelId) external payable {
        require(_levelId < numLevels, "Invalid level ID");
        Level memory level = levels[_levelId];
        require(msg.value == level.price, "Incorrect amount sent");
        address referrer = addressFromUint(referrals[_levelId][msg.sender]);
        if (referrer != address(0)) {
            payable(referrer).transfer(level.price * 8 / 10);
            payable(owner).transfer(level.price * 2 / 10);
        } else {
            payable(owner).transfer(msg.value);
        }
        balances[msg.sender][_levelId] += msg.value * 8 / 10;
        joinedLevels[msg.sender][_levelId].push(block.timestamp);
    }

    function joinLevel(uint256 _levelId, uint256 _referrerId) external {
        require(_levelId < numLevels, "Invalid level ID");
        address referrer = addressFromUint(_referrerId);
        require(joinedLevels[referrer][_levelId].length > 0, "Referrer has not joined this level");

        referrals[_levelId][msg.sender] = _referrerId;
    }

    function getUserReferrals(uint256 _levelId, address _user) external view returns (uint256) {
        return referrals[_levelId][_user];
    }

    function getUserJoinedLevels(address _user, uint256 _levelId) external view returns (uint256[] memory) {
        return joinedLevels[_user][_levelId];
    }

    function checkBalance(address _user, uint256 _levelId) external view returns (uint256) {
        return balances[_user][_levelId];
    }

    function withdraw(uint256 _levelId, uint256 _amount) external {
        require(balances[msg.sender][_levelId] >= _amount, "Insufficient balance");
        balances[msg.sender][_levelId] -= _amount;
        payable(msg.sender).transfer(_amount);
    }


    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    function addressFromUint(uint256 _value) private pure returns (address) {
        return address(uint160(_value));
    }
}
