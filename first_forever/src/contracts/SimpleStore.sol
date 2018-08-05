pragma solidity 0.4.24;

contract SimpleStore {
    mapping (address => mapping (uint256 => string)) private records;
    mapping (address => uint256[]) private categories;
    
    event Recorded(address _sender, string indexed _text, uint256 indexed _time);
    
    function _addToList(address from, uint256 time) private {
        categories[from].push(time);
    }
    
    function getList()
    public
    view
    returns (uint256[])
    {
        return categories[msg.sender];
    }
    
    function add(string text, uint256 time) public {
        records[msg.sender][time]=text;
        _addToList(msg.sender, time);
        emit Recorded(msg.sender, text, time);
    }
    function get(uint256 time) public view returns(string) {
        
        return records[msg.sender][time];
    }
}
