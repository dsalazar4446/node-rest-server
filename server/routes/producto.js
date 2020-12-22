const express = require('express')
const { autentication } = require('../middlewares')

const app = express()

const Producto = require('../models/producto')

app.post('/producto', autentication.verificaToken, async(req, res) => {
    try {
        const body = req.body;
        const newProducto = new Producto({...body, usuario: req.usuario._id })
        const producto = await newProducto.save();
        res.json({
            ok: true,
            producto
        })

    } catch (err) {
        res.status(400).json({
            ok: true,
            err
        })
    }

});
app.get('/producto/buscar/:termino', autentication.verificaToken, async(req, res) => {
    try {
        const termino = req.params.termino;
        let regex = new RegExp(termino, 'i')
        const producto = await Producto.find({ nombre: regex })
            .populate('usuario')
            .populate('categoria')

        res.json({
            ok: true,
            producto
        })
    } catch (err) {
        res.status(400).json({
            ok: true,
            err
        })
    }
})


app.get('/producto', autentication.verificaToken, async(req, res) => {
    // trae todos los productos
    // populate usuario y categoria
    // paginado
    try {

        const perPage = Number(req.query.perPage || 5);
        const page = Number(req.query.page - 1 || 0)


        const productos = await Producto.find({})
            .populate('usuario')
            .populate('categoria')
            .skip(perPage * page)
            .limit(perPage)
            .sort({
                nombre: 'asc',
            });

        res.json({
            ok: true,
            productos
        })

    } catch (err) {
        res.status(400).json({
            ok: true,
            err
        })
    }
});

app.get('/producto/:id', autentication.verificaToken, async(req, res) => {
    // populate usuario y categoria
    try {
        const id = req.params.id
        const productos = await Producto.findById(id)
            .populate('usuario')
            .populate('categoria')

        res.json({
            ok: true,
            productos
        })

    } catch (err) {
        res.status(400).json({
            ok: true,
            err
        })
    }
});

app.put('/producto/:id', autentication.verificaToken, async(req, res) => {
    try {
        const id = req.params.id;
        const body = req.body
        const user = req.usuario

        const productos = await Producto.findByIdAndUpdate(id, {...body, usuario: user._id }, { new: true, runValidators: true })
            .populate('usuario')
            .populate('categoria')

        res.json({
            ok: true,
            productos
        })

    } catch (err) {
        res.status(400).json({
            ok: true,
            err
        })
    }
});
app.delete('/producto/:id', autentication.verificaToken, async(req, res) => {
    // cambiar disponible a falso

    try {
        const id = req.params.id;
        const user = req.usuario

        const producto = await Producto.findById(id, { new: true, runValidators: true })
            .populate('usuario')
            .populate('categoria')

        producto.disponible = false
        res.json({
            ok: true,
            producto: await producto.save()
        })

    } catch (err) {
        res.status(400).json({
            ok: true,
            err
        })
    }

});

module.exports = app;