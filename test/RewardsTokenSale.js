var RewardsTokenSale = artifacts.require('./RewardsTokenSale.sol');

contract('RewardsTokenSale', function(accounts) {
    var tokenSaleInstance;
    var tokenPrice = 1000000000000000;  // in wei

    it('Initializes contract with the correct values', function() {
        return RewardsTokenSale.deployed().then(function(instance) {
            tokenSaleInstance = instance;
            return tokenSaleInstance.address
        }).then(function(address) {
            assert.notEqual(address, 0x0, 'Has contract address');
            return tokenSaleInstance.tokenContract();
        }).then(function(address) {
            assert.notEqual(address, 0x0, 'Has token contract address');
            return tokenSaleInstance.tokenPrice();
        }).then(function(price) {
            assert.equal(price, tokenPrice, 'Token price is correct');
        });
    });
});
