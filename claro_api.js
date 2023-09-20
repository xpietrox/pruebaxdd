const express = require('express');
const get_titular = require('./claro_request.js');

const app = express();

app.get('/', (req, res) => {
    res.send('Hola :v');
});

app.get('/api/', (req, res) => {
    res.send('api');
});

app.get('/api/claro/', (req, res) => {
    res.send('api claro');
});

app.get('/api/claro/:id', async (req, res) => {
    const num = req.params.id;
    if (num === null){
        return res.json({ coError: '002', message: 'Ingresa un numero.' });
    }

    if (isNaN(Number(num)) || num.length !== 9){
        return res.json({ coError: '003', message: 'Formatos incorrectos.' });
    }

    try{
        await get_titular(num, res);
    }catch ( error ) {
        console.error(error);
        return res.status(404).json({ coError: '404', message: 'Ha ocurrido un error.' });
    }
});

const port = process.env.port || 73
app.listen(port, () => console.log(`API iniciada en el puerto ${port}`));