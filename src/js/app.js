App = {
    web3Provider: null,
    contracts: {},
    account: '0x0',
    loading: false,
    tokenPrice: 1000000000000000,
    tokensSold: 0,
    tokensAvailable: 250000000,

    init: function() {
        console.log("App initialized...");
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
                App.listenForEvents();
                return App.render();
            });
        });
    },

    listenForEvents: function() {
        App.contracts.RewardsTokenSale.deployed().then(function(instance) {
            instance.Sell({}, {
                fromBlock: 0,
                toBlock: 'latest',
            }).watch(function(error, event) {
                console.log("event triggered", event);
                App.render();
            });
        });
    },

    render: function() {
        if(App.loading) {
            return;
        }
        App.loading = true;

        var loader = $('#loader');
        var content = $('#content');

        loader.show();
        content.hide();

        // Load account data
        web3.eth.getCoinbase(function(err, account) {
            if(err === null) {
                console.log("account", account);
                App.account = account;
                $('#accountAddress').html("Your Account: " + account);
            }
        });
        
        // Load token sale contract
        App.contracts.RewardsTokenSale.deployed().then(function(instance) {
            rewardsTokenSaleInstance = instance;
            return rewardsTokenSaleInstance.tokenPrice();
        }).then(function(tokenPrice) {
            console.log("tokenPrice", tokenPrice.toNumber());
            App.tokenPrice = tokenPrice;
            $('.token-price').html(web3.fromWei(App.tokenPrice, "ether").toNumber()); 
            return rewardsTokenSaleInstance.tokensSold();
        }).then(function (tokensSold) {
            App.tokensSold = tokensSold.toNumber();
            console.log(App.tokensSold)
            $('.tokens-sold').html(App.tokensSold);
            $('.tokens-available').html(App.tokensAvailable);
        
            var progressPercent = (Math.ceil(App.tokensSold) / App.tokensAvailable) * 100;
            console.log(progressPercent);
            $('#progress').css('width', progressPercent + '%');

            // Load token contract
            App.contracts.Rewards.deployed().then(function (instance) {
                rewardsTokenInstance = instance;
                return rewardsTokenInstance.balanceOf(App.account);
            }).then(function (balance) {
                $('.rewards-balance').html(balance.toNumber());          
                App.loading = false;
                loader.hide();
                content.show(); 
            });
        });       
    },

    buyTokens: function() {
        $('#content').hide();
        $('#loader').show();
        var numberOfTokens = $('#numberOfTokens').val();
        App.contracts.RewardsTokenSale.deployed().then(function(instance) {
            return instance.buyTokens(numberOfTokens, {
                from: App.account,
                value: numberOfTokens * App.tokenPrice,
                gas: 500000
            });
        }).then(function(result) {
            console.log("Tokens bought...");
            $('form').trigger('reset');     // reset number of tokens 
            // Wait for Sell event  
            $('#loader').hide();
            $('#content').show();        
        });
    }
}

$(function() {
    $(window).load(function() {
        App.init();
    })
});