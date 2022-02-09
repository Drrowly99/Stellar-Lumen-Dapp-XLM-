const express = require('express')
const app = express()
const mysql = require('mysql')
const cors = require('cors')
require('dotenv').config()


var Tx = require("ethereumjs-tx").Transaction
const Web3 = require('web3')
const web3 = new Web3('https://ropsten.infura.io/v3/95e87c832aa74df59c0afb40ad4c95f1')


app.use(express.static("public"))
app.use(cors())

// app.use(express.urlencoded({
// 	extended: true
// }))

// app.use(function(req, res, next){
// 	res.setHeader("Content-Type", "application/json")
// 	res.setHeader("Content-Type", "text/html")
// 	next()
// })

app.use(express.json())

app.set('view engine', 'ejs')

var router = require('./api/api.js')
app.use('/usdt', router)


app.get('/usdt/balance', (req, res) =>{
    res.send("list of users")
})
app.get('/usdt/receive', (req, res) =>{
    res.send("welcome to the receive wallet page")
})
app.post('/usdt/transfer', (req, res) =>{
    res.send("welcome to the transfer page")
})
app.get('/usdt/watch', (req, res) =>{
    res.send("welcome to the watch page")
})








app.listen(4000, ()=> console.log('Listenning @ port 4000'))