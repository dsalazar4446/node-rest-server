require('./config/config')
const express = require('express');
const bodyParser = require('body-parser')

const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.json('Hola Daniel');
})

app.listen(process.env.PORT, () => {
    console.log(`app is running in port ${process.env.PORT}`);
})