// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract MML {
    struct Member {
        address memberAddress;
        uint256 level;
        uint256 downlines;
        uint256 totalPaid;
        address[] referrals;
    }

    struct Level {
        uint256 price;
        uint256 maxMembers;
    }

    mapping(address => Member) public members;
    mapping(uint256 => Level) public levels;
    address[] public level1Members;
    uint256 public totalMembers;
    address public owner;

    constructor() {
        owner = msg.sender;
        levels[1].price = 1;
        levels[1].maxMembers = 2;

        levels[2].price = 2;
        levels[2].maxMembers = 3;

        levels[3].price = 2;
        levels[3].maxMembers = 4;

        levels[4].price = 2;
        levels[4].maxMembers = 5;

        levels[5].price = 2;
        levels[5].maxMembers = 6;

        levels[6].price = 2;
        levels[6].maxMembers = 7;

        levels[7].price = 2;
        levels[7].maxMembers = 8;

        levels[8].price = 2;
        levels[8].maxMembers = 9;

        levels[9].price = 2;
        levels[9].maxMembers = 10;

        levels[10].price = 2;
        levels[10].maxMembers = 11;
    }

    function _addMember(
        address memberAddress,
        uint256 level,
        address referrerAddress
    ) private {
        require(level <= 10, "Level exceeds limit");
        require(levels[level].maxMembers > level1Members.length, "Level full");

        members[memberAddress].referrals.push(referrerAddress);
        totalMembers++;

        if (level == 1) {
            level1Members.push(memberAddress);
        }

        if (level > 1) {
            members[referrerAddress].downlines++;
        }

        members[memberAddress].referrals.push(referrerAddress);

        uint256 amount = levels[level].price;
        uint256 referrerReward = (amount * 80) / 100;
        uint256 systemReward = (amount * 20) / 100;

        payable(referrerAddress).transfer(referrerReward);
        payable(owner).transfer(systemReward);
        members[memberAddress].totalPaid += amount;
        if (level < 10 && members[memberAddress].downlines >= level) {
            _addMember(memberAddress, level + 1, referrerAddress);
        }
    }

    function _getReferrerLevel(address memberAddress) private view returns (uint256) {
        if (members[memberAddress].referrals.length == 0) {
            return 0;
        }
        return members[members[memberAddress].referrals[0]].level;
    }


    function joinLevel(address referrerAddress, uint256 desiredLevel) public payable {
        require( referrerAddress != address(0),"Referrer address cannot be empty");
        require( desiredLevel > 0 && desiredLevel <= 10,"Invalid desired level");
        require(msg.sender != referrerAddress, "Cannot refer yourself");
        // require(members[referrerAddress].level > 0, "Referrer not found");
        _addMember(msg.sender, desiredLevel, referrerAddress);
    }


    function getMemberInfo(address memberAddress)public view returns (Member memory) {
        return members[memberAddress];
    }

    function buyLevel(uint256 desiredLevel) public payable {
        require(desiredLevel > 1 && desiredLevel <= 10, "Invalid desired level");
        require(levels[desiredLevel].price <= members[msg.sender].totalPaid,"Insufficient balance");
        members[msg.sender].level = desiredLevel;
    }

    function getTotalMembers() public view returns (uint256) {
        return totalMembers;
    }

    function checkBalance() public view returns (uint256) {
        return members[msg.sender].totalPaid;
    }

    function withdraw() public {
        uint256 amount = members[msg.sender].totalPaid;
        members[msg.sender].totalPaid = 0;
        payable(msg.sender).transfer(amount);
    }

    function addLevel(uint256 price, uint256 maxMembers) public onlyOwner {
        levels[10 + 1] = Level(price, maxMembers); // Corrected indexing for new levels
    }

    function updateLevelPrice(uint256 level, uint256 price) public onlyOwner {
        levels[level].price = price;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Unauthorized access");
        _;
    }
}

contract Agency {
    struct Member {
        address referrer;
        uint256 level;
        uint256 totalPaid;
    }

    struct Level {
        uint256 price;
        uint256 maxMembers;
    }

    mapping(address => Member) public members;
    mapping(uint256 => Level) public levels;

    address public owner;

    constructor() {
        owner = msg.sender;

        levels[1] = Level(100 ether, 2);
        levels[2] = Level(200 ether, 3);
    }

    function joinLevel(address referrerAddress, uint256 desiredLevel)
        public
        payable
    {
        require(referrerAddress != address(0), "Invalid referrer address");
        require(
            desiredLevel > 0 && desiredLevel <= 10,
            "Invalid desired level"
        );
    }

    function checkBalance() public view returns (uint256) {
        return members[msg.sender].totalPaid;
    }
}
