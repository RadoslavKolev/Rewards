App = {
    web3Provider: null,
    contracts: {},
    account: '0x0',

    init: function() {
        console.log("App initialized...")
        return App.initWeb3();
    },

    initWeb3: function() {
        if (typeof web3 !== 'undefined') {
          // If a web3 instance is already provided by Meta Mask.
          App.web3Provider = web3.currentProvider;
          web3 = new Web3(web3.currentProvider);
        } else {
          // Specify default instance if no web3 instance provided
          App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
          web3 = new Web3(App.web3Provider);
        }
        return App.initContracts();
    }, 

    initContracts: function() {
        $.getJSON("RewardsTokenSale.json", function(rewardsTokenSale) {
            App.contracts.RewardsTokenSale = TruffleContract(rewardsTokenSale);
            App.contracts.RewardsTokenSale.setProvider(App.web3Provider);
            App.contracts.RewardsTokenSale.deployed().then(function(rewardsTokenSale) {
                console.log("Rewards Token Sale Address:", rewardsTokenSale.address);
            });
        }).done(function() {
            $.getJSON("Rewards.json", function(rewardsToken) {
                App.contracts.Rewards = TruffleContract(rewardsToken);
                App.contracts.Rewards.setProvider(App.web3Provider);
                App.contracts.Rewards.deployed().then(function(rewardsToken) {
                    console.log("Rewards Token Address:", rewardsToken.address);
                });
                return App.render();
            });
        })
    },

    render: function() {
        // Load account data
        web3.eth.getCoinbase(function(err, account) {
            if(err === null) {
                console.log("account", account);
                App.account = account;
                $('#accountAddress').html("Your Account: " + account);
            }
        })
    }
}

$(function() {
    $(window).load(function() {
        App.init();
    })
});