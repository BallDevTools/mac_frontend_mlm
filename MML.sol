// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract MML {
    struct MemberLevel {
        uint256 joinedRound;
        uint256 joinedTimestamp;
    }

    struct Member {
        address memberAddress;
        uint256 level;
        uint256 downlines;
        uint256 totalPaid;
        address[] referrals;
        mapping(uint256 => MemberLevel) levels; // เก็บข้อมูลแต่ละระดับของสมาชิก
    }

    struct Round {
        uint256 roundNumber;
        address[] members;
        bool completed;
    }

    struct Level {
        uint256 price;
        uint256 maxMembers;
        uint256 currentRound;
        mapping(uint256 => Round) rounds;
    }

    mapping(address => Member) public members;
    address public defaultReferrer;
    mapping(uint256 => Level) public levels;
    address[] public level1Members;
    uint256 public totalMembers;
    address public owner;

    event MemberJoined(address indexed memberAddress, uint256 level, address indexed referrerAddress, uint256 round);
    event MemberAdded(address indexed memberAddress, uint256 level, address indexed referrerAddress, uint256 amount);
    event RoundCompleted(uint256 level, uint256 round);

    constructor() {
        owner = msg.sender;
        // level, price, maxMember,
        _initializeLevel(1, 1 ether, 4);
        _initializeLevel(2, 2 ether, 5);
        _initializeLevel(3, 3 ether, 6);
        _initializeLevel(4, 4 ether, 7);
        _initializeLevel(5, 5 ether, 8);
        _initializeLevel(6, 6 ether, 9);
        _initializeLevel(7, 7 ether, 10);
        _initializeLevel(8, 8 ether, 11);
        _initializeLevel(9, 9 ether, 12);
        _initializeLevel(10, 10 ether, 13);
        _initializeLevel(11, 11 ether, 14);
        _initializeLevel(12, 12 ether, 15);
        _initializeLevel(13, 13 ether, 16);
        _initializeLevel(14, 14 ether, 17);
        _initializeLevel(15, 15 ether, 18);
    }

    function _initializeLevel(uint256 levelNumber, uint256 price, uint256 maxMembers) private {
        Level storage level = levels[levelNumber];
        level.price = price;
        level.maxMembers = maxMembers;
        level.currentRound = 1;
        level.rounds[1].roundNumber = 1;
        level.rounds[1].completed = false;
    }

    function _addMember(address memberAddress, uint256 level, address referrerAddress) private {
        require(level <= 15, "Level exceeds limit");

        Level storage currentLevel = levels[level];
        Round storage currentRound = currentLevel.rounds[currentLevel.currentRound];
        require(currentRound.members.length < currentLevel.maxMembers, "Level round full");

        Member storage member = members[memberAddress];
        member.memberAddress = memberAddress;
        member.level = level;
        member.referrals.push(referrerAddress);
        member.levels[level] = MemberLevel(currentLevel.currentRound, block.timestamp);
        currentRound.members.push(memberAddress);
        totalMembers++;

        if (level == 1) {
            level1Members.push(memberAddress);
        }
        if (level > 1) {
            members[referrerAddress].downlines++;
        }

        uint256 amount = currentLevel.price;
        uint256 referrerReward;
        uint256 systemReward;

        if (currentRound.members.length == currentLevel.maxMembers) {
            // Last member of the round
            systemReward = amount;
            referrerReward = 0;
            currentRound.completed = true;
            currentLevel.currentRound++;
            currentLevel.rounds[currentLevel.currentRound].roundNumber = currentLevel.currentRound;
            emit RoundCompleted(level, currentLevel.currentRound - 1);
        } else {
            referrerReward = (amount * 60) / 100;
            systemReward = amount - referrerReward;
        }

        if (referrerReward > 0) {
            payable(referrerAddress).transfer(referrerReward);
        }
        payable(owner).transfer(systemReward);

        member.totalPaid += amount;

        emit MemberAdded(memberAddress, level, referrerAddress, amount);

        if (level < 15 && member.downlines >= level) {
            _addMember(memberAddress, level + 1, referrerAddress);
        }
    }

    
      function joinLevel(address referrerAddress, uint256 desiredLevel) public payable {
        require(desiredLevel > 0 && desiredLevel <= 15, "Invalid desired level");
        require(msg.sender != referrerAddress, "Cannot refer yourself");
        require(msg.value >= levels[desiredLevel].price, "Insufficient payment");
        
        require(members[msg.sender].level + 1 == desiredLevel, "Must join levels in sequence");

        if (totalMembers == 0) {
            require(referrerAddress == owner, "First member must be referred by owner");
        } else {
            if (referrerAddress != owner) {
                require(members[referrerAddress].memberAddress != address(0), "Referrer not found");
                require(members[referrerAddress].level > 0, "Referrer must have a level");
                require(members[referrerAddress].level >= desiredLevel, "Referrer's level must be equal to or higher than desired level");
            }
        }

        _addMember(msg.sender, desiredLevel, referrerAddress);

        uint256 excess = msg.value - levels[desiredLevel].price;
        if (excess > 0) {
            payable(msg.sender).transfer(excess);
        }

        emit MemberJoined(msg.sender, desiredLevel, referrerAddress, levels[desiredLevel].currentRound);
    }

    function getMemberInfo(address memberAddress) public view returns (address, uint256, uint256, uint256, address[] memory) {
        Member storage member = members[memberAddress];
        return (member.memberAddress, member.level, member.downlines, member.totalPaid, member.referrals);
    }

    function getMemberLevelInfo(address memberAddress, uint256 level) public view returns (uint256, uint256) {
        require(level > 0 && level <= 15, "Invalid level");
        MemberLevel storage memberLevel = members[memberAddress].levels[level];
        return (memberLevel.joinedRound, memberLevel.joinedTimestamp);
    }

    

    function getTotalMembers() public view returns (uint256) {
        return totalMembers;
    }

    function checkBalance() public view returns (uint256) {
        return members[msg.sender].totalPaid;
    }

    function addLevel(uint256 price, uint256 maxMembers) public onlyOwner {
        uint256 newLevelIndex = 16; // Start adding new levels from 16
        while (levels[newLevelIndex].price != 0) {
            newLevelIndex++;
        }
        _initializeLevel(newLevelIndex, price, maxMembers);
    }

    function updateLevelPrice(uint256 level, uint256 price) public onlyOwner {
        require(level > 0 && level <= 15, "Invalid level");
        levels[level].price = price;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Unauthorized access");
        _;
    }

    function getLevelInfo(uint256 level) public view returns (uint256 price, uint256 maxMembers, uint256 currentRound, uint256 currentMemberCount) {
        require(level > 0 && level <= 15, "Invalid level");
        Level storage levelInfo = levels[level];
        Round storage currentRoundInfo = levelInfo.rounds[levelInfo.currentRound];
        return (levelInfo.price, levelInfo.maxMembers, levelInfo.currentRound, currentRoundInfo.members.length);
    }

    function getLevelRoundInfo(uint256 level, uint256 roundNumber) public view returns (uint256 returnedRoundNum, address[] memory returnedMembers, bool returnedCompleted) {
        require(level > 0 && level <= 15, "Invalid level");
        require(roundNumber > 0 && roundNumber <= levels[level].currentRound, "Invalid round number");

        Round storage round = levels[level].rounds[roundNumber];
        return (round.roundNumber, round.members, round.completed);
    }
}
