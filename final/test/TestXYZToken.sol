pragma solidity ^0.4.24;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/XYZToken.sol";
import "../contracts/TokenUser.sol";


contract TestXYZToken {
    uint256 constant initialBalance = 1000 ether;

    XYZToken token;
    TokenUser user1;
    TokenUser user2;

    constructor() public {
        token = new XYZToken();
        user1 = new TokenUser(token);
        user2 = new TokenUser(token);
    }

    
function testSetupPrecondition() public {

        Assert.equal(token.balanceOf(this), initialBalance, "the initial balances are equal");
    }


    function testAllowanceStartsAtZero() public  {
        Assert.equal(token.allowance(user1, user2), 0, "The allownace from user1 to user 2 is nil");
    }

    function testValidTransfers() public {
        uint sentAmount = 250;
        
        token.transfer(user2, sentAmount);
        Assert.equal(token.balanceOf(user2), sentAmount, "the balance of user2 after transfer is matching ");
        Assert.equal(token.balanceOf(this), initialBalance - sentAmount,  "the balance of owner after transfer is matching ");
    }

    

    function testApproveSetsAllowance() public  {

        token.approve(user2, 25);
        Assert.equal(token.allowance(this, user2), 25, "Allownace is same as approved amount");
    }

    function testFailWrongAccountTransfers() public  {
        uint sentAmount = 250;
         token = new XYZToken();
        user1 = new TokenUser(token);
        user2 = new TokenUser(token);
        token.transferFrom(user2, this, sentAmount);
        Assert.equal(token.balanceOf(user2), 0, "the balance of user2 after transfer is matching ");
        Assert.equal(token.balanceOf(this), initialBalance ,  "the balance of owner after transfer is matching ");
    }

    function testFailInsufficientFundsTransfers() public  {
        uint sentAmount = 250;
         token = new XYZToken();
        user1 = new TokenUser(token);
        user2 = new TokenUser(token);
        token.transfer(user1, initialBalance - sentAmount);
        token.transfer(user2, sentAmount + 1);
        Assert.equal(token.balanceOf(user1), initialBalance - sentAmount, "the balance of user1 after transfer is matching ");
        Assert.equal(token.balanceOf(this), sentAmount ,  "the balance of owner after transfer is matching ");
    }



}
