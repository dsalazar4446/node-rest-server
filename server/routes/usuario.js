const { json } = require('body-parser');
const express = require('express');
const app = express();
const bcrypt = require('bcrypt')
const _ = require('underscore')

const Usuario = require('../models/usuarios')
const { autentication } = require('../middlewares/index')

app.post('/usuario', [autentication.verificaToken, autentication.verificaAdminRole], (req, res) => {
    let body = req.body;
    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role,
    });

    usuario.save((err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        return res.json({
            ok: true,
            usuario: usuarioDB
        })
    });
});
app.put('/usuario/:id', [autentication.verificaToken, autentication.verificaAdminRole], (req, res) => {
    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);

    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuario) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            usuario
        })

    })
});

app.get('/usuario', autentication.verificaToken, (req, res) => {

    let desde = Number(req.query.desde || 0);
    let limite = Number(req.query.limite || 5);
    const select = 'nombre email role estado imagen google';

    Usuario.find({ estado: true }, select)
        .skip(desde)
        .limit(limite)
        .exec(function(err, usuarios) {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }

            Usuario.countDocuments({ estado: true }, (err, count) => {

                res.json({
                    ok: true,
                    total: count,
                    usuarios
                })
            })
        })
})

app.delete('/usuario/:id', [autentication.verificaToken, autentication.verificaAdminRole], (req, res) => {
    let id = req.params.id;

    Usuario.findByIdAndUpdate(id, { estado: false }, { new: true }, (err, usuario) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        res.json({
            ok: true,
            usuario
        })
    })

});

module.exports = app;