require("dotenv").config();

const express = require('express')
const mongoose = require('mongoose')
const caseRoutes = require('./routes/caseRoutes')
const userRoutes = require('./routes/userRoutes')
const adminRoutes = require('./routes/adminRoutes')
const bodyParser = require('body-parser')
const cors = require('cors')
const session = require('express-session')
const passport = require('passport')

const app = express()

const port = process.env.PORT || 3000

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV,
        sameSite: 'strict',
    }
}))
app.use(passport.initialize());
app.use(passport.session())

require('./config/passport')(passport);



app.use(cors())
app.use(bodyParser.json());

mongoose.connect(process.env.DATABASE_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB Connected successfully'))
    .catch(err => {
        console.error('Database connection error:', err);
        process.exit(1);
    });

process.on('SIGINT', async () => {
    await mongoose.connection.close();
    console.log('MongoDB Connection Closed');
    process.exit(0);
});


app.get('/', (req, res) => {
    res.send('hello world')
})

app.use('/cases', caseRoutes)
app.use('/users', userRoutes)
app.use('/admin', adminRoutes)


app.listen(port, () => {
    console.log('server started on port: http://localhost:' + port)
})

process.on('uncaughtException', (err) => {
    console.error('Uncaught exception: ', err);
    process.exit(1);
});
