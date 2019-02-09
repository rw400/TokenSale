pragma solidity ^0.5.0;

contract TokenSale {

    address public owner;
    uint256 public totalSupply;
    bool public totalSupplyMax = false;
    //uint256 public fundsRaised;     
    //uint256 public tokenRate;

    mapping(address => uint256) balances;

    event OwnershipTransferred(address indexed currentOwner, address indexed newOwner);
    event Minting(address indexed to, uint _amount);
    event SellTokens(address indexed from, address indexed to, uint256 amount);
    event Refund(address indexed from, address to, uint amount);

    constructor() public {
        owner = msg.sender;
    }

    modifier onlyOwner(){
        require(msg.sender == owner, "not owner");
        _;
    }
    modifier Minter(){
        require(!totalSupplyMax, "Max token limit has been reach, no more minting");
        _;
        
    }

    function minting(address _to, uint _amount) public onlyOwner Minter returns (bool success){
        totalSupply += _amount;
        balances[_to] += _amount;
        emit Minting(_to, _amount);
        return true;
    }

    function balanceOf(address _owner) public view returns (uint256 balance) {
        return balances[_owner];
    }
    
    function getTotalSupply() public view returns (uint){
        return totalSupply;
    }

    function maxTokens() public onlyOwner Minter returns (bool) {
        totalSupplyMax = true;
        return true;
    }
    
    function transferOwner(address newOwner) public	onlyOwner {
        owner = newOwner;
        emit OwnershipTransferred(msg.sender, newOwner);
    }

    function sellTokens(address _to, uint256 _amount) public onlyOwner Minter returns (bool) {
        require(_amount <= balances[msg.sender], "Insufficient Funds");
        require(_to != address(msg.sender), "Cannot sell to the same account: owner");

        balances[msg.sender] -= _amount;
        balances[_to] += _amount;
        emit SellTokens(msg.sender, _to, _amount);
        return true;    
    }
}