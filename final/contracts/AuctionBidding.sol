pragma solidity ^0.4.24;
contract AuctionBidding {
  
    struct AuctionHighestBidder {
        address highestBidder;
        uint256 highestBidValue;
        bool active;
    }
    address auctionOwner;
    
    function AuctionBidding() {
        auctionOwner = msg.sender;    
    }
    
    modifier onlyAdmin () {
        if (msg.sender == auctionOwner) {
            _;
        }
    }


    /*Highest Bidder details for particular auction id*/
    mapping (uint256 => AuctionHighestBidder) auctionHighestBidder;
    
    function saveUserBidForAuction(uint256 auctionId, uint256 bidValue) public returns (uint256) {
        AuctionHighestBidder bidder = auctionHighestBidder[auctionId];
        if (bidder.highestBidValue < bidValue) {
            bidder.highestBidValue = bidValue;
            bidder.highestBidder = msg.sender;
            bidder.active = true;
            auctionHighestBidder[auctionId] = bidder;
        }
        return bidValue;
    }
    
    /*
    This function gives me details of higher bidder at any point of time
    */
    function getHighestBidderByAuctionId(uint256 auctionId) public returns (uint256) {
        AuctionHighestBidder storage bidder = auctionHighestBidder[auctionId];
        if (bidder.active == false) 
            throw ;
        return bidder.highestBidValue;
    }
    
    /*
    Announce the winner and deactivate auction
    Need help - how to enable cross contract communication
    */
    function announceWinnerForAuction(uint256 auctionId) public onlyAdmin returns (address, uint256) {
        AuctionHighestBidder storage bidder = auctionHighestBidder[auctionId];
         if (bidder.active == false) 
            throw ;
        //Deduct coin amount from his wallet..TO DO: take help from mentor
        //learn how to delete bid from system -- To do: take help from mentor
       // auctionHighestBidder[auctionId] = 0; 
        //auctionBidsByUserList[auctionId] = 0;
        bidder.active = false;
        auctionHighestBidder[auctionId] = bidder;
        return (bidder.highestBidder, bidder.highestBidValue);
    }
    
    //how to clear auction from map or disable auction..
    function endAuction(uint256 auctionId) public onlyAdmin returns (address) {
        AuctionHighestBidder storage bidder = auctionHighestBidder[auctionId];
        if (bidder.active == false) 
            throw ;
        bidder.active = false;
        auctionHighestBidder[auctionId] = bidder;
        return bidder.highestBidder;
    }
    
 
}