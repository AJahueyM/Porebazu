export function makeHTTPRequestJSON(params, callback){
    let xmlHttp = new XMLHttpRequest();
    xmlHttp.open(params.method, params.url, true);
    xmlHttp.setRequestHeader('Content-type', 'application/json');
    xmlHttp.onreadystatechange = () => {
        if(xmlHttp.readyState === 4 && xmlHttp.status === 200){
            callback(xmlHttp.responseText);
        }
        callback(undefined);
    };
    xmlHttp.send(JSON.stringify(params.body));
}