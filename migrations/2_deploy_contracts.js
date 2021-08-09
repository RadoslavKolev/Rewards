const Rewards = artifacts.require("Rewards");

module.exports = function (deployer) {
  deployer.deploy(Rewards);
};
