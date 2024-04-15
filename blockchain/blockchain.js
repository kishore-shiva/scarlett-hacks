const crypto = require('crypto');

class Block {
    constructor(data, prevHash = "") {
        this.timestamp = Date.now();
        this.date = new Date();
        this.data = data;
        this.prevHash = prevHash;
        this.hash = this.computeHash();
    }
    computeHash() {
        let strBlock = this.prevHash + this.timestamp +JSON.stringify(this.data) + this.date;
        return crypto.createHash("sha256").update(strBlock).digest("hex");
    }

}

class BlockChain {
    constructor() {
        this.blockchain = [this.startGenesisBlock()]
    }
    startGenesisBlock() {
        return new Block({})
    }
    obtainLatestBlock() {
        return this.blockchain[this.blockchain.length - 1]
    }
    addNewBlock(newBlock) { // Add a new block
        newBlock.prevHash = this.obtainLatestBlock().hash; 
        newBlock.hash = newBlock.computeHash() ;
        this.blockchain.push(newBlock);
    }
    checkChainValidity() { 
        for(let i = 1; i < this.blockchain.length; i++) { 
            const currBlock = this.blockchain[i]
            const prevBlock = this.blockchain[i -1]
            if(currBlock.hash !== currBlock.computeHash()) { 
                return false
            }
            if(currBlock.prevHash !== prevBlock.hash) {                
              return false
            }
            
        }
        return true;
    }

    display(){
        for(let i = 0; i < this.blockchain.length; i++){
            console.log(this.blockchain[i].data);
        }
    }

    detect51PercentAttack(){
        let count = 0;
        for(let i = 0; i < this.blockchain.length; i++){
            if(this.blockchain[i].data.amount > 1){
                count++;
            }
        }
        if(count > this.blockchain.length * 0.5){
            return true;
        }
        else{
            return false;
        }
    }
    }

// let a = new Block({name: "kishore1", count:"700"});
// let b = new Block({name: "user2", count:"700"});
// let c = new Block({name: "user3", count:"700"});
 
// let chain = new BlockChain() // Init our chain
// chain.addNewBlock(a); 
// chain.addNewBlock(b);
// chain.addNewBlock(c);
// console.log(chain);

// chain.display();
//console.log("Validity: " + chain.checkChainValidity())

module.exports = { Block, BlockChain };