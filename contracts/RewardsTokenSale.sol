// SPDX-License-Identifier: MIT
pragma solidity ^0.4.2;

import "./Rewards.sol";

contract RewardsTokenSale {
    address admin;
    Rewards public tokenContract;
    uint256 public tokenPrice;
    uint256 public tokensSold;

    constructor(Rewards _tokenContract, uint256 _tokenPrice) public {
        admin = msg.sender;
        tokenContract = _tokenContract;
        tokenPrice = _tokenPrice;
    }

    function multiply(uint x, uint y) internal pure returns (uint z) {
        require(y == 0 || (z = x * y) / y == x);
    }

    function buyTokens(uint256 _numberOfTokens) public payable {
        require(msg.value == multiply(_numberOfTokens, tokenPrice));
        require(tokenContract.balanceOf(msg.sender) >= _numberOfTokens);
        require(tokenContract.transfer(msg.sender, _numberOfTokens));

        tokensSold += _numberOfTokens;

        emit Sell(msg.sender, _numberOfTokens);
    }

    function endSale() public {
        require(msg.sender == admin);
        require(tokenContract.transfer(admin, tokenContract.balanceOf(msg.sender)));
        
        admin.transfer(address(this).balance);
    }
}