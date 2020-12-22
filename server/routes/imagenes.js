const express = require('express');
const path = require('path');
const fs = require('fs');
const { autentication } = require('../middlewares')
const app = express();

app.get('/imagen/:tipo/:img', autentication.verificaTokenImg, (req, res) => {
            const tipo = req.params.tipo;
            const img = req.params.img;
            const pathImg = `${path.resolve(__dirname, `../../uploads/${type}/${img}`)}`
    const noImagPath = path.resolve(__dirname, '../assets/no-image.jpg')

    if (!fs.existsSync(pathImg)) {
        return res.sendFile(noImagPath);
    }

    res.sendFile(pathImg);

});

module.exports = app;