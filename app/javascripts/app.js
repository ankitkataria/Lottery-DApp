// Import the page's CSS. Webpack will know what to do with it.
import "../stylesheets/app.css";

// Import libraries we need.
import { default as Web3} from 'web3';
import { default as contract } from 'truffle-contract'

// Import our contract artifacts and turn them into usable abstractions.
import lottery_artifacts from '../../build/contracts/Lottery.json'

// Lottery is our usable abstraction, which we'll use through the code below.
var Lottery = contract(lottery_artifacts);
var owner;
var token;

window.buyTokens = function() {
  var token_amount = $('#token-amount').val();

  Lottery.deployed().then(function(contractInstance) {
    contractInstance.addTokens({from: account, value: web3.toWei(token_amount, 'ether')});
  });

  populateAccount();

  return false;
}


var populateAccount = function () {
  Lottery.deployed().then(function(contractInstance) {
    contractInstance.userTokens.call(account).then(function(r) {
      $('#user-tokens').html(r.toNumber());
    });

    web3.eth.getBalance(account, function(err, res) {
      $('#user-balance').html(web3.fromWei(res.toNumber(), 'ether') + ' ether');
    });

    web3.eth.getBalance(contractInstance.address, function(err, res) {
      $('#contract-balance').html(web3.fromWei(res.toNumber(), 'ether') + ' ether');
    })

  });
}

$( document ).ready(function() {
  // sometimes the webbrowser loads its own web3
  // set the web3 provider if not present
  if (typeof web3 !== 'undefined') {
    console.warn("Using web3 detected from external source like Metamask")
    window.web3 = new Web3(web3.currentProvider);
  } else {
    console.warn("No web3 detected. Falling back to http://localhost:8545. You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask");
    window.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545"));
  }

  Lottery.setProvider(web3.currentProvider);

  window.accounts = web3.eth.accounts;
  window.account = web3.eth.accounts[1];

  Lottery.deployed().then(function(contractInstance) {

    contractInstance.owner.call().then(function(result) {
      owner = result;
      $('#contract-owner').html(owner)
    });

    contractInstance.makeUser({gas: 140000, from: account});

    $('#user-account').html(account);
  });

  populateAccount();
});
