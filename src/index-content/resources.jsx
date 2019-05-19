import React from 'react';
import ReactDOM from 'react-dom';

function renderSingleItem(props) {
    return (
        <li className="resource-list-element" key={props.key}>
            <a href={props.resource.url}>
                {props.resource.name}
            </a>
        </li>
    );
}

export class Resources extends React.Component {
    constructor(props){
        super(props);
        this.state = {
          currentResources: []
        }
        ;
        this._requestResourceUpdate();
    }
    _requestResourceUpdate(){
        let xmlHttp = new XMLHttpRequest();
        xmlHttp.open("POST", "get-resources", true);
        xmlHttp.setRequestHeader('Content-type', 'application/json');
        xmlHttp.onreadystatechange = () => {
            if(xmlHttp.readyState === 4 && xmlHttp.status === 200){
                this._onResourcesReceived(xmlHttp.responseText);
            }
        };
        xmlHttp.send(null);
    }
    _onResourcesReceived(data) {
        let resources = JSON.parse(data);
        this.setState({currentResources: resources})
    }

    render() {
        return (
            <div>
                <h1 className="content-title">
                    Recursos
                </h1>
                <ul className="resources-list">
                    {
                        this.state.currentResources.map((resource, i) => renderSingleItem({resource: resource, key: resource.name + '-list-key-' + i}))
                    }
                </ul>
            </div>
        );
    }
}

