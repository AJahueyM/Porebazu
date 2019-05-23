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
    GUIDE_FILE = path.join(DIST_DIR, 'guide.html');


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
        if(req.body.guide_id !== undefined){
            res.end(JSON.stringify(gdsManager.getGuideByID(req.body.guide_id)));
        }else{
            res.end(JSON.stringify(undefined));
        }
    }else{
        res.end(JSON.stringify(undefined));
    }
});

app.get( '/guides/:id/:name', handleGuidesGET);

app.get( '/guides/:id', (req, res) => {
    let guideID = parseInt(req.params.id);
    let guide = gdsManager.getGuideByID(guideID);
    if(guide === undefined){
        res.end(undefined);
        return;
    }
    let guideName =  guide.name.replace(/ /g, '-').substr( guide.name.search(/[a-zA-Z]/));
    let newURL = req.url;
    if(req.url[req.url.length-1] !== '/'){
        newURL = newURL + '/';
    }
    newURL = newURL + guideName;
    res.redirect(newURL);
});

function handleGuidesGET(req, res){
    res.sendFile(GUIDE_FILE);
}