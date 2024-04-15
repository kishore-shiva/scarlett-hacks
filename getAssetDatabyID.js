function getAssetDatabyID(blockchain, asset_id){
    for(let i = (blockchain.length)-1; i >=0; i--){
        if(blockchain[i].asset_id === asset_id){
            return blockchain[i];
        }
    }
}

module.exports = getAssetDatabyID;