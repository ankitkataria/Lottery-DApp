pragma solidity ^0.4.17;
//the pragma line is the preprocessor directive, tells the version of solidity

contract Lottery {
	//struct is used to store the user information
	struct User {
		address UserAddress;
		uint tokensBought;
    uint[] guess;
	}

	// a list of the users
	mapping (address => User) public users;

  address[] public userAddresses;

	address public owner;
	uint public winningGuessSha3;

	//contructor function
	function Lottery(uint _winningGuess) {
		// by default the owner of the contract is accounts[0] to set the owner change truffle.js
		owner = msg.sender;
		winningGuessSha3 = keccak256(_winningGuess);
	}

  // to add a new user to the contract to make guesses
  function makeUser() {
    users[msg.sender] = msg.sender;
    users.tokensBought = 0;
    userAddresses.push(msg.sender);
  }

	// function to add tokens to the user that calls the contract
	function addTokens payable {
    uint present = 0;

    for(int i = 0; i < users.length, i++) {
      if(userAddresses[i] == msg.sender) {
        present = 1;
        break;
      }
    }

    // adding tokens if the user present in the userAddresses array
    if (present == 1) {
      users[msg.sender].tokensBought += msg.value;
    }
	}

	// function to generate the random number that wins
	function makeGuess(uint _userGuess) {
    require(_userGuess < 1000000);
    users[msg.sender].guess.push(_userGuess);
    users[msg.sender].tokensBought--;
	}

	// doesn't allow anyone to buy anymore tokens
	function closeGame() {
    // can only be called my the owner of the contract
		require(owner == msg.sender);
    User winner = winnerAddress();
    getPrice(winner);
	}

	// returns the address of the winner once the game is closed
	function winnerAddress() returns(user){
    for(int i = 0; i < userAddresses.length, i++) {
      User user= users[userAddresses[i]];

      for(int j = 0; j < user.guess.length; j++) {
        if (keccak256(user.guess[j]) == winningGuessSha3) {
          return user;
        }
      }
    }
    // the owner wins if there are no winning guesses
    return owner;
	}

	// sends 50% of the ETH in contract to the winner and rest of it to the owner
	function getPrice(winner) {

	}

}
