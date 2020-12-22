const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CategoriaSchema = new Schema({
    description: {
        type: String,
        unique: true,
        required: [true, 'La descripcion en obligatoria'],
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario'
    }
});

module.exports = mongoose.model('Categoria', CategoriaSchema);