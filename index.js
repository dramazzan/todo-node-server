const express = require('express')
const mongoose = require('mongoose')
const config = require('./config/db')
const caseRoutes = require('./routes/caseRoutes')
const userRoutes = require('./routes/userRoutes')
const bodyParser = require('body-parser')

const app = express()

const port = process.env.PORT || 3000

app.use(bodyParser.json());

mongoose.connect(config.dbUri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(()=>{
        console.log('MongoDB Connected successfully')
    }).catch(err=>{
        console.error('database connection error: ' + err)
})

app.get('/', (req, res) => {
    res.send('hello world')
})

app.use('/cases' , caseRoutes)
app.use('/users' , userRoutes)


app.listen(port, () => {
    console.log('server started on port: http://localhost:' + port)
})

