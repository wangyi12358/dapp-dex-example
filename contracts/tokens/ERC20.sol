// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract DEXPair {
    address public token0;
    address public token1;
    uint256 public reserve0;
    uint256 public reserve1;

    constructor(address _token0, address _token1) {
        token0 = _token0;
        token1 = _token1;
    }

    function addLiquidity(uint256 amount0, uint256 amount1) external {
        IERC20(token0).transferFrom(msg.sender, address(this), amount0);
        IERC20(token1).transferFrom(msg.sender, address(this), amount1);
        reserve0 += amount0;
        reserve1 += amount1;
    }

    function swap(uint256 amountIn, address tokenIn) external {
        require(tokenIn == token0 || tokenIn == token1, "Invalid token");

        address tokenOut = (tokenIn == token0) ? token1 : token0;
        uint256 amountOut;

        if (tokenIn == token0) {
            amountOut = (reserve1 * amountIn) / (reserve0 + amountIn);
            reserve0 += amountIn;
            reserve1 -= amountOut;
        } else {
            amountOut = (reserve0 * amountIn) / (reserve1 + amountIn);
            reserve1 += amountIn;
            reserve0 -= amountOut;
        }

        IERC20(tokenOut).transfer(msg.sender, amountOut);
    }
}