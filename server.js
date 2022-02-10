const express = require('express')
const app = express()
const mysql = require('mysql')
const cors = require('cors')
require('dotenv').config()

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
app.use('/xlm', router)






app.listen(4000, ()=> console.log('Listenning @ port 4000'))