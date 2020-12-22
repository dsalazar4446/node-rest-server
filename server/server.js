require('./config/config')
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser')
const path = require('path')


const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json());

// configuracion global de rutas
app.use(require('./routes'))

// habilitar carpeta public

app.use(express.static(path.resolve(__dirname, '../public')));






mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
}).then(resp => {
    console.log('DB correctamente iniciada');
}).catch(err => {
    throw new Error(err)
});

app.listen(process.env.PORT, () => {
    console.log(`app is running in port ${process.env.PORT}`);
})