var Rewards = artifacts.require('./Rewards.sol');

contract('Rewards', function(accounts) {
    var tokenInstance;

    it('Initializes the contract with the correct values', function() {
        return Rewards.deployed().then(function(instance) {
            tokenInstance = instance;
            return tokenInstance.tokenName();
        }).then(function(name) {
            assert.equal(name, 'Rewards', 'It has the correct name');
            return tokenInstance.tokenSymbol();
        }).then(function(tokenSymbol) {
            assert.equal(tokenSymbol, 'RWD', 'It has the correct symbol');
        });
    });

    it('Allocates the initial supply upon deployment', function() {
        return Rewards.deployed().then(function(instance) {
            tokenInstance = instance;
            return tokenInstance.totalSupply();
        }).then(function(totalSupply) {
            assert.equal(totalSupply.toNumber(), 500000000, 'Sets the total supply to 500000000'); 
            return tokenInstance.balanceOf(accounts[0]);
        }).then(function(adminBalance) {
            assert.equal(adminBalance.toNumber(), 500000000, 'It allocates the initial supply to the admin account');
        });
    });

    it('Transfers ownership', function() {
        return Rewards.deployed().then(function(instance) {
            tokenInstance = instance;
            return tokenInstance.transfer.call(accounts[1], 99999999999999);
        }).then(assert.fail).catch(function(error) {
            assert(error.message.indexOf('revert') >= 0, 'Error message must contain revert');
            return tokenInstance.transfer.call(accounts[1], 100000000, { from: accounts[0] });
        }).then(function(success) {
            assert.equal(success, true, 'It returns true');
            return tokenInstance.transfer(accounts[1], 100000000, { from: accounts[0] });
        }).then(function(receipt) {
            assert.equal(receipt.logs.length, 1, 'Triggers 1 event');
            assert.equal(receipt.logs[0].event, 'Transfer', 'It should be the "Transfer" event');
            assert.equal(receipt.logs[0].args._from, accounts[0], 'Logs the account the tokens are transfered from');
            assert.equal(receipt.logs[0].args._to, accounts[1], 'Logs the account the tokens are transfered to');
            assert.equal(receipt.logs[0].args._amount, 100000000, 'Logs the transfer amount');
            return tokenInstance.balanceOf(accounts[1]);
        }).then(function(balance) {
            assert.equal(balance.toNumber(), 100000000, 'Adds the amount to the receiving account');
            return tokenInstance.balanceOf(accounts[0]);
        }).then(function(balance) {
            assert.equal(balance.toNumber(), 400000000, 'Deducts the amount from the sending account');
        });
    });
});