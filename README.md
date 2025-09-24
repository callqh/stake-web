## Issue
1. 为什么withdraw的金额一直是0？
2. 质押的原理是什么？把钱借给合约账户，然后合约账户去做投资之类的？
  - 产生的rewards是哪里来的？
  - metanode的代币不能给sepolia?
3. pid是怎么来的？ /Users/liuqh/lqh/stake-web/src/hooks/useStakingBalance.ts 中通过合约的ETH_PID方法获取pid，这种方法是对的吗
  - PID在合约里就是写死的bigint(0)
4. 有时候获取余额的时候会超时或者失败，这时候就需要重试的机制，这也是源码中实现retryWithDelay的作用


## 数据结构

### Pool
- stTokenAddress: 质押代币的地址。
- poolWeight: 质押池的权重，影响奖励分配。
- lastRewardBlock: 最后一次计算奖励的区块号。
- accMetaNodePerST: 每个质押代币累积的 MetaNode 数量。
- stTokenAmount: 池中的总质押代币量。
- minDepositAmount: 最小质押金额。
- unstakeLockedBlocks: 解除质押的锁定区块数。

### User
- stAmount: 用户质押的代币数量。
- finishedMetaNode: 已分配的 MetaNode 数量。
- pendingMetaNode: 待领取的 MetaNode 数量。
- requests: 解质押请求列表，每个请求包含解质押数量和解锁区块。

## 流程梳理
1. 首页展示的质押代币数量需要从pool池子信息中获取，即 stTokenAmount 
2. withdraw中的金额通过 withdrawAmount 方法获取，返回参数为[requestAmount, withdrawableAmount]
  - requestAmount 质押的总金额
  - withdrawableAmount 可提现的金额
  - withdrawPending 待提现的金额 = requestAmount - withdrawableAmount
3. 获取奖励的金额
  - pending rewards 使用user中的第二个变量
  - claim用来领取奖励
