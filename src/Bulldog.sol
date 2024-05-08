// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Bulldog {
    string public name = "Dhukuti";
    string public symbol = "PAISA";
    uint256 public totalSupply = 8000;
    address[] public allOwners;
    mapping(address => uint256) public balanceOf;

    event Transfer(address indexed from, address indexed to, uint256 value);

    constructor() {
        balanceOf[msg.sender] = totalSupply;
        allOwners.push(msg.sender);
    }

    function transfer(address to, uint256 value) external returns (bool) {
        require(balanceOf[msg.sender] >= value, "Insufficient fund.");
        balanceOf[msg.sender] -= value;
        balanceOf[to] += value;

        // Update the list of owners
        if (!isOwner(to)) {
            allOwners.push(to);
        }

        emit Transfer(msg.sender, to, value);
        return true;
    }

    function isOwner(address account) public view returns (bool) {
        for (uint256 i = 0; i < allOwners.length; i++) {
            if (allOwners[i] == account) {
                return true;
            }
        }
        return false;
    }

    function getOwners() external view returns (address[] memory) {
        // Create a new dynamic array to store the valid owners
        address[] memory validOwners = new address[](allOwners.length);

        // Iterate through each owner and check if their balance is greater than 0
        uint256 validCount = 0;
        for (uint256 i = 0; i < allOwners.length; i++) {
            if (balanceOf[allOwners[i]] > 0) {
                validOwners[validCount] = allOwners[i];
                validCount++;
            }
        }

        // Create a new dynamic array with correct length
        address[] memory result = new address[](validCount);
        for (uint256 i = 0; i < validCount; i++) {
            result[i] = validOwners[i];
        }

        return result;
    }
}