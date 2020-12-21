const express = require('express');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const Usuario = require('../models/usuarios')
const app = express();

module.exports = app;


app.post('/login', (req, res) => {

    let body = req.body;

    Usuario.findOne({ email: body.email }, (err, usuarioDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: '(Usuario) o password incorrecto'
                }
            });
        }

        if (bcrypt.compareSync(body.password, usuarioDB.password)) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario o (password) incorrecto'
                }
            });
        }

        const token = jwt.sign({
                usuario: usuarioDB
            },
            'este-es-el-seed-dev', { expiresIn: process.env.CADUCIDAD_TOKEN }
        )

        res.json({
            ok: true,
            usuario: usuarioDB,
            token
        })
    });

})