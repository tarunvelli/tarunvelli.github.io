---
title: "Understanding BitTorrent Protocol"
description: ""
tags: [
    "bittorrent",
    "distributed"
]
date: "2019-02-26"
summary: "Simply put, the BitTorrent protocol is a P2P file sharing protocol."
---

Simply put, the BitTorrent protocol is a P2P file sharing protocol.

First, let's look into what peer-to-peer networks are before understanding how BitTorrent operates. 

## Brief intro to P2P networks

P2P stands for peer to peer. The definition of P2P is ‘A communications model in which each party has the same capabilities and either party can initiate a communication session’.

Unlike classic server/client model, where the client always initiates the communication by sending a request and the server can only send a response, in a P2P model all the participants are called ‘peers’ and have the same capabilities.

P2P networks can be broadly divided into two categories:-

- A pure P2P network is a P2P network where “any single, arbitrary chosen peer can be removed from the network without having the network suffering any loss of network service”. That is, all nodes are absolutely equal and there is no single point dependency.

- A Hybrid P2P network is a P2P network where “a central entity is necessary to provide parts of the offered network services”.

BitTorrent’s original form matches Hybrid P2P concept.

## BitTorrent Architecture

BitTorrent distributes a file by partitioning it into ‘pieces’ and distributing the pieces amongst its peers.

The architecture normally consists of the following entities:

- a ‘tracker’
- a static metainfo file (a torrent file)
- an original downloader (seed)
- the end user downloader (leecher)

### Tracker

A BitTorrent tracker is server software that centrally coordinates the transfer of files among users, the tracker does not contain a copy of the file and only helps peers discover each other

The tracker and the client exchange information using a simple protocol on top of HTTP. The clients inform the tracker regarding the file they want to download, their IP and port and the tracker respond with a list of peers downloading the same file and their contact information. This list of peers that all share the same torrent represents a ‘swarm’. The tracker is necessary for peers to find each other and transfer data, because of the presence of this central entity, BitTorrent protocol is considered as a Hybrid P2P implementation.

For example, a well known tracker for linux iso images is https://linuxtracker.org/

### Metainfo file

The metainfo file is also called as a torrent file and has a .torrent extension.

This file mainly contains encoded information regarding the url of the tracker, name of the file, and hashes of the pieces of the file for verifying downloaded pieces of the file.

These torrent files are generally created using a client software. A list of trackers and the original file are required to create this torrent file. Once the file is created it can be shared using the regular methods such as email, file sharing websites etc.

So to distribute a new version of linux, the developers would input the tracker url and the new linux iso image they created into the bittorrent client and get a .torrent file. This file is generally shared on their website.

### Seeders

The original downloader is a peer with the whole file. Also known as seeder. The seeder must keep uploading the file until a complete copy has been distributed among the downloaders. As long as there is a complete copy collectively present among the peers the download will continue for all.

The developers providing the linux iso image who have the full file will be called as seeders.

### Leechers
The peers without a complete copy of the file are known as leechers. Leechers will get the list of peers from the tracker which have the pieces that the leecher requires. The leecher then downloads the required piece from one of those peers. A leecher can also distribute the pieces that it has completed downloading even before it completes downloading the whole file. Once a Leecher has all the pieces it is called as seeder. As a leecher receives the ‘pieces’ it validates them against the hashes present in the meta info file.

Any user downloading the file through BitTorrent will be called as a leecher, once they have a full file they can be called as seeders. 

BitTorrent uses piece selection algorithm to decide which piece to download with the goal of achieving maximum piece replication.

## Piece selection algorithm

Piece selection is important to ensure that the swarm has all the required parts of the file. In case a certain piece of the file is missing from the swarm then the download will fail for all the peers in the swarm which is not desirable. To ensure that this does not happen, the piece selection algorithm is implemented which tries to ensure piece availability by replicating the pieces as quickly as possible.

### Random first piece
An exception to the rarest first is the absolute first piece which is downloaded. As the rarest piece is least available and might be slower to download, the first piece to be downloaded is chosen at random. This way the peer can quickly receive a piece and start uploading.


### Rarest first
As the name clearly states, when deciding which piece has to be downloaded next, the rarest piece present in the swarm is selected. Some deployments remove the original seed due to reasons such as cost etc. When peers always choose the rarest available piece, all the pieces of the file will be quickly replicated and can avoid ‘losing’ a piece.


### Strict Policy
As mentioned earlier, a file is partitioned into ‘pieces’ before downloading. These pieces are again subdivided into ‘sub-pieces’. When a sub-piece is requested, the remaining sub-pieces of the same piece are requested before any other piece. With this pieces can be assembled quickly, and will be available for other peers.


### Endgame mode
When the pieces are requested from peers, it could happen that a peer with low upload speed is selected. This can be amplified during the end of the download as the download reaches completion due to the tendency for the remaining pieces to be downloaded from peers with saturated connections. This is avoided by sending a request to all peers for the piece instead of waiting for a single peer. The overhead for this is negligible as the endgame mode is relatively short, but cannot be used for all pieces as that would cause considerable overhead.


These policies ensure piece availability but do ensure an individual client’s download efficiency.

## Choking

A tit-for-tat mechanism is used for achieving consistent download rates. This means that a peer will cooperate on the first move and for every succeeding move it will repeat what its peer has done. This tit-for-tat mechanism is implemented by a method called ‘choking’.

Choking is the process of refusing upload to a peer, while allowing download from it.
At any given point of time a peer will have unchoked 4 of its peers. That is it allows uploading to four peers at once. These four unchokes are selected based on the download rate received from them. These download rates are calculated based on rolling 20 second average and are recalculated every 10 seconds by the client.

To decide which peers to choke/unchoke is decided by the following methods.

### Optimistic Unchoking
Apart from the 4 unchoked peers, an additional unchoke is allowed which does not depend on the download rate. These are called optimistic unchokes and are selected randomly every 30 seconds.

This is done to find unused connections which can be better than the current unchokes.
Unused connections can be caused die to various reasons, such as when a new peer has joined the swarm so it still hasn’t uploaded any pieces. 

### Anti-snubbing
Sometimes a peer gets choked by all of its peers. If a peer has not received anything in the last 60 seconds it presumes it has been ‘snubbed’. As per tit-for-tat, it will choke the peers from which it isn’t receiving anything, except as a an optimistic unchoke. Following this, as an exception to the rule, the peer will generally open more than one optimistic unchoke. This allows the peer to find better connections quicker than just relying on being optimistically unchoked.

### Upload only
Once a peer has downloaded the whole file it has no download rates to use the previous methods of choking. So the unchoke is based on the upload rate of the peers, preferring peers to whom no one is uploading to.

## Advantages and uses
- Distributing large files like Linux iso images.
- Distributing Software patches and updates.
- As being done by Blizzard Entertainment Inc, to distribute updates for the world of Warcraft
- Distributing popular files which have high traffic for relatively short periods
- Unlike traditional server/client downloads, high traffic leads to more efficient file sharing via BitTorrent.

## Disadvantages and Security issues
- An easy distribution method for pirated/illegal content
- Cannot modify/update the file to newer versions once the torrent has been distributed
- The IP of all peers and info of files they are downloading are publicly available on trackers
- The tracker is a critical component and if it fails it can disrupt the distribution of all the files it has tracking.

## References
- http://www.bittorrent.org/beps/bep_0003.html
- http://web.cs.ucla.edu/classes/cs217/05BitTorrent.pdf
- https://www.morehawes.co.uk/the-bittorrent-protocol
- http://www.camrdale.org/Resume/pieces.pdf
