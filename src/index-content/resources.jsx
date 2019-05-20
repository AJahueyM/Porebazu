import React from 'react';
import ReactDOM from 'react-dom';
import {makeHTTPRequestJSON} from '../common/html-request-handler.js';

class SingleResource extends React.Component {
    constructor(props){
        super(props);
    }
    render() {
        return (
            <li className="resource-list-element">
                <a href={this.props.resource.url} target="_blank">
                    {this.props.resource.name}
                </a>
            </li>
        );
    }
}

function renderSingleItem(props) {
    return (
        <SingleResource resource={props.resource} key={props.key}  />
    );
}

export class Resources extends React.Component {
    constructor(props){
        super(props);
        this.state = {
          currentResources: []
        }
        ;
        makeHTTPRequestJSON({method: 'POST', url: 'get-resources'}, (response) => this._onResourcesReceived(response) );
    }
    _onResourcesReceived(response) {
        if(response === undefined){
            return;
        }
        let resources = JSON.parse(response);
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

