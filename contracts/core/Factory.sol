// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./Pair.sol";  // 引入 Pair 合约

contract Factory {
    address public owner;
    mapping(address => mapping(address => address)) public getPair;  // 记录 token0 和 token1 对应的 Pair 地址
    address[] public allPairs;  // 所有创建的 Pair 地址

    event PairCreated(address indexed token0, address indexed token1, address pair, uint256);

    modifier onlyOwner() {
        require(msg.sender == owner, "Factory: NOT_OWNER");
        _;
    }

    constructor() {
        owner = msg.sender;  // 设置合约部署者为 owner
    }

    // 创建一个新的 Pair 合约
    function createPair(address tokenA, address tokenB) external onlyOwner returns (address pair) {
        require(tokenA != tokenB, "Factory: IDENTICAL_ADDRESSES");
        require(tokenA != address(0) && tokenB != address(0), "Factory: ZERO_ADDRESS");
        require(getPair[tokenA][tokenB] == address(0), "Factory: PAIR_EXISTS");

        // 获取排序后的 token 地址（确保 tokenA 是地址较小的那个）
        (address token0, address token1) = tokenA < tokenB ? (tokenA, tokenB) : (tokenB, tokenA);

        // 创建新的 Pair 合约
        bytes memory bytecode = type(Pair).creationCode;
        bytes32 salt = keccak256(abi.encodePacked(token0, token1));
        assembly {
            pair := create2(0, add(bytecode, 32), mload(bytecode), salt)
        }

        // 初始化新的 Pair 合约
        Pair(pair).initialize(token0, token1);

        // 记录 Pair 地址
        getPair[token0][token1] = pair;
        getPair[token1][token0] = pair;  // 反向也需要存储
        allPairs.push(pair);

        emit PairCreated(token0, token1, pair, allPairs.length);
    }

    // 获取所有 Pair 的地址
    function allPairsLength() external view returns (uint256) {
        return allPairs.length;
    }
}