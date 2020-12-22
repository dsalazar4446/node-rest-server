const express = require('express')
const { autentication } = require('../middlewares')
const fileUpload = require('express-fileupload')
const fs = require('fs');
const path = require('path');

const app = express();
// subida de archivos
app.use(fileUpload({ useTempFiles: true }));

const Usuario = require('../models/usuarios')
const Producto = require('../models/producto')


const getExtension = (file) => {
    return file.name.split('.')[1]
}


const validateType = (type, res) => {
    const tiposValidos = ['producto', 'usuario'];
    if (!tiposValidos.includes(type)) {
        return res.status(400).json({
            ok: false,
            err: {
                message: `No se reconoce el tipo \'${type}\', los tipos validos son ${tiposValidos.join(', ')}`
            }
        })
    }
}

const validateExtensions = (file, res) => {
    const extencionesValidas = ['jpg', 'jpeg', 'gif', 'png'];
    const extension = getExtension(file)
    if (!extencionesValidas.includes(extension)) {
        return res.status(400).json({
            ok: false,
            err: {
                meessage: 'Error al subir archivo, las extensiones permitidas son ' + extencionesValidas.join(', ')
            }
        })
    }
}


const existFile = (req, res) => {
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'No files were uploaded.'
            }
        });
    }
}

const unlinkFile = (nombreImagen, type) => {
        const pathImg = `${path.resolve(__dirname, `../../uploads/${type}/${nombreImagen}`)}`

            if (fs.existsSync(pathImg)) {
                fs.unlinkSync(pathImg);
            }
}

const imgProducto = async(id, nombreArchivo, type, res) => {
    try {
        const producto = await Producto.findById(id);
         if (!producto) {
                unlinkFile(nombreArchivo, type)
                return res.status(404).json({
                    ok: false,
                    err: {
                        message: 'Producto no existe'
                    }
                });
        }
            
        unlinkFile(producto.img, type)
        producto.img = nombreArchivo
        await producto.save()
        res.json({
            ok: true,
            image: nombreArchivo,
            producto
        });

    } catch (error) {
        unlinkFile(nombreArchivo, type)
        return res.status(500).json({
            ok: false,
            err
        });
    }
} 

const imgUsuario = async(id, nombreArchivo, type, res) => {
        try {
            const usuario = await Usuario.findById(id)
            if (!usuario) {
                unlinkFile(nombreArchivo, type)
                return res.status(404).json({
                    ok: false,
                    err: {
                        message: 'Usuario no existe'
                    }
                });
            }

        unlinkFile(nombreArchivo, type)
        usuario.img = nombreArchivo
        await usuario.save()
        res.json({
            ok: true,
            image: nombreArchivo,
            usuario: usuario
        });
    } catch (err) {
        unlinkFile(nombreArchivo, type)
        return res.status(500).json({
            ok: false,
            err
        });
    }
}


const saveFile = (id, file, type, res) => {
    const nombreArchivo = renameFile(id, file)
    console.log(type);
    console.log(`uploads/${type}/${nombreArchivo}`);
    file.mv(`uploads/${type}/${nombreArchivo}`, function(err) {
        if (err)
            return res.status(500).json({
                ok: false,
                err
            });

        if (type === 'usuario') {
            imgUsuario(id, nombreArchivo,type, res);
        } else {
            imgProducto(id,nombreArchivo,type, res);
        }
    });
}

const renameFile = (id, file) => {
    return `${id}-${ new Date().getMilliseconds()}.${getExtension(file)}`

}




app.put('/upload/:tipo/:id', async(req, res) => {
    const id = req.params.id;
    const tipo = req.params.tipo;
    const archivo = req.files.archivo;


    existFile(req, res)
    validateType(tipo, res);
    validateExtensions(archivo, res);
    saveFile(id, archivo, tipo, res)


});

module.exports = app;