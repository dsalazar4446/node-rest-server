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

process.env.MONGO_URL = process.env.NODE_ENV === 'dev' ? 'mongodb://localhost:27017/cafe' : process.env.MONGO_URL;

/********************************
 * Vencimiento del token
 ********************************
 * 60 seg
 * 60 min
 * 24 hrs
 * 30 days
 */

process.env.CADUCIDAD_TOKEN = '48h'


/********************************
 * MONGO
 ********************************/

process.env.SEED = process.env.SEED || 'este-es-el-seed-dev'


/********************************
 *  Google client id
 ********************************/

process.env.CLIENT_ID = process.env.CLIENT_ID || '652416305586-tl7kd06id20pe4n76gq2iqqjrurojetn.apps.googleusercontent.com';