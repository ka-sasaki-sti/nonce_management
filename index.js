const { Web3 } = require('web3');
const { createClient } = require('redis');
const fs = require('fs');



const { abi } = JSON.parse(fs.readFileSync('Demo.json'));

async function main() {
    // Redisクライアントの初期化
    const redisClient = createClient();
    await redisClient.connect();

    const network = process.env.ETHEREUM_NETWORK;
    const web3 = new Web3(`https://${network}.infura.io/v3/${process.env.INFURA_API_KEY}`);

    const signer = web3.eth.accounts.privateKeyToAccount('0x' + process.env.SIGNER_PRIVATE_KEY);
    web3.eth.accounts.wallet.add(signer);

    const contract = new web3.eth.Contract(abi, process.env.DEMO_CONTRACT);

    const toAddress = '0xE495FA02b77B7feE35A04686048D08476517318E';
    const tokenId = process.argv[2];
    if (!tokenId) {
        console.error('Please provide a tokenId as an argument');
        process.exit(1);
    }

    const method_abi = contract.methods.safeMint(toAddress, tokenId).encodeABI();

    // nonceの取得とインクリメント
    const nonceKey = `nonce:${signer.address}`;
    const currentNonce = Number(await redisClient.get(nonceKey)) || Number(await web3.eth.getTransactionCount(signer.address, 'pending'));
    await redisClient.set(nonceKey, currentNonce + 1);

    const tx = {
        from: signer.address,
        to: contract.options.address,
        data: method_abi,
        gasPrice: '100000000000',
        nonce: currentNonce
    };

    const gas_estimate = await web3.eth.estimateGas(tx);
    tx.gas = gas_estimate;

    const signedTx = await web3.eth.accounts.signTransaction(tx, signer.privateKey);
    console.log('Raw transaction data: ' + signedTx.rawTransaction);

    const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction)
        .once('transactionHash', (txhash) => {
            console.log('Mining transaction ...');
            console.log(`https://${network}.etherscan.io/tx/${txhash}`);
        });

    console.log(`Mined in block ${receipt.blockNumber}`);

    await redisClient.quit();
}

require('dotenv').config();
main();
