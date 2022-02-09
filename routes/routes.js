var express = require('express')
// const app = express()
// const cors = require('cors')
// app.use(cors())


var router = express.Router()
router.get("/getBalance", (req, res) => {
    res.send('500')
})

module.exports = router;
