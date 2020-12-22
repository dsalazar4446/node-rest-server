const express = require('express');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const Usuario = require('../models/usuarios')
const app = express();
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);

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
        }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });

        res.json({
            ok: true,
            usuario: usuarioDB,
            token
        })
    });


})


//Configuraciones de google

async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();

    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }

}
// verify().catch(console.error);


app.post('/google', async(req, res) => {
    let token = req.body.idtoken;

    let googleUser = await verify(token)
        .catch(Error => {
            return res.status(403).json({
                ok: false,
                err
            })
        })


    Usuario.findOne({ email: googleUser.email }, (err, usuario) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (usuario) {
            if (usuario.google === false) {
                return res.status(500).json({
                    ok: false,
                    err: {
                        message: 'Debe usar su autentificacion normal'
                    }
                })
            } else {
                const token = jwt.sign({
                    usuario
                }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });

                return res.json({
                    ok: true,
                    usuario,
                    token
                })
            }
        } else {
            // si el usuario no existe

            let newUsuario = new Usuario();
            newUsuario.nombre = googleUser.nombre;
            newUsuario.email = googleUser.email;
            newUsuario.img = googleUser.img;
            newUsuario.google = true;
            newUsuario.password = ':)';

            newUsuario.save((err, usuario) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err
                    })
                }
                return res.json({
                    ok: true,
                    usuario,
                    token
                })
            })
        }
    })

    // res.json({
    //     usuario: googleUser
    // })
})