// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Pair {
    address public token0;
    address public token1;
    uint256 public reserve0;
    uint256 public reserve1;

    event Swap(address indexed sender, uint256 amount0In, uint256 amount1In, uint256 amount0Out, uint256 amount1Out);

    constructor(address _token0, address _token1) {
        token0 = _token0;
        token1 = _token1;
    }

    // 添加流动性
    function addLiquidity(uint256 amount0, uint256 amount1) external {
        IERC20(token0).transferFrom(msg.sender, address(this), amount0);
        IERC20(token1).transferFrom(msg.sender, address(this), amount1);
        reserve0 += amount0;
        reserve1 += amount1;
    }

    // 移除流动性
    function removeLiquidity(uint256 amount0, uint256 amount1) external {
        require(reserve0 >= amount0 && reserve1 >= amount1, "Insufficient liquidity");

        IERC20(token0).transfer(msg.sender, amount0);
        IERC20(token1).transfer(msg.sender, amount1);
        reserve0 -= amount0;
        reserve1 -= amount1;
    }

    // 交换函数
    function swap(uint256 amountIn, bool isToken0ToToken1) external {
        uint256 amountOut;
        if (isToken0ToToken1) {
            amountOut = getAmountOut(amountIn, reserve0, reserve1);
            require(amountOut > 0, "Insufficient output amount");
            IERC20(token0).transferFrom(msg.sender, address(this), amountIn);
            IERC20(token1).transfer(msg.sender, amountOut);
            reserve0 += amountIn;
            reserve1 -= amountOut;
        } else {
            amountOut = getAmountOut(amountIn, reserve1, reserve0);
            require(amountOut > 0, "Insufficient output amount");
            IERC20(token1).transferFrom(msg.sender, address(this), amountIn);
            IERC20(token0).transfer(msg.sender, amountOut);
            reserve1 += amountIn;
            reserve0 -= amountOut;
        }

        emit Swap(msg.sender, amountIn, 0, amountOut, 0);
    }

    // 获取交换输出量
    function getAmountOut(uint256 amountIn, uint256 reserveIn, uint256 reserveOut) public pure returns (uint256 amountOut) {
        require(amountIn > 0, "Insufficient input amount");
        require(reserveIn > 0 && reserveOut > 0, "Insufficient liquidity");
        uint256 numerator = amountIn * reserveOut;
        uint256 denominator = reserveIn + amountIn;
        amountOut = numerator / denominator;
    }
}