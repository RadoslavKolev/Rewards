// SPDX-License-Identifier: MIT
pragma solidity ^0.4.2;

import "./Rewards.sol";

contract RewardsTokenSale {
    address admin;
    Rewards public tokenContract;
    uint256 public tokenPrice;
    uint256 public tokensSold;

    event Sell(
        address _buyer,
         uint256 _amount
    );

    constructor(Rewards _tokenContract, uint256 _tokenPrice) public {
        admin = msg.sender;
        tokenContract = _tokenContract;
        tokenPrice = _tokenPrice;
    }

    function multiply(uint x, uint y) internal pure returns (uint z) {
        require(y == 0 || (z = x * y) / y == x);
    }

    function buyTokens(uint256 _numberOfTokens) public payable {
        // Require that value is equal to tokens
        require(msg.value == multiply(_numberOfTokens, tokenPrice));
        // Require that the contract has enough tokens
        require(tokenContract.balanceOf(this) >= _numberOfTokens);
        // Require a successful transaction
        require(tokenContract.transfer(msg.sender, _numberOfTokens));

        tokensSold += _numberOfTokens;

        emit Sell(msg.sender, _numberOfTokens);
    }

    function endSale() public {
        require(msg.sender == admin);
        require(tokenContract.transfer(admin, tokenContract.balanceOf(this)));
        
        //selfdestruct(admin);

        admin.transfer(address(this).balance);
    }
}