var Lottery = artifacts.require("Lottery");
// the winning guess, to be put the owner
var winningGuess = 50000;

module.exports = function(deployer) {
  deployer.deploy(Lottery, winningGuess);
}
