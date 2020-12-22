const express = require('express');
const { autentication } = require('../middlewares');

const app = express();

module.exports = app

const Categoria = require('../models/categoria')


app.post('/categoria', autentication.verificaToken, async(req, res) => {
    let body = req.body;
    const categoria = new Categoria({...body, usuario: req.usuario._id });
    categoria.save((err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            categoria: categoriaDB
        });

    });

});

app.get('/categoria', async(req, res) => {

    try {
        const categorias = await Categoria.find()
            .sort('description')
            .populate('usuario', 'nombre email').exec();
        res.json({
            ok: true,
            categorias
        })

    } catch (err) {
        res.json({
            ok: false,
            err
        })
    }
});

app.get('/categoria/:id', async(req, res) => {
    let id = req.params.id
    try {
        const categorias = await Categoria.findById(id)
            .populate('usuario', 'nombre email').exec();
        res.json({
            ok: true,
            categorias
        })

    } catch (err) {
        res.json({
            ok: false,
            err
        })
    }
});

app.put('/categoria/:id', async(req, res) => {
    try {
        const id = req.params.id;
        const body = req.body;
        const categoria = await Categoria.findByIdAndUpdate(id, body, { new: true });
        res.json({
            ok: true,
            categoria
        })


    } catch (err) {
        res.json({
            ok: false,
            err
        })
    }
});

app.delete('/categoria/:id', [autentication.verificaToken, autentication.verificaAdminRole, ], async(req, res) => {
    try {
        const id = req.params.id;
        const body = req.body;
        const categoria = await Categoria.findByIdAndDelete(id);
        res.json({
            ok: true,
            categoria
        })
    } catch (err) {
        res.json({
            ok: false,
            err
        })
    }
});