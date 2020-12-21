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
    url: process.env.NODE_ENV === 'dev' ? 'mongodb://localhost:27017/cafe' : process.env.NODE_ENV
}

process.env.MONGO_URL = mongodb.url;

/********************************
 * Vencimiento del token
 ********************************
 * 60 seg
 * 60 min
 * 24 hrs
 * 30 days
 */

process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30


/********************************
 * MONGO
 ********************************/

process.env.SEED = process.env.SEED || 'este-es-el-seed-dev'