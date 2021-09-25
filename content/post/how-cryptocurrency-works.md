---
title: "How Cryptocurrency works"
description: ""
tags: [
    "bitcoin",
    "distributed",
    "crypto"
]
date: "2019-03-26"
summary: "Cryptocurrency is a distributed list of transactions. This list of transactions function as a digital/virtual currency."
---

Cryptocurrency is a distributed list of transactions. This list of transactions function as a digital/virtual currency.

## Concept

To understand how a list of transactions can function as a currency, let’s take an example of a poker game. Instead of playing with poker chips, the players maintain a list of all transactions being made. This list of transactions is also called as a “Ledger”.



The sample ledger above starts with stating how much credit each player initially owns. Before adding a new transaction to the list we can verify if the player has the required credits by going through the ledger.

Instead of resolving the ledger by paying each other in cash, the players can decide to continue the ledger after the game. When ever they need to pay each other, they can just transfer credits on this ledger. For example, John agrees to sell a water bottle to Bob for 20 credits, and this will be recorded on the ledger. So here we can say that the ledger credits have been used as a currency. 

## Blockchain

The list of transactions that make up the cryptocurrency are stored in a blockchain.

In a blockchain the list of transactions are saved in blocks. Each block contains a list of valid transactions. These blocks are linked to each other by cryptographic hashes.

A Cryptographic hash, simply referred to as a hash, is a random looking string of fixed length computed from given data. The hash is like a fingerprint for the data, and will completely change with even a little change to the data. Eg SHA256.



The cryptographic hash of all the transactions in a block, say B1,is added at the bottom of itself. The next block, say B2, will contain the hash of the previous block B1 at the top. The hash of B2 is computed by using all the transactions in B2 and the hash of B1.
This way all the blocks are chained and form a coherent ledger.



Blockchain is a decentralized system, i.e. there is no central authority. All the peers maintain a copy of the ledger, and hence blockchain is a type of a “Distributed ledger”.


Users can get cryptocurrency by either mining or buying from other users. Whenever a user wants to add a transaction to this distributed ledger, they will broadcast it to the network. A few peers of the network collate transactions into ‘blocks’ and broadcast the block. These peers which collate the transactions into blocks are called miners. When a new block is broadcast to the network, all the peers add it to their respective private copy of the blockchain.

But the above system has a lot of issues and flaws, such as validity of transactions and blocks, incentive for miners to build blocks, fake transactions etc. Below we’ll take a look at how Bitcoin (BTC), the first and the most popular cryptocurrency solves these issues.

## Bitcoin

### Signatures
To make sure that a transaction is being added by the correct user, the transaction is digitally signed. This process involves a Public key and a Private key. The private key is supposed to be kept secret. To sign a transaction, the message and private are passed through a signing function which produces a unique signature.



The message contains the details of transfer i.e. “Bob transfers 10 to Alice”. The signature will change if the transaction details change. So another person, cannot add a fake transaction like “Bob transfers 10 to John” using the previous transaction’s sign.



The message also contains row number. This ensures that Alice can’t duplicate transactions of the original.



The signature can be verified by passing the message, sign and public key to a verify function. The output of this function will be true or false.


### Proof of work
Another problem that arises is figuring out if a block is valid or not. As users could try to add invalid transactions, miners could also try to add invalid blocks. Bitcoin chooses to consider blocks with proof of work as valid.

To validate a block miners have to find a special number called ‘nonce’. This nonce along with all the data in the block is supposed to create a hash that starts with a given number of zeros, let’s say 30 zeros. The probability that a hash starts with 30 zeros is 1/(2^30). The only way to find the nonce is to guess through 2^30 numbers. Verifying the nonce is easy we just have to pass the messages of the block and nonce to the hash function and count the number of zeros in the resultant hash.



A valid block contains a valid nonce, and is said to be signed. We trust it to be valid because the only way a miner can find the nonce is by guessing through a large set of numbers, hence a valid nonce can be taken as proof of work.

The number of zeros in hash is not fixed. As more miners join the pool, chances of finding the number quickly increases. So Bitcoin can choose to increase the number of zero, which increases the difficulty. The difficulty is maintained in such a way that the average time to add a new block is 10 mins. 

### Longest Chain
Sometimes a peer can receive two valid blocks at the same time. In such a case a peer will wait for more blocks to receive, and will trust the chain with more blocks. The longer which has more blocks has more work put into it, hence it is considered as trustworthy.

### Mining
Validating a block is computationally intensive. To incentivise mining new blocks, the first miner who mines the block gets to add a special transaction at the top of the block which “creates” bitcoins which are rewarded to the miner. This is called as a Coinbase transaction and are these transactions are not signed. All Bitcoins in existence have been created by these coinbase transactions.



Currently on 26th March 2018 the reward for mining a block is 12.5 BTC. This value halves every 210,000 blocks or roughly 4 years. This means that the maximum bitcoins in the network can only reach 21 million bitcoins and the reward will reach 0 by ~2140.

Users can also add an optional “transaction fee” to the transaction which will be transferred to the miner. So even when the reward reaches 0, miners will still have an incentive to mine new blocks.

## Other Cryptocurrencies

There are over 1000 cryptocurrencies. Some are exact clones such as Bitcoin Cash which is a hard fork of Bitcoin. Some are variations such as Litecoin which adds a new block every 2.5 minutes instead of 10 mins like Bitcoin.

Ether (ETH) is currently the second most popular cryptocurrency and its network is called Ethereum. Ethereum can run “smart contracts”, which are pieces of logic, by using ether as fuel. This allows developers to build apps on ethereum such as “Cryptokitties”.

The third most popular crypto is Ripple (XRP). Ripple cannot be mined. 100 billion XRP have been released and every transaction destroys a bit of the XRP and this increases the value and reduces spam transactions which try to overload the network.

## Advantages
- Direct transfer from person to person without an intermediary
- Lower transaction fee compared to banks / currency exchanges
- Account cannot be frozen
- No prerequisites or arbitrary limits

## Disadvantages
- No legal backing
- Can be “lost” if private key is lost
- Not widely accepted
- Slow in case of bitcoin

## References
- https://www.youtube.com/watch?v=bBC-nXj3Ng4
- https://www.youtube.com/watch?v=_160oMzblY8
- https://bitcoin.org/bitcoin.pdf
- https://www.youtube.com/watch?v=dQw4w9WgXcQ
- https://www.youtube.com/watch?v=Gc2en3nHxA4
