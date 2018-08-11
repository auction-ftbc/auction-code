pragma solidity ^0.4.24;
import "./XYZToken.sol";

contract AuctionBidding {
  
    struct AuctionHighestBidder {
        address highestBidder;
        uint256 highestBidValue;
        bool active;
    }

    uint256 unitsOneEthCanBuy = 10; 
     
    address auctionOwner;
    XYZToken ftbcToken;
    
    function AuctionBidding(address ftbcTokenAddress) {
        ftbcToken = XYZToken(ftbcTokenAddress);
        auctionOwner = msg.sender; 
    }
    
    modifier onlyAdmin () {
        if (msg.sender == auctionOwner) {
            _;
        }
    }
    
    
    /*
    get the balance
    */
    function getBalanceOf(address tokenAddress) public constant returns(uint256) {
        return ftbcToken.balanceOf(tokenAddress);
    }

    /*
    function buyFTBCToken() public payable returns (uint256)  {
        address myaddr = address(ftbcToken);
        myaddr.sendTransaction(msg.value);

    }*/
    
   /* function buyTokenForBidding(uint256 value) public payable returns (uint256)  {
        uint256 token = ftbcToken.buyToken(value);
        return token;

    }*/
    
    function transferAuctionToken(address to, uint256 value) public payable returns (bool) {
        address tmpFrom = msg.sender;
        //address tmpTo = to;
        
        bool status = ftbcToken.transferFrom(msg.sender,to ,value);
        return status;
    }
    
    /*Highest Bidder details for particular auction id*/
    mapping (uint256 => AuctionHighestBidder) auctionHighestBidder;
    
    //If the bidder amount is high, release the token of last bidder
    //Approval function implementation and transfer from using msg.sender
    function saveUserBidForAuction(uint256 auctionId, uint256 bidValue) public returns (uint256) {
        AuctionHighestBidder bidder = auctionHighestBidder[auctionId];
        if (bidder.highestBidValue < bidValue) {
            AuctionHighestBidder lastBidder = bidder;
            //release tokens for him
           // this.releaseAuctionTokens(auctionOwner, lastBidder.highestBidder, lastBidder.highestBidValue);
            bidder.highestBidValue = bidValue;
            bidder.highestBidder = msg.sender;
            bidder.active = true;
            auctionHighestBidder[auctionId] = bidder;
            //ftbcToken.transferFrom(msg.sender,to ,value);
            transferAuctionToken(auctionOwner,bidValue);
        }
        return bidValue;
    }
    
    function releaseAuctionTokens(address from, address to, uint256 value) public payable returns (bool) {
        bool status = ftbcToken.transferBetweenAccounts(from, to, value);
        return status;
    }
    /*
    This function gives me details of higher bidder at any point of time
    ToDo: Return bidder address
    */
    function getHighestBidderByAuctionId(uint256 auctionId) public constant returns (uint256) {
        AuctionHighestBidder storage bidder = auctionHighestBidder[auctionId];
        return bidder.highestBidValue;
    }
    
    /*
    Announce the winner and deactivate auction
    Need help - how to enable cross contract communication
    */
    function announceWinnerForAuction(uint256 auctionId) public onlyAdmin returns (address, uint256) {
        AuctionHighestBidder storage bidder = auctionHighestBidder[auctionId];
        //Deduct coin amount from his wallet..
        //learn how to delete bid from system -- To do: take help from mentor
       // auctionHighestBidder[auctionId] = 0; 
        //auctionBidsByUserList[auctionId] = 0;
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
    
    function() payable{
        uint256 tokenToBuy = msg.value*unitsOneEthCanBuy;
        ftbcToken.transfer(msg.sender, tokenToBuy);
       // address(this).transfer(msg.value);
    }
    
    function getContractBalance() public constant returns (uint256) {
        return address(this).balance;
    }


}