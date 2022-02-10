const express = require('express')
const util = require('util')
const axios = require('axios').default
const ls = require('local-storage');
const app = express()
const cors = require('cors')
app.use(cors())

//WEB3.0 ASSETS
var Tx = require("ethereumjs-tx").Transaction
const Web3 = require('web3')
//var web3 = new Web3('https://horizon-testnet.stellar.org/')
var StellarSdk = require("stellar-sdk");
 var server = new StellarSdk.Server('https://horizon-testnet.stellar.org/');
// var server = new StellarSdk.Server("https://horizon.stellar.org");
 



const router = express.Router()

router.get("/ledger", (req, res) => {
server
  .ledgers()
  .ledger("69858")
  .call()
  .then(function (resp) {
    console.log(resp);
  })
  .catch(function (err) {
    console.error(err);
  });
})

router.get("/call-account", (req, res) => {
    
    server
      .loadAccount("GAYOLLLUIZE4DZMBB2ZBKGBUBZLIOYU6XFLW37GBP2VZD3ABNXCW4BVA")
      .then(function (resp) {
        console.log(resp);
      })
      .catch(function (err) {
        console.error(err);
      });
})

// GET THE ETHER BALANCE OF AN ADDRESS
router.get('/add', (req, res) =>{
    
        const pair = StellarSdk.Keypair.random();

        ls.set('secret', pair.secret())
        // SA2R7UYLCWNGT6DPGQBWFMHXBHJ6SIN3ZW4VDAIX26277RRFSJSSWU3L
        ls.set('public', pair.publicKey())
        res.write(ls.get('public'))
        res.write(ls.get('secret'))
        res.end();
            // GA25EMGD6SQSBUFDLFEVMNBPZ4QZPV3KYZYIFHDYHTKMF3I4SNHFPMQ3
        
})
//GDTEFAG22MJTRFWTTS2X3742CTVRAODQ4TLTW5UJYAQTYI2Y2TN2LXDL new
// GET THE ETHER BALANCE OF AN ADDRESS
router.get('/bal', async (req, res) =>{
   
    let  account_ = await server.loadAccount(process.env.xlm_sender )
    .catch(function(err){
        console.log(err)
    })
    if(account_){
        console.log('working')
    }
    
    console.log(`Balances for account: ${process.env.xlm_sender} ` );

    res.send(account_.balances[0].balance)
   // console.log(account_.account_id)
    console.log(account_.balances)
   

})

// CALL SMART CONTRACT YUSDT METHOD 1
router.get('/call-fund', (req, res) =>{
  
        //   const response = await fetch(
        //     `https://friendbot.stellar.org?addr=${encodeURIComponent(
        //       'GA25EMGD6SQSBUFDLFEVMNBPZ4QZPV3KYZYIFHDYHTKMF3I4SNHFPMQ3',
        //     )}`,
        //   );
        //   const responseJSON = await response.json();
        //   console.log("SUCCESS! You have a new account :)\n", responseJSON);


            axios.get('/friendbot', {
                params: {
                  addr: "GDTEFAG22MJTRFWTTS2X3742CTVRAODQ4TLTW5UJYAQTYI2Y2TN2LXDL"
                },
                baseURL: "https://horizon-testnet.stellar.org/"
              })
            .then(function (response) {
                // handle success
                console.log(response);
                res.send(response)
            })
            .catch(function (error) {
                // handle error
                res.send(error);
               
            })
            .then(function () {
                // always executed
            });

                
     
})



module.exports = router;
