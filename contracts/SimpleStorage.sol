// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract SimpleStorage {
    uint256 private storedData;

    event DataUpdated(uint256 newValue);

    function set(uint256 _value) public {
        storedData = _value;
        emit DataUpdated(_value);
    }

    function get() public view returns (uint256) {
        return storedData;
    }
}