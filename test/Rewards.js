var Rewards = artifacts.require('./Rewards.sol');

contract('Rewards', function(accounts) {
    it('Sets the total supply upon deployment', function() {
        return Rewards.deployed().then(function(instance) {
            tokenInstance = instance;
            return tokenInstance.totalSupply();
        }).then(function(totalSupply) {
            assert.equal(totalSupply.toNumber(), 500000000, 'Sets the total supply to 500000000'); 
        });
    });
})