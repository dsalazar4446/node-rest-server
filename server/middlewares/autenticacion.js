const jwt = require('jsonwebtoken')

/**
 * Verificar token
 */

const verificaToken = (req, res, next) => {
    let token = req.get('token');

    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'token no valido'
                }
            })
        }
        req.usuario = decoded.usuario
        next()
    });
}

/**
 * verifica Admin Role
 */

const verificaAdminRole = (req, res, next) => {

    if (req.usuario.role !== 'ADMIN_ROLE') {
        return res.status(401).json({
            ok: false,
            err: {
                message: 'Tienes que ser administrador para realizar esta accion'
            }
        })
    }
    next()

}

const verificaTokenImg = (req, res, next) => {
    const token = req.query.token
    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'token no valido'
                }
            })
        }
        req.usuario = decoded.usuario
        next()
    });
}


module.exports = {
    verificaToken,
    verificaAdminRole,
    verificaTokenImg
}