const Rewards = artifacts.require("Rewards");
const RewardsTokenSale = artifacts.require("RewardsTokenSale");

module.exports = function (deployer) {
  deployer.deploy(Rewards, 500000000).then(function () {
    // Token price is 0.001 ether
    var tokenPrice = 1000000000000000;  // in wei
    return deployer.deploy(RewardsTokenSale, Rewards.address, tokenPrice);
  });
};
