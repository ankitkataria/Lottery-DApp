// import the page's CSS. Webpack will know what to do with it.
import "../stylesheets/app.css";

// import libraries we need.
import { default as Web3} from 'web3';
import { default as contract } from 'truffle-contract'

// import our contract artifacts and turn them into usable abstractions.
import lottery_artifacts from '../../build/contracts/Lottery.json'

// lottery is our usable abstraction, which we'll use through the code below.
var Lottery = contract(lottery_artifacts);
var owner;
var token;

// to buy more tokens, each token costs 1 ether
window.buyTokens = function() {
  var token_amount = $('#token-amount').val();

  Lottery.deployed().then(function(contractInstance) {
    contractInstance.addTokens({from: account, value: web3.toWei(token_amount, 'ether')});
    populateAccount();
  });

  $('#token-amount').val('');
  return false;
}

// To make a guess, 1 guess = 1 token
window.makeGuess = function() {
  var guess = $('#user-guess').val();

  Lottery.deployed().then(function(contractInstance) {
    contractInstance.makeGuess(guess, {from: account, gas:140000});
    populateAccount();
  });

  $('#user-guess').val('');
  return false;
}

window.closeGame = function() {
  Lottery.deployed().then(function(contractInstance) {
    contractInstance.closeGame.call({from: owner, gas: 140000}).then(function(result) {
      $('#token-amount-btn').attr('disabled', 'disabled');
      $('#user-guess-btn').attr('disabled', 'disabled');
      showEndGame();
    });
  });
  return false;
}

window.transferFunds = function() {
  Lottery.deployed().then(function(contractInstance) {
    contractInstance.getPrice({from: owner, gas: 140000}).then(function(result) {
      populateAccount();
      $('#close-game-btn').attr('disabled', 'disabled');
      $('#transfer-funds-btn').attr('disabled', 'disabled');
    });
  });
}

var showEndGame = function() {
  $('.close-game-btn').toggleClass('display-none');
  $('.winner-info').toggleClass('display-none');

  Lottery.deployed().then(function(contractInstance) {
    contractInstance.winningGuess.call().then(function(result) {
      $('#winning-guess').html(result);
    });
    contractInstance.winnerAddress.call({gas: 140000}).then(function(result) {
      $('#winner-address').html(result);
    });
  });
}

var populateAccount = function () {
  Lottery.deployed().then(function(contractInstance) {
    contractInstance.userTokens.call(account).then(function(r) {
      $('#user-tokens').html(r.toNumber());
    });

    // updating the balance of the contract and the user acount
    web3.eth.getBalance(account, function(err, res) {
      $('#user-balance').html(web3.fromWei(res.toNumber(), 'ether') + ' ether');
    });

    web3.eth.getBalance(contractInstance.address, function(err, res) {
      $('#contract-balance').html(web3.fromWei(res.toNumber(), 'ether') + ' ether');
    });

    // updating the user guesses
    var guesses_string = "";
    contractInstance.userGuesses.call(account).then(function(guesses) {
      for(var i = 0; i < guesses.length; i++) {
        guesses_string += (guesses[i] + ",");
      }

      $('#user-guesses').html(guesses_string.substr(0, guesses_string.length - 1));
    });
  });
}

$( document ).ready(function() {
  // set the web3 provider if not present
  if (typeof web3 !== 'undefined') {
    console.warn("Using web3 detected from external source like Metamask")
    window.web3 = new Web3(web3.currentProvider);
  } else {
    console.warn("No web3 detected. Falling back to http://localhost:8545. You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask");
    window.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545"));
  }

  Lottery.setProvider(web3.currentProvider);

  // total accounts
  window.accounts = web3.eth.accounts;
  // account used for making guesses and buying tokens
  window.account = web3.eth.accounts[1];

  Lottery.deployed().then(function(contractInstance) {

    contractInstance.owner.call().then(function(result) {
      owner = result;
      $('#contract-owner').html(owner)
    });

    contractInstance.users.call(account).then(function(result) {
      if(result[0] == "0x0000000000000000000000000000000000000000")
        contractInstance.makeUser({gas: 140000, from: account});
    });

    $('#user-account').html(account);

    populateAccount();
  });

});
