---
id: staking-faq
title: FAQs
---

* [Staking on testnet](#staking-testnet)
* [Node operation](#node-operation-faqs)
* [Fees and costs](#fees-and-costs-faqs)
* [Block production and rewards](#block-production-and-rewards-faqs)
* [Security](#security-faqs)
* [Terminating your staking operation](#terminating-your-staking-operation)
* [Submit other questions](#submit-a-new-question)

## Staking Testnet

### How do I stake?

Currently there are 3 different options available to stake CTSI:

1. You can delegate your CTSI to a decentralized pool of your choice. Each pool has its own commission taken from pool rewards to cover their costs and generate profit. The tutorial to do so is [here](https://medium.com/cartesi/noethers-staking-delegation-full-mainnet-release-is-now-live-92334e91fbb1)

2. You are able to stake directly by running your own node to represent your stake. This can be a good option for you if you have a relatively large amount of CTSI and the patience/ability to monitor the node and make sure it's running correctly 24/7. The tutorial for this options is [here](https://medium.com/cartesi/running-a-node-and-staking-42523863970e)

3. You can stake indirectly using a 3rd party custodian centralized service, like Binance, CoinOne and MyCointainer. Each service has its own set of policies, rules, fees, etc so make sure to educate yourself on those and ask the 3rd party to clear any of your doubts in case you choose to follow that route.

### What's the minimum amount of CTSI to stake?

The system doesn't impose a limit (you could even stake only 1 CTSI) but as the setup process has costs that do not depend on the amount you are staking (take a look at the costs here) and running a node does require maintenance, you should evaluate if the combination of (amount of CTSI/duration of staking) is worth the effort. Relatively low stakes do tend to take a lot of time to be able to produce blocks, so having a relatively low stake will probably make sense only if you are planning to stake for a very long time. For relatively small stakes it might be a better idea to join a decentralized pool, or even stake though a 3rd party centralized custodian service, check those options on this other FAQ.



### How much CTSI should I put in the allowance?

The allowance is the maximum total amount of tokens the pool smart contract can transfer out of your wallet. You can set it to any value you want, your wallet amount, less or more.

You need to input a large enough value to match the amount you want to stake, at least. In case you might want to stake more in the future, you may consider a margin in the amount you set on allowance, otherwise you’ll need to raise the value in the future (and that issues a transaction to the Ethereum blockchain, so it has costs). The value you set in allowance is not bounded by the amount of CTSI you own (if you want to stake and own 300 000 CTSI, you may set the allowance to 1 000 000, for example, so you still can add 700 000 CTSI to your stake without having to change your allowance). Currently the Cartesi Explorer automatically sets the allowance for you with the minimum needed value to allow you to stake the desired amount. There is a checkbox that you can tick to make it set the maximum possible value for that, so you won't need to update the allowance value when increasing your stake in the future.



### What browser can I use to access the Cartesi Explorer?

Currently we support Chrome and Firefox. Other browsers that support Metamask might work as well, but we provide no guarantees on that.

### What is the minimal configuration to run Noether?

Current requirements are really low, just a computer or VPS running 24/7, a reliable internet connection and a stable Ethereum Gateway. Your "mining power" is proportional to your stake, not your hardware. Do check periodically for changes in the requirements as they tend to be updated with new releases of Noether.



### I want to stake more CTSI, do I need to do something on my node?

No, just add your stake using the Cartesi Explorer as you did the first time. You might need to increase the allowance in case you set a limit lower than the final amount of CTSI you want to stake. After placing your new stake and the staking transaction goes through, your CTSI will mature for 6 hours. When the maturation period is over, the CTSI you staked will automatically count towards your block production chances. Keep in mind that if you stake more CTSI while you still have CTSI maturing, the maturation period will be reset for your previously maturing stake.



### Can I transfer funds to my node directly from an exchange?

Yes you can, just make sure to double-check the address you are sending the funds to is the one of your node as there is no way to "get a refund" on funds transferred to the wrong address.



### How much ETH should I fund my node with?

It is hard to predict how much you should fund your node with, since there are lots of moving parts like gas price fluctuation, stakes variation and the intrinsic variation in the block production rate. For small stakers, putting enough ETH for the node to accept the hire (~31k gas cost) and produce a couple of blocks (~120k gas per block) should be enough to run the node for some time. That would be roughly 271 x gas_price / 1 000 000 ETH.

There is also a template Google sheet you can use to help you to estimate the ETH amount you need here. You may take a look at sites like etherscan gas price history page to estimate an average gas price value. Regardless of the amount you fund your node with, it is always a good idea to check on the node to make sure it is still well funded and that it is running fine.


### How much ETH do I need?

You have to do some math in order to estimate the amount of ETH you'll need for staking.

There is basically a one-time cost to setup the staking operation and a continuous operational cost. You can take a look at the gas prices associated with each operation involved in the staking process and also at this section about the amount of ETH to fund your node with.

There is also a template Google sheet you can use to help you to estimate the ETH amount you need here.



### Cannot authorize CTSI with my ledger, getting a “Ledger device: Invalid data received” error, what’s wrong?

You have to enable blind signing in the Ethereum application of your ledger. Procedure from Ledger documentation.



### I hired my node in the Cartesi Explorer, but I am stuck with the "Cancel Hire" button in the Explorer. What's going on?

It is probably a good idea to check if the hire transaction was correctly processed as it might still be pending due to Ethereum Network congestion or a gas price surge. You can do so by checking your hire transaction status at Etherscan and inputting your wallet address. If the hire transaction went through, there might be a problem with your node accepting the hire. Check your node's log, copy the tx hash of the accept job transaction (available in your node's log) and take a look at it on Etherscan. If it is taking too long to process or you get an error, do contact us at the Cartesi Technical Community on Discord so we can provide you some help.

## Node operation FAQs

### How do I update my Cartesi Node?

Please check the Noether update wiki page.

### How do backup my Cartesi Node wallet?

There are 2 alternatives, the more secure one is making a copy of the encrypted wallet file
Backing up the encrypted wallet file
Open a terminal and input this command to make a copy of the encrypted wallet file: docker cp cartesi_noether:/root/.ethereum/key key.backup. It will create a file called key.backup on the current directory that is a copy of your node's encrypted wallet
Backing up the wallet mnemonic
Open a terminal and input this command to export the wallet mnemonic: docker run -it -v cartesi_wallet:/root/.ethereum cartesi/noether export. It will print the 12-word mnemonic that can be used to generate the node's wallet. As this is not encrypted, take extra care on how to store it since anyone in possession of this can directly derive your node wallet and manipulate its funds.


### How do I change my Ethereum Network Gateway?

Stop your node (one way to do it is using the docker kill cartesi_noether command on a terminal, if you are using the default name for the node container)
Edit the command you used to start your node before (it should be something like this docker pull cartesi/noether; docker run -it --rm --name cartesi_noether -v cartesi_wallet:/root/.ethereum cartesi/noether --url <YOUR_OLD_ETHEREUM_GATEWAY_URL_HERE> --wallet /root/.ethereum/key --create --verbose), replacing the value in the --url parameter with the url of the new Ethereum Network Gateway you wish to use (example: old value --url https://myoldethgateway.com and new value --url https://mainnet.infura.io/v3/your_infura_project_id_here)
Start your node using the command from the previous step, enter your password when prompted
If you are on a terminal, once your node resumes operations, detach from it (default key sequence is ctrl+p followed by ctrl+q, you can learn more about attaching to/detaching from a container in the official docker documentation) so your node keeps running once you close the terminal


### I am getting some network errors in my node's log, should I worry?

It depends on the type of error and frequency as having your node not working when eligible to produce will prevent it from producing a block and getting the associated reward. A common source of errors is using an unstable Ethereum Gateway, it causes errors similar to this one:

ERROR: Error: processing response error (body="{"jsonrpc":"2.0","error":{"code":-32600,"message":"Invalid Request. Requested data is older than 128 blocks."},"id":25035}", error={"code":-32600}, requestBody="{"method":"eth_call","params":[{"from":"your_node_address","to":"0x9edeadfde65bcfd0907db3acdb3445229c764a69","data":"some_payload_data"},"latest"],"id":25035,"jsonrpc":"2.0"}", requestMethod="POST", url="https://eth.cartesi.io/", code=SERVER_ERROR, version=web/5.0.12)
In case you are getting those, it highly advised to switch to a stable Ethereum Gateway(Infura is a good option and the free tier is enough to run a single node)



### If I turn off my computer/close the browser window/close the terminal, will my node keep running?

It depends on how you are running your node. If you are running a docker node on a VPS, make sure to detach from the container before closing your session, so the container keeps running. You can detach from a docker container using the default escape sequence of ctrl+p followed by ctrl+q. You can learn more about attaching to/detaching from a container in the official docker documentation. If you are running a docker container in your local computer, and you manually started the container in a terminal, you have to detach from the container before closing the terminal, so it keeps running in the background. If you used some graphical interface to start your container, you can probably close it safely and your container will continue running in the background but do check your specific tool documentation to make sure of it. When you are running a local node, your node can only run when your computer is on, so if you shutdown your computer, you will not produce blocks when eligible during that period.



### My node displays messages repeatedly containing canProduce=false/eligibleForNextBlock=false is this normal?

Yes, that is normal and it is expected to be shown at approximately 30 second intervals. The node periodically pools the Blockchain to check the stake of the user it represents, prints the stake status in the log and then pools the blockchain to check if it is eligible to produce a block at the moment. If it isn't (and that is the case most of the times) it prints an entry containing canProduce=false or eligibleForNextBlock=false to display the result of that check. After that it will sleep for 30 seconds and try this procedure again. In case it returns true, the node will then issue a transaction to try to produce a block.



### My node experienced an error while trying to produce a block. The message it shows in the transaction is 'User couldnt produce a block successfully', what is going on?

That means that you were not eligible to produce a block when your transaction was processed. That can happen for a few reasons. The most common reason is losing a race to produce the block to another eligible user: the competing user had his transaction processed before and when your transaction was processed the block was no longer available. Another cause can be there was a sudden surge on gas prices after or transaction was sent, so when gas prices got back to values compatible with the price set on your transaction, your window to claim a block has already passed. A more uncommon reason is if your Ethereum network provider answers from an out-of-synch node, so your node believes it is eligible for producing a block when in reality it is not.



### Why does my Infura/Alchemy/other Ethereum Gateway show so many requests if my node has not produced any blocks?

The Ethereum Gateway requests are used for any sorts of operations not just for producing blocks. Your node pools the Ethereum blockchain at 30s intervals to check if it is eligible for producing a block. That check requires multiple “read-only” operations on the Ethereum blockchain and they all count as requests in your Ethereum Gateway. As those operations are “read-only” they don’t require issuing transactions nor spend any gas.



### My node is not displaying the periodic status message, what is wrong?

You probably have mistyped/cut the last parameter of the command to start your node (--verbose), the node will not print the periodic messages if that parameter is not set.



### My node is displaying only “sleeping for 30 seconds” messages, is this normal?

It means your node was not hired yet. If you haven’t done so, copy your node address and go to the Cartesi Explorer to hire your node. If you already have, you may want to check the status of the transaction for hiring your node, it might be still pending.



### My node displaying a low funds warning, what should I do?

Producing a block demands spending gas. When your node funds are below a certain value, the node starts to display a low funds warning to remind you to refund your node as not having enough ETH in the node's wallet when you are eligible to produce a block will prevent you from doing so, thus not earning the block production reward.



### My node has a message saying waiting for confirmation for X minutes is something wrong?

When you issue a transaction on the Ethereum Network, the time for it to be processed depends on multiple factors like how busy the network is, the amount of pending transactions, current gas prices, etc. The Nother node uses the average gas price of recently processed transactions and a gas price multiplier when setting the transaction gas price in order to avoid having the transaction pending for long. Still, it is possible that there is a sudden gas price surge and your transaction gets stuck on the transaction pool. If that happens when trying to produce a block, it might delay the transaction enough so that another user produces the block before you and, when the transaction is processed, it reverts because you are no longer eligible to produce a block. This should not happen frequently, so if you are experiencing this a lot, let us know to check if there is something wrong with your node.



## Fees and costs FAQs

### Why are the ETH fees I am paying so high?

The ETH fees to process a transaction depend on the amount of gas that is required to process the transaction and also on the gas price set when the transaction was issued. Noether sets transaction gas price using the average gas price of the recently processed blocks, multiplied by a scaling factor so that it is unlikely that the transactions stay pending for a long time. Bare in mind that gas prices usually fluctuate a lot and rapidly. You may check current gas prices in sites like https://etherscan.io/gastracker and https://ethgasstation.info/ .

### How much ETH do the transactions involved in staking CTSI cost?

You have to do some math in order to estimate the final ETH cost and the effective cost depends on the current gas price at the time it is performed. Keep in mind that while you can choose when to perform most of the setup related operations in order to process them in periods of low gas prices, block production is time sensitive, so you won't have control over gas prices for that.

The costs involved in the node setup are:

Authorizing the PoS contract to access your wallet CTSI: ~44k gas (from user wallet)
Stake CTSI: ~69k gas (from user wallet)
Hire and authorize node to represent you: ~124k gas + amount of eth you fund your node with (from user wallet)
Node accept to be hired: ~31k gas (from node wallet)
The costs involved in terminating your operation are:

Retiring the node: ~ 31k gas (from user wallet)
Unstaking CTSI: ~57k gas (from user wallet)
Withdraw the CTSI after the unstaking lock period: ~33k gas (from user wallet)
Node return the eth it has to your user wallet: 21k gas (from node wallet)
The costs involved in normal operations are:

Successful block production: 120k gas (from node wallet)
Reverted block production transaction: ~65k gas (from node wallet)
Transferring more funds to node: 21k gas + amount of eth you fund your node with (from user wallet)


### Why pay for blocks that failed to be produced?

Unfortunately it is unavoidable. In some cases, more than one user can be eligible and try to produce the same block. When that happens the first user to have the transaction processed will probably succeed and the others will no longer be eligible when their transactions are processed, so they will revert. That is expected and is part of the protocol. Since reverted transactions still spend gas on Ethereum, that means that you spend ETH when that happens. Those should not be frequent though, so if you are experiencing a high rate of reverted transactions, please let us know so we can help you check if there is something wrong with your node.



## Block production and rewards FAQs

### My node is not producing the amount of blocks I expected

The mining is a probabilistic process with multiple variables involved. In practice the difficulty varies constantly and considerably as nodes that are eligible to produce a block don't always do so (due to multiple factors such as an Ethereum network provider outage), globally staked values change a lot (multiple new users staking, some withdrawals, users increasing stakes, etc), plus the intricate entropy of the process itself due to security reasons. The system itself is designed in a way that if you take a group of nodes with certain stakes and leave them running for a really long time, when you take a look at the blocks produced by each node, they will have the same proportion as their stakes (a node with 10% of the stakes will have 10x more blocks than one with 1%, etc), but even in this ideal scenario, if you take a look at smaller time windows, the individual block production of each node will fluctuate due to the probabilistic nature of the process (a node that produces on average 3 blocks a day will have days producing 0 blocks, 2 blocks, 5 blocks, etc, for example, but the average block production will follow the same proportion that it's stake has to the total stake). An analogy to understand the probabilistic nature of the PoS system is thinking about a lottery. Just like if purchasing 1/4 of the tickets in a series of draws doesn't mean you will win 1 in every 4 draws, but rather will win 1 out of 4 draws on average, the same happens with your block production.

One thing to keep in mind is that comparing your block production with others in the Cartesi Explorer is not an apples to apples comparison. The explorer only shows the current stake of the users (and users often increase/decrease their stake through time), most users have been staking for different durations and probably in times with different mining difficulties.



### What is the reward per block produced?

Currently the reward is 2900 CTSI, this value is bound to last for approximately 6 months. You may read more about this on the Medium post.



### How can I have a grasp on what to expect for my block production?

The PoS is probabilistic, so there is no way to tell exactly what is going to happen. However, making some simplifications on the PoS model, it's possible to calculate some averages that can give some insight on what to expect. Given this simplified model, you can tweak the parameters for a "best case" and a "worst case" scenario so you obtain a range of likely outcomes. The simplified model we'll describe considers constant stakes from all users, constant block rewards and nodes perfectly functional 24/7 among other differences from the real system. The logic to calculate this simplified model's output is summarized bellow:
```
# user_stake is an input of the model
# total_stakes is an input of the model
user_stake_percent = user_stake / total_stakes

# num_days is an input of the model
# blocks_per_day is the average number of blocks produced by the PoS, currently it's ~48 (~30min between blocks)
total_blocks = num_days * blocks_per_day

# this uses the values calculated above
blocks_by_user = user_stake_percent * total_blocks

# blocks_by_user is calculated above
# block_reward has the value of the current block reward, currently it's 2900 CTSI/block
projected_period_rewards = blocks_by_user * block_reward

# user_stake_percent is calculated above
# blocks_per_year is the average number of blocks produced by the PoS in a year, currently it's ~17520 (~30min between blocks)
# block_reward has the value of the current block reward, currently it's 2900 CTSI/block
# user_stake is an input of the model
projected_annual_earnings = (user_stake_percent * blocks_per_year * block_reward) / user_stake
Some things to bare in mind when using this model:
```
The PoS system is probabilistic and the output of the model is an expected average. You can understand what that means with an example: if you got a reward for flipping a coin and getting a head, and you flipped a coin twice, you could have 3 possible outcomes (disregarding the order): two heads, two tails or a head and a tail. The actual reward you could get would be nothing, one or two rewards, but the average reward if you had a large number of people doing that, would be very close to one. That average value for a very large number of users within the given situation is what the model outputs. It is very useful for having a grasp on what to expect but in practice what actually happens in your case will probably not match that exact output.
The model considers constant difficulty, stakes, reward values, etc on it's calculations. In practice, difficulty varies a lot due to multiple reasons (nodes are not online and working perfectly 24/7, users withdraw and stake CTSI all the time, etc) so when using the model it is wise to simulate a couple of extreme scenarios, one with a very high total staked value, to use as worst-case scenario, and another one with a very low total staked value, to use as a best-case scenario. Those are useful to have a better range of what to expect.
Your node only produces blocks when functioning properly, so the more it is interrupted and has problems, the more your results will probably diverge from the value provided by the model.


### Is it better to run my own node, join a decentralized pool or to use a 3rd-party custodian service to stake?

It is a personal choice and one option might be better suited to you depending on your requirements and expectations. The three options have different advantages and disadvantages. Running your own node requires some technical proficiency, has higher setup costs and requires a certain amount of time and energy to maintain your node running correctly, but provides you with the full rewards of the blocks produced using your stake. Joining a decentralized pool through the Cartesi Explorer you'll get rewards whenever the pool produces block - proportional to the cut of your stake on the pool - so you'll get more frequent but diluted rewards comparing to staking by yourself. The pool also gets a cut of the rewards, which is the setup poll commission: it's intended to cover the costs of running a pool and also give some reward to the pool manager for doing so. When using a pool you don't have to worry about maintaining a node, that's the pool manager's job, but you should monitor the pool performance to make sure it's node is being well taken care of. Decentralized pools are safe: withdrawing your CTSI demands having control over the wallet associated to those funds. Using a 3rd party custodian service is generally simpler and faster to setup, demands lower technical proficiency and the custodian service takes care of having the node up and running, but that comes at a cost: each custodian service takes a cut of the rewards and has its own fees and reward distribution policy, so do educate yourself on those if deciding for this option. When using a custodian service, staking rewards have a similar behavior to decentralized pools in terms of rewards frequency: while directly staking relatively low values will probably take a very long time to produce a block and generate rewards, custodian services generally distribute rewards on a frequent basis (though very diluted amounts). One last important point is that, from the blockchain point of view, your CTSI is owned by the custodian service (since it's under it's wallet's control) so you have to trust it to behave correctly.



Does running more nodes/running on a more powerful hardware/etc increase block production chances?
No, it doesn't. The only factor that increases your "mining power" is having a larger share of the total stakes. If the total stakes decrease and your stake is the same, your block production chances increase. If you increase your stake, your block production chances increase. On the other hand if the total stakes increase and your stake is the same, your chances decrease and the same applies in case you lower your stake.



## Security FAQs


### If my node is compromised, can the attacker steal all my CTSI?

No, your node’s wallet holds only the ETH you fund it with (used by your node to accept being hired during setup, trying to produce blocks on regular operation, and to return funds to your wallet in case you retire the node) so an attacker that compromises your node can only possibly steal that. Your staked CTSI is locked in the PoS contract and can only be manipulated using your wallet, not the node wallet.



### If I lose/delete my node is my CTSI/eth safe?

Yes, your node’s wallet holds only the ETH you fund it with (used by your node to accept being hired during setup, trying to produce blocks on regular operation, and to return funds to your wallet in case you retire the node) so if lose access to or delete your node you will only lose access to that ETH you funded your node with. Your staked CTSI is locked in the PoS contract and can only be manipulated using your wallet, not the node wallet.



## Terminating your staking operation

### I have retired my node in the Cartesi Explorer but the node funds were not returned. What is going on?

When you issue retiring your node, you issue a transaction in the Ethereum Blockchain that revokes the right of the node to produce blocks representing your stake. As any Ethereum Blockchain transaction it may take a while for it to be processed, especially when the network is under heavy load and gas prices surge. Once the retire transaction is processed, the node will detect it when pooling the blockchain and will issue a transaction to return the funds it holds to the user wallet. When this happens, the node prints a couple of messages in the log stating it was retired and that it is returning the funds it holds. Don't stop or destroy your node before you double-check this transaction went through and the funds were returned to your wallet. In case you stopped your node before it issued the transaction to return your funds, please start it and wait for the transaction to be issued and correctly processed.



### When can I delete my node?

Your node holds a wallet that contains the funds you provided it with, so it is safe to delete your node once you made sure that there are no funds in the node wallet. Double-check or even triple-check before deleting your node as there is no way to move the funds from the node wallet once it is destroyed.



## Submit a new question

Ok, so I read all the F.A.Q. and found no solution to my problem/the proposed solution failed, what should I do?
We are sorry to hear that, please head to the [Cartesi Technical Community on Discord](https://discord.gg/Pt2NrnS) and we’ll be happy to assist you or submit your question on [StackOverflow](https://stackoverflow.com/questions/tagged/cartesi).
