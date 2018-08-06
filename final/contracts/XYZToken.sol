pragma solidity ^0.4.24;

contract Token {
    function totalSupply() constant returns (uint256 supply) {}
    function balanceOf(address _owner) constant returns (uint256 balance) {}
    function transfer(address _to, uint256 _value) returns (bool success) {}
    function transferFrom(address _from, address _to, uint256 _value) returns (bool success) {}
    function approve(address _spender, uint256 _value) returns (bool success) {}
    function allowance(address _owner, address _spender) constant returns (uint256 remaining) {}
    function mint(uint256 amount) public returns (uint256) {}
    function burn(uint256 amount) public returns (uint256) {}
    event Transfer(address indexed _from, address indexed _to, uint256 _value);
    event Approval(address indexed _owner, address indexed _spender, uint256 _value);
}


contract XYZToken is Token { 
    string public name;                   
    uint8 public decimals;                
    string public symbol;                 
    uint256 public unitsOneEthCanBuy;     
    uint256 public totalEthInWei;         
    address public fundsWallet;         
    address public local_from;
    uint256 public local_value;
    address public local_to;

    constructor() public payable {
        balances[msg.sender] = 1000000000000000000000;               
        totalSupply = 1000000000000000000000;                        
        name = "XYZToken";                                   
        decimals = 18;                                             
        symbol = "XYZ";                                             
        unitsOneEthCanBuy = 10;                                      
        fundsWallet = msg.sender;                                    
    }

    modifier onlyAdmin () {
        if (msg.sender == fundsWallet) {
            _;
        }
    }
    function mint(uint256 amount) public onlyAdmin returns (uint256) {
        totalSupply = totalSupply + amount;
        balances[msg.sender] =  balances[msg.sender] + amount;
        return totalSupply;
    }
    
    function burn(uint256 amount) public onlyAdmin returns (uint256) {
        totalSupply = totalSupply - amount;
         balances[msg.sender] =  balances[msg.sender] - amount;
         return totalSupply;
    }

/*function transfer(address _to, uint256 _value) returns (bool success) {
        if (balances[msg.sender] >= _value && balances[_to] + _value > balances[_to]) {
            balances[msg.sender] -= _value;
            balances[_to] += _value;
            Transfer(msg.sender, _to, _value);
            return true;
        } else { return false; }
    }
*/
    function transfer(address _to, uint256 _value) returns (bool success) {
        if (balances[msg.sender] >= _value && balances[_to] + _value > balances[_to]) {
            balances[msg.sender] -= _value;
            balances[_to] += _value;
            Transfer(msg.sender, _to, _value);
            return true;
        } else { return false; }
    }

    function transferBetweenAccounts(address _from, address _to, uint256 _value) returns (bool success) {
            if (balances[_from] >= _value && balances[_to] + _value > balances[_to]) {
            balances[_to] += _value;
            balances[_from] -= _value;
            Transfer(_from, _to, _value);
            return true;
        } else { return false; }
    }
    function transferFrom(address _from, address _to, uint256 _value) returns (bool success) {
        local_from = _from;
        local_to = _to;
        local_value = _value;
        address local_sender = msg.sender;
        if (balances[_from] >= _value && allowed[_from][msg.sender] >= _value && balances[_to] + _value > balances[_to]) {
            balances[_to] += _value;
            balances[_from] -= _value;
            allowed[_from][msg.sender] -= _value;
            Transfer(_from, _to, _value);
            return true;
        } else { return false; }
    }


    function balanceOf(address _owner) constant returns (uint256) {
        return balances[_owner];
    }

    function approve(address _spender, uint256 _value) returns (bool success) {
        allowed[msg.sender][_spender] = _value;
        Approval(msg.sender, _spender, _value);
        return true;
    }

    function allowance(address _owner, address _spender) constant returns (uint256 remaining) {
      return allowed[_owner][_spender];
    }

    mapping (address => uint256) balances;
    mapping (address => mapping (address => uint256)) allowed;
    uint256 public totalSupply;

    function() payable{
        totalEthInWei = totalEthInWei + msg.value;
        uint256 amount = msg.value * unitsOneEthCanBuy;
        require(balances[fundsWallet] >= amount);
        balances[fundsWallet] = balances[fundsWallet] - amount;
        balances[msg.sender] = balances[msg.sender] + amount;
        Transfer(fundsWallet, msg.sender, amount); 
        fundsWallet.transfer(msg.value);                               
    }

}


