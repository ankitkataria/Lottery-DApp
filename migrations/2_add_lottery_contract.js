var Lottery = artifact.require("Lottery");
// put the winning guess
var winningGuess = 50000;

module.exports = function(deployer) {
  deployer.deploy(Lottery, winningGuess);
}
