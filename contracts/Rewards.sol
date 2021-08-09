// SPDX-License-Identifier: MIT
pragma solidity ^0.4.2;

contract Rewards {
    uint256 public totalSupply;
    string public tokenName = "Rewards";
    string public tokenSymbol = "RWD";

    event Transfer(
        address indexed _from,
        address indexed _to,
        uint256 _amount
    );

    mapping(address => uint256) public balanceOf;

    function Rewards(uint256 _initialSupply) public {
        // Sets the admin who owns all the tokens
        balanceOf[msg.sender] = _initialSupply;

        // Sets the total supply of tokens
        totalSupply = _initialSupply;
    }

    function transfer(address _to, uint256 _amount) public returns (bool success) {
        // Exception if account doesn't have enough
        require(_amount <= balanceOf[msg.sender]);
        require(_to != address(0));

        balanceOf[msg.sender] -= _amount;
        balanceOf[_to] += _amount;
        
        Transfer(msg.sender, _to, _amount);
        
        return true;
    }
}