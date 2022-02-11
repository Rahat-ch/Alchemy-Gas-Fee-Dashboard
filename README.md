
# Gas Fee Dashboard

A small dashboard for displaying data on gas fees for the last 20 blocks on Ethereum in a line chart!

Follow the tutorial on how to build this:
https://mirror.xyz/rahat.eth/ebzIQN28ZhslvfEasLpTmeCWtih18MBeUTkr0KFBoUM

## How to run

Note: This script requires Node JS to be installed on your local machine.

You can find instructions to [download Node JS here](https://nodejs.org/en/download/)

Rename `.env.example` in the root folder to `.env`

Follow the [Getting started with Alchemy guide](https://docs.alchemy.com/alchemy/introduction/getting-started) to generate an Alchemy Key.

From your app Dashboard in Alchemy copy the http endpoint and use this as the value for `ALCHEMY_URL` in your `.env` file.

It should looke something like this: `https://eth-mainnet.alchemyapi.io/v2/<your-api-key>`

You can now install and run the script with the following commands:

```bash
yarn 
yarn dev
```

or
```bash

npm install
npm run dev
```

Upon succesful run you should navigate to :[localhost:3000/](http://localhost:3000/) to view the chart.


## Alchemy Web3 JS

Alchemy Web3 JS is a wrapper around web3js that makes it easier to integrate with Alchemy API's. Similar to the web3js api we have access to `web3.eth.getFeeHistory` which is the API method powering this script. This allows us to get fee information about X number of blocks in the Ethereum Mainnet.

## Why is this script important?

What we refer to as the London Hard Fork is a set of five Ethereum Improvement Proposals (EIP). One of these proposals is known as EIP-1559. This Proposal created a fee structure that is a combination of a base fee and a reward fee for miners. This brings in a fee burning mechanism that turned Ethereum into a deflationary asset. 

Since we now have two elements in the fee structure we need to calculate both the base fee as well as potential reward fees for miners in order to understand how much of a gas fee we will need to pay per transaction.

