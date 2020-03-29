const express = require('express');

const app = express();

app.use(express.static('./dist/clientapp'));

app.get('/*', (req, res) =>
    res.sendFile('index.html', {root: 'dist/clientapp/'}),
);

app.listen(process.env.PORT || 8080);