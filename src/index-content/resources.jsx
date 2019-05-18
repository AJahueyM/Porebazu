import React from 'react';
import ReactDOM from 'react-dom';

function renderSingleItem(props) {
    return (
        <l1 className="resource-list-element" key={props.key}>
            {props.name}
        </l1>
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
        xmlHttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        xmlHttp.onreadystatechange = () => {
            if(xmlHttp.readyState === 4 && xmlHttp.status === 200){
                this._onResourcesNameReceived(xmlHttp.responseText);
            }
        };
        xmlHttp.send(null);
    }
    _onResourcesNameReceived(data) {
        let receivedResourcesName = data.split(',');
        receivedResourcesName.pop();

        this.setState({currentResources: receivedResourcesName})
    }
    render() {
        return (
            <div>
                <h1 className="content-title">
                    Recursos
                </h1>
                <ul className="resources-list">
                    {
                        this.state.currentResources.map((resourceName) => renderSingleItem({name: resourceName, key: resourceName + '-list-key'}))
                    }
                </ul>
            </div>
        );
    }
}

