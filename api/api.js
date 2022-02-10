const express = require('express')
const util = require('util')
const {TimeoutInfinite} = require('stellar-base')
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

// {{{{{{{{{{{{{{CREATING A STELLAR ACCOUNT}}}}}}}}}}}}}}
router.get('create', (req, res) =>{
    
        const pair = StellarSdk.Keypair.random();

        ls.set('secret', pair.secret())
        // SA2R7UYLCWNGT6DPGQBWFMHXBHJ6SIN3ZW4VDAIX26277RRFSJSSWU3L
        ls.set('public', pair.publicKey())
        res.write(ls.get('public'))
        res.write(ls.get('secret'))
        res.end();
            // GA25EMGD6SQSBUFDLFEVMNBPZ4QZPV3KYZYIFHDYHTKMF3I4SNHFPMQ3
        
})

// {{{{{{{{{{{{{{GET THE LUMEN BALANCE OF AN ADDRESS}}}}}}}}}}}}}}
router.get('/bal', async (req, res) =>{
   
    let  account_ = await server.loadAccount(process.env.xlm_receiver )
    .catch(function(err){
        console.log(err)
    })
    if(account_){
        console.log('working')
    }
    
    console.log(`Balances for account: ${process.env.xlm_receiver} ` );

    res.send(account_.balances[0].balance)
   // console.log(account_.account_id)
    console.log(account_.balances)
   

})


router.get('/call-fund', (req, res) =>{
//   with XLM it is important to  add funds to an address before using it.
//   at least 10XLM,
//   This helps you avoid unneccessary errors

            axios.get('/friendbot', {
                params: {
                  addr: process.env.xlm_receiver
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
// {{{{{{{{{{{{{Send transaction using MEMO (method 1)}}}}}}}}}}}}}
router.get('/tran', (req, res) =>{
    var StellarSdk = require("stellar-sdk");
var server = new StellarSdk.Server("https://horizon-testnet.stellar.org");
var sourceKeys = StellarSdk.Keypair.fromSecret(
    process.env.xlm_sender_secret,
);
var destinationId = process.env.xlm_receiver;
// Transaction will hold a built transaction we can resubmit if the result is unknown.
var transaction;

// First, check to make sure that the destination account exists.
// You could skip this, but if the account does not exist, you will be charged
// the transaction fee when the transaction fails.
server
  .loadAccount(destinationId)
  // If the account is not found, surface a nicer error message for logging.
  .catch(function (error) {
    if (error instanceof StellarSdk.NotFoundError) {
      throw new Error("The destination account does not exist!");
    } else return error;
  })
  // If there was no error, load up-to-date information on your account.
  .then(function () {
    return server.loadAccount(sourceKeys.publicKey());
  })
  .then(function (sourceAccount) {
    // Start building the transaction.
    transaction = new StellarSdk.TransactionBuilder(sourceAccount, {
      fee: StellarSdk.BASE_FEE,
      networkPassphrase: StellarSdk.Networks.TESTNET,
    })
      .addOperation(
        StellarSdk.Operation.payment({
          destination: destinationId,
          // Because Stellar allows transaction in many currencies, you must
          // specify the asset type. The special "native" asset represents Lumens.
          asset: StellarSdk.Asset.native(),
          amount: "10",
        }),
      )
      // A memo allows you to add your own metadata to a transaction. It's
      // optional and does not affect how Stellar treats the transaction.
      .addMemo(StellarSdk.Memo.text("Test Transaction"))
      // Wait a maximum of three minutes for the transaction
      .setTimeout(180)
      .build();
    // Sign the transaction to prove you are actually the person sending it.
    transaction.sign(sourceKeys);
    // And finally, send it off to Stellar!
    return server.submitTransaction(transaction);
  })
  .then(function (result) {
    console.log("Success! Results:", result.hash);
    console.log("Success! Results:", result);
    console.log("Success! Results:", result.ledger);
    res.send(result)
    // res.write(result.hash)
    // res.write(result.ledger)
    // res.write(result.successful)
    // res.end()
  })
  .catch(function (error) {
    console.error("Something went wrong!", error);
    // If the result is unknown (no response body, timeout etc.) we simply resubmit
    // already built transaction:
    // server.submitTransaction(transaction);
  });
})

// {{{{{{{{{{{{send and sign a transaction to the xlm ledger (mehod 1)}}}}}}}}}}}}
router.get('/transact', (req, res) =>{
    const runTransaction = async (sendpub, sendsec, recpub) =>{
        const standardFee = await server.fetchBaseFee()

        const txOptions = {
            fee: standardFee,
            networkPassphrase: StellarSdk.Networks.TESTNET
        }

        const payReceiver = {
            destination : recpub,
            asset: StellarSdk.Asset.native(),
            amount: "10"
        }

        const senderAccount = await server.loadAccount(sendpub)

       const Transaction = new StellarSdk.TransactionBuilder(senderAccount, txOptions)
       .addOperation(StellarSdk.Operation.payment(payReceiver))
       .setTimeout(TimeoutInfinite)
       .build()

       Transaction.sign(sendsec)

       await server.submitTransaction(Transaction)
    }

    runTransaction(process.env.xlm_sender, StellarSdk.Keypair.fromSecret(process.env.xlm_sender_secret), process.env.xlm_receiver)
    .then(()=> console.log("ok")

    )
    .catch(e => {
        throw e;
    })
})

module.exports = router;
