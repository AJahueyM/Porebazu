const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const resourceManager = require('./actions/get-resources');
const guidesManager = require('./actions/get-guides');

let rscManager = new resourceManager.ResourceManager();
let gdsManager = new guidesManager.GuidesManager();

const app = express(),
    DIST_DIR =  path.join(__dirname, '../dist/'),
    HTML_FILE = path.join(DIST_DIR, 'index.html');

app.use(express.static(DIST_DIR));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json({extended: true}));

app.get('/', (req, res) => {
    res.sendFile(HTML_FILE);
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`App listening to ${PORT}....`);
    console.log('Press Ctrl+C to quit.');
});

app.post('/get-resources', (req, res) => {
    let resources = rscManager.getCurrentResources();
    res.end(JSON.stringify(resources));
});

app.post('/get-guides', (req, res) => {
    if(req.body.request === 'get_names'){
        res.end(JSON.stringify(gdsManager.getCurrentGuidesNames()));
    }else if(req.body.request === 'get_tree'){
        res.end(JSON.stringify(gdsManager.getGuideTree()));
    }else if(req.body.request === 'get_guide'){
        let validGuideRequest = (req.body.guide_level !== undefined && req.body.guide_group !== undefined) && req.body.guide_name !== undefined;
        if(req.body.guide_name !== undefined){
            res.end(JSON.stringify(gdsManager.getGuide(req.body.guide_level, req.body.guide_group, req.body.guide_name)));
        }else{
            res.end(JSON.stringify(undefined));
        }
    }else{
        res.end(JSON.stringify(undefined));
    }
});