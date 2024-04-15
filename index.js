const express = require('express')
const app = express()
const Asset = require('./models/assetModel');
const bodyParser = require('body-parser');
const {Block, BlockChain} = require('./blockchain/blockchain');
require('dotenv').config();
const sqlite3 = require('sqlite3').verbose();
const jwt = require('jsonwebtoken')
const validateUserSSN = require('./userValidator')
const getUserAssets = require('./getUserAssets')
const getAssetDatabyID = require('./getAssetDatabyID')
const cors = require('cors');
const port = 3000

// Parse JSON bodies
app.use(bodyParser.json());
app.use(cors());

// Create or open a database file
const db = new sqlite3.Database('mydatabase.db', (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to the database.');
    }
});

// Create a table
db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT,
    SSN TEXT,
    password TEXT
)`);

// Execute the SQL query
db.all("select * from users", [], (err, rows) => {
    if (err) {
        throw err;
    }
    // Log the retrieved rows to the console
    rows.forEach(row => {
        console.log(row);
    });
});

//initializing blockchain:
const chain = new BlockChain()

app.get('/createUser', (req, res) => {
    try{
        const access_key = req.body.access_key;
        if(access_key === process.env.ENCRYPTION_KEY){
            const username = req.body.username;
            const SSN = req.body.SSN;
            const password = req.body.password;

            if(username != null && SSN != null && password != null){
                db.run(`INSERT INTO users (username, SSN, password) values (?, ?, ?)`, [username, SSN, password], function(err){
                    if(err){
                        return res.status(500).send("Error: "+ err);
                    }
                    return res.status(200).send("user creation successfull");
                });
            }
            else{
                res.status(500).send("Please specify all details!");
            }
        }
        else{
            res.status(400).send("invalid access_key")
        }
    }
    catch(err){
        res.status(500).json("Error: " + err);
    }
})

//create an asset:
app.post('/asset', async(req, res) => {

    const access_token = req.body.access_token;
    try {
        jwt.verify(access_token, process.env.ENCRYPTION_KEY);
        //token is valid
        const new_asset_data = {
            asset_type : req.body.asset_type,
            asset_name : req.body.asset_name,
            asset_id : req.body.asset_id,
            asset_price : req.body.asset_price,
            asset_owner_ssn : req.body.owner_ssn
        }
        if(await validateUserSSN(db, req.body.owner_ssn) === true){
            chain.addNewBlock(new Block(new_asset_data));
            console.log(chain);
            return res.status(200).json("Asset Creation SuccessFull");
        }
        else{
            return res.status(403).json("specified SSN does not exists");
        }

      } catch (err) {
        if (err.name === 'TokenExpiredError') {
          return res.status(401).send("access Token Expired"); // Token is expired
        } else {
            return res.status(402).send("error: " + err);
        }
      }
})

app.post('/transferAsset', async (req, res) => {
    const access_token = req.body.access_token;
    try {
        jwt.verify(access_token, process.env.ENCRYPTION_KEY);
        //token is valid
        // const new_asset_data = {
        //     asset_type : req.body.asset_type,
        //     asset_id : req.body.asset_id,
        //     asset_buyer_ssn : req.body.buyer_ssn,
        // }
        if(await validateUserSSN(db, req.body.buyer_ssn) === true){

            const block_data = chain.getBlockData();
            const asset_data = getAssetDatabyID(block_data, req.body.asset_id)
            const new_asset_data = {
                asset_type : asset_data.asset_type,
                asset_name : asset_data.asset_name,
                asset_id : asset_data.asset_id,
                asset_price : asset_data.asset_price,
                asset_owner_ssn : req.body.buyer_ssn
            }
            chain.addNewBlock(new Block(new_asset_data));
            console.log("Updated Blockchain: ", chain);
            console.log("Updated Blockchain Data: ", chain.display());
            return res.status(200).json("Asset Transfer SuccessFull");
        }
        else{
            return res.status(403).json("specified SSN does not exists");
        }

      } catch (err) {
        if (err.name === 'TokenExpiredError') {
          return res.status(401).send("access Token Expired"); // Token is expired
        } else {
            return res.status(402).send("error: " + err);
        }
      }
})

//Login API:
app.post('/login', (req, res) => {
    const user_details = {
        username : req.body.username,
        password : req.body.password
    }

    try{
        db.get("SELECT * FROM users where username = ? and password = ?", [user_details.username, user_details.password], (err, row) => {
            if(err){
                return res.status(500).send("Internal Server Error: " + err);
            }
            else{
                if (!row) {
                    return res.status(401).json({ message: 'Invalid username or password' });
                }
                const token = jwt.sign(user_details, process.env.ENCRYPTION_KEY, { expiresIn: '30m' })
                const ssn = row.SSN;
                const block_data = chain.getBlockData();
                const user_assets = getUserAssets(block_data, ssn);
                res.status(200).json({access_key: token, user_assets: user_assets});
            }
        })
    }
    catch(err) {
        res.status(500).send("Internal Server Error: " + err);
    }
})

app.get('/test', (req, res) => {
    const asset = new Asset("real_estate", "trump_tower", "10000000");
    res.status(200).json({
        asset_type: asset.asset_type,
        asset_name: asset.asset_name,
        asset_price: asset.asset_price
    });
})

app.get('/blockchain', (req, res) => {
    res.status(200).send(chain.display());
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})