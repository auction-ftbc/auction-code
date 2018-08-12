import { default as Web3} from 'web3';
import { default as contract } from 'truffle-contract'
import AuctionBiddingArtifacts from '../../build/contracts/AuctionBidding.json'
import AuctionTokenArtifacts from '../../build/contracts/XYZToken.json'

var AuctionBiddingTaskMaster = contract(AuctionBiddingArtifacts);
//var AuctionBiddingTaskMaster = "0x0294992174f59effa201fd297a1935ab246401be";
var AuctionTokenTaskMaster = contract(AuctionTokenArtifacts);
//var AuctionTokenTaskMaster = "0x3da00428ac6fecf99c05e303c7462097960af09d";
var ownerAccount = "0x78e45c14db8fc1de08d7589a9999bfa49956f66e";
var contractAddressToken; //"0x971d0118903c87ee9b0dd21a6d2d505a5ac2f234";
var contractAddressBidding; 
var contractAbi;


window.TaskMasterApp = {
  setWeb3Provider: function() {
    AuctionBiddingTaskMaster.setProvider(web3.currentProvider);
    AuctionTokenTaskMaster.setProvider(web3.currentProvider);
    AuctionBiddingTaskMaster.deployed().then(function(instance){contractAddressBidding = instance.address});
    AuctionTokenTaskMaster.deployed().then(function(instance){contractAddressToken = instance.address});
    var self = this;
    web3.eth.getAccounts( function(error, accounts) {
      if (error != null) {
        alert("Sorry, something went wrong. We couldn't fetch your accounts.");
        return;
      }

      if (!accounts.length) {
        alert("Sorry, no errors, but we couldn't get any accounts - Make sure your Ethereum client is configured correctly.");
        return;
      }
      ownerAccount = accounts[0];
    });
    var tokenInwei =  web3.toWei(500, 'ether');
    AuctionTokenTaskMaster.deployed()
    .then(function(taskMasterInstance) {
     
      return taskMasterInstance.approve(contractAddressBidding, tokenInwei, {
        from: ownerAccount
      });
    }).then(function() {
      self.updateTransactionStatus("Authorization complete!");
      self.refreshAccountBalance();

    }).catch(function(e) {
      console.log(e);
      self.updateTransactionStatus("Error Authorizing - see console.");
    });
  },

 /*  setWeb3TokenProvider: function() {
    AuctionTokenTaskMaster.setProvider(web3.currentProvider);
    //AuctionTokenTaskMaster.deployed().then(function(instance){contractAddressToken = instance.address});

  },
 */ 
  updateTransactionStatus: function(statusMessage) {
    document.getElementById("transactionStatus").innerHTML = statusMessage;
  },

  refreshAccountBalance: function() {
    var self = this;

    AuctionTokenTaskMaster.deployed()
      .then(function(taskMasterInstance) {
        var myAddress = document.getElementById("doer").value;
        return taskMasterInstance.balanceOf.call(myAddress, {
          from: ownerAccount
        });
      }).then(function(value) {
alert(value);
        document.getElementById("accountBalance").innerHTML = web3.fromWei(value, 'ether');
        document.getElementById("accountBalance").style.color = "white";
      }).catch(function(e) {
        console.log(e);
        self.updateTransactionStatus("Error getting account balance; see console.");
      });
  },

  allowance: function() {
    var self = this;

    AuctionTokenTaskMaster.deployed()
      .then(function(taskMasterInstance) {
        var myAddress = document.getElementById("doer").value;
        var spender = document.getElementById("spender").value;
        return taskMasterInstance.allowance.call(myAddress,spender, {
          from: ownerAccount
        });
      }).then(function(value) {
       
        document.getElementById("accountBalance").innerHTML = value;  //web3.fromWei(value, 'ether');
        document.getElementById("accountBalance").style.color = "white";
      }).catch(function(e) {
        console.log(e);
        self.updateTransactionStatus("Error getting account balance; see console.");
      });
  },

  saveBidding: function() {
    var self = this;

    AuctionBiddingTaskMaster.deployed()
    .then(function(taskMasterInstance) {
      var bidder = document.getElementById("bidder").value;
      var auctionId = document.getElementById("auctionId").value;
      var bidValue = document.getElementById("bidValue").value;
      bidValue = Math.pow(10,18)*bidValue;

      //var bigNumber = new BigNumber(bidValue);

      //alert("Bignumber -> "+ bigNumber);
    //  var testvalue = web3.fromWei(bidValue, 'ether');
      alert(bidder);
      alert(bidValue);
      //alert(testvalue);
      return taskMasterInstance.saveUserBidForAuction(auctionId, bidValue, {
        from: bidder,
        gas:3000000
      });
    }).then(function(value){
      alert(value);
      self.updateTransactionStatus("Bidding Completed");
    });
  },

  getHighestBidder: function() {
    var self = this;
    AuctionBiddingTaskMaster.deployed()
    .then(function(taskMasterInstance) {
      var address = document.getElementById("doer").value;
      var auctionId = document.getElementById("auctionId").value;
      return taskMasterInstance.getHighestBidderByAuctionId(auctionId, {
        from: address,
        gas:100000
      });
    }).then(function(highestBidder) {
      highestBidder =  web3.fromWei(highestBidder, 'ether');
      alert(highestBidder);

      document.getElementById("accountBalance").innerHTML = highestBidder; 
      document.getElementById("accountBalance").style.color = "white";
      //document.getElementById("highestBidder").value = highestBidder[0];
      self.updateTransactionStatus("Highest Bidder Displayed");
    }).catch(function(e) {
      console.log(e);
      self.updateTransactionStatus("Error getting highest bidder details");
    });
  },

  getAccounts: function () {
    var self = this;
    web3.eth.getAccounts( function(error, accounts) {
      if (error != null) {
        alert("Sorry, something went wrong. We couldn't fetch your accounts.");
        return;
      }

      if (!accounts.length) {
        alert("Sorry, no errors, but we couldn't get any accounts - Make sure your Ethereum client is configured correctly.");
        return;
      }

      ownerAccount = accounts[0];
      self.refreshAccountBalance();
    });
  },

  transfer: function() {
    var self = this;

    var todoCoinReward = +document.getElementById("todoCoinReward").value;
    var doer = document.getElementById("doer").value;
    var toaddress = document.getElementById("toaddress").value;

    this.updateTransactionStatus("Transfer in progress ... ");

    AuctionTokenTaskMaster.deployed()
      .then(function(taskMasterInstance) {
        var myEvent = taskMasterInstance.Transfer({fromBlock: 'latest', toBlock: 'latest'});
        myEvent.watch(function(error, result){if(error) {alert(error); } document.getElementById("accountBalance").innerHTML = result.args._value.toNumber(); document.getElementById("accountBalance").style.color = "white"; });
        
        
        
        return taskMasterInstance.transfer(toaddress, document.getElementById("todoCoinReward").value, {
          from: doer
        });
      }).then(function() {
        self.updateTransactionStatus("Transfer complete!");
        self.refreshAccountBalance();

      }).catch(function(e) {
        console.log(e);
        self.updateTransactionStatus("Error transferring - see console.");
      });
  },

  transferFrom: function() {
    var self = this;

    var todoCoinReward = +document.getElementById("todoCoinReward").value;
    var doer = document.getElementById("doer").value;
    var sender = document.getElementById("sender").value;
    var beneficiary = document.getElementById("beneficiary").value;

    this.updateTransactionStatus("Transfer in progress ... ");

    AuctionTokenTaskMaster.deployed()
      .then(function(taskMasterInstance) {
        var myEvent = taskMasterInstance.Transfer({fromBlock: 'latest', toBlock: 'latest'});
        myEvent.watch(function(error, result){if(error) {alert(error); } alert(result.args._value.toNumber())});
        
        return taskMasterInstance.transferFrom(doer,beneficiary, todoCoinReward, {
          from: sender
        });
      }).then(function() {
        self.updateTransactionStatus("Transfer complete!");
        self.refreshAccountBalance();

      }).catch(function(e) {
        console.log(e);
        self.updateTransactionStatus("Error transferring - see console.");
      });
  },

  authorize: function() {
    var self = this;

    var todoCoinReward = +document.getElementById("todoCoinReward").value;
    var doer = document.getElementById("doer").value;
    var toaddress = document.getElementById("toaddress").value;
    todoCoinReward = Math.pow(10,18)*todoCoinReward;
    alert(todoCoinReward);
    this.updateTransactionStatus("Transfer in progress ... ");

    AuctionTokenTaskMaster.deployed()
      .then(function(taskMasterInstance) {
       
        return taskMasterInstance.approve(toaddress, todoCoinReward, {
          from: doer
        });
      }).then(function() {
        self.updateTransactionStatus("Authorization complete!");
        self.refreshAccountBalance();

      }).catch(function(e) {
        console.log(e);
        self.updateTransactionStatus("Error Authorizing - see console.");
      });
  },
  mintToken: function() {
    var self = this;
    var tokenAmount = document.getElementById("tokenAmount").value;
    var doer = document.getElementById("doer").value;

    AuctionTokenTaskMaster.deployed().then(function(contractInstance){
      return contractInstance.mint(tokenAmount, {
        from: doer
      });
    }).then(function() {
      self.updateTransactionStatus("Minting process completed!");
      self.refreshAccountBalance();
    });
  },
  burnToken: function() {
    var self = this;
    var tokenAmount = document.getElementById("tokenAmount").value;
    var doer = document.getElementById("doer").value;

    AuctionTokenTaskMaster.deployed().then(function(contractInstance){
      return contractInstance.burn(tokenAmount, {
        from: doer
      });
    }).then(function() {
      self.updateTransactionStatus("Burning process completed!");
    });
  },
  buyToken: function() {
    var self = this;

    var todoCoinReward = document.getElementById("todoCoinReward").value;
    var doer = document.getElementById("doer").value;

    this.updateTransactionStatus("Transaction in progress ... ");

    web3.eth.sendTransaction({from: doer, to: contractAddressToken, value: web3.toWei(todoCoinReward, 'ether')  },function(error, result) {
      if (error)
          alert("Smart contract call failed: " + error);
      else {
        var tokenInwei =  web3.toWei(todoCoinReward, 'ether');
        AuctionTokenTaskMaster.deployed()
        .then(function(taskMasterInstance) {
         
          return taskMasterInstance.approve(contractAddressBidding, tokenInwei, {
            from: doer
          });
        }).then(function() {
          self.updateTransactionStatus("Authorization complete!");
          self.refreshAccountBalance();
  
        }).catch(function(e) {
          console.log(e);
          self.updateTransactionStatus("Error Authorizing - see console.");
        });
        AuctionTokenTaskMaster.deployed()
        .then(function(taskMasterInstance) {  
          return taskMasterInstance.balanceOf(document.getElementById("doer").value, function(err, result) {
          if (err)
            alert("Smart contract call failed: " + err);
          else {                        
            document.getElementById("accountBalance").innerHTML = result.toFixed(0);
            document.getElementById("accountBalance").style.color = "white";
          }
        });     
        });     
                        
      }

  });
  this.updateTransactionStatus("Transaction completed ... Please check your balance in some time.. ");
},



}





