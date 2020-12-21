/********************************
 * ENTORNO
 ********************************/

const { mongo } = require('mongoose');

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

/********************************
 * PUERTO
 ********************************/

process.env.PORT = process.env.PORT || 3000;

/********************************
 * MONGO
 ********************************/
const mongodb = {
    url: process.env.NODE_ENV === 'dev' ? 'mongodb://localhost:27017/cafe' : 'mongodb+srv://dsalazar446:CSR2rxBV8IyBAlZ3@cluster0.dkkto.mongodb.net/cafe'
}

process.env.MONGO_URL_DB = mongodb.url;