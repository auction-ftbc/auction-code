
var XYZToken = artifacts.require("./XYZToken.sol");
var AuctionBidding = artifacts.require("./AuctionBidding.sol");

module.exports = function(deployer) {
    deployer.deploy(XYZToken).then(function() {
      return deployer.deploy(AuctionBidding,XYZToken.address)
    });
  };
  