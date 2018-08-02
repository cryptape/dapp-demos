pragma solidity 0.4.24;

contract SimpleStore {
    address private owner;
    mapping (uint256 => string) private records;
    uint256[] private category;
    modifier onlyOwner(){
        require(msg.sender == owner);
        _;
    }
    
    event Recorded(string indexed _text, uint256 indexed _time);

    constructor () public 
    {
        owner = msg.sender;
    }
    
    function _addToList(uint256 time) private {
        category.push(time);
    }
    
    function getList()
    public
    view
    returns (uint256[])
    {
        return category;
    }
    
    function add(string text, uint256 time) public onlyOwner {
        records[time]=text;
        _addToList(time);
        emit Recorded(text, time);
    }
    function get(uint256 time) public view returns(string) {
        
        return records[time];
    }
}
