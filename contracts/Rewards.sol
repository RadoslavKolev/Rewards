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

    event Approval(
        address indexed _owner,
        address indexed _spender,
        uint256 _amount
    );

    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;

    constructor(uint256 _initialSupply) public {
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
        
        emit Transfer(msg.sender, _to, _amount);
        
        return true;
    }

    function transferFrom(address _from, address _to, uint256 _amount) public returns (bool success) {
        require(_amount <= balanceOf[_from]);
        require(_amount <= allowance[_from][msg.sender]);
        require(_to != address(0));

        balanceOf[_from] -= _amount;
        balanceOf[_to] += _amount;
        allowance[_from][msg.sender] -= _amount;
        
        emit Transfer(_from, _to, _amount);

        return true;
    }

    function approve(address _spender, uint256 _amount) public returns (bool success) {
        require(_spender != address(0));

        allowance[msg.sender][_spender] = _amount;
        
        emit Approval(msg.sender, _spender, _amount);

        return true;
    }
}