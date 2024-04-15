function getUserAssets(blockchain, user_ssn) {
    //console.log("SSN: "+ user_ssn);
    let user_assets = [];
    let asset_name = [];
    for(let i = (blockchain.length)-1; i >=0; i--){
        if(!asset_name.includes(blockchain[i].asset_name)){
            if(blockchain[i].asset_owner_ssn === user_ssn){
                //console.log(blockchain[i]);
                user_assets.push({
                    asset_name: blockchain[i].asset_name,
                    asset_id: blockchain[i].asset_id
                });
            }
            asset_name.push(blockchain[i].asset_name);
        }
    }
    return user_assets;
}

module.exports = getUserAssets;