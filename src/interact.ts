import {Mina, PrivateKey, PublicKey, fetchAccount} from 'o1js';

import { Add } from './Add.js';

const Network = Mina.Network('https://proxy.devnet.minaexplorer.com/graphql');

Mina.setActiveInstance(Network);

const appKey = PublicKey.fromBase58('B62qiwzVfbkCPjxW3PMedbJpcuvXSbZGYuRUrYpLYXQztiW9LMe5Gvg');

const zkApp = new Add(appKey);
await fetchAccount({publicKey: appKey});

console.log(zkApp.num.get().toString());

const accountPrivatekey = PrivateKey.fromBase58('EKEn4TLBKUrjWYzucYpziLN9dj87emYdLQbTAud43S8yTBuSYgCQ');

const accountPublickey = accountPrivatekey.toPublicKey();

//console.log(accountPublickey.toBase58());
console.log(('Compiling.....'));
await Add.compile();

const tx = await Mina.transaction(
    { sender: accountPublickey, fee: 0.1e9},
    async () => {
        zkApp.update();
    }
);

console.log(('proving.....'));
await tx.prove();
const sentTx = await tx.sign([accountPrivatekey]).send();


const txHash = sentTx.hash;
console.log(`Transaction hash: ${txHash}`); 
