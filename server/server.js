const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const resourceManager = require('./actions/get-resources');

const app = express(),
    DIST_DIR =  path.join(__dirname, '../dist/'),
    HTML_FILE = path.join(DIST_DIR, 'index.html');

app.use(express.static(DIST_DIR));
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', (req, res) => {
    res.sendFile(HTML_FILE);
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`App listening to ${PORT}....`);
    console.log('Press Ctrl+C to quit.');
});

let rscManager = new resourceManager.ResourceManager();
app.post('/get-resources', (req, res) => {
    let resources = rscManager.currentResources();
    res.end(JSON.stringify(resources));
});
