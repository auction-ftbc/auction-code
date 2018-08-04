
//var XYZToken = artifacts.require("./XYZToken.sol");
var AuctionBidding = artifacts.require("./AuctionBidding.sol");

module.exports = function(deployer) {
    return deployer.deploy(AuctionBidding)
};
