import React from 'react';
import ReactDOM from 'react-dom';
import ReactMarkDown from 'react-markdown';
const input = '# This is a header\n\nAnd this is a paragraph';

function renderName(props) {
    return (
        <li key={props.key}>
            {props.name}
        </li>
    );
}

export class Guides extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            mdInput: '',
            mdsReceived: []
        };
    }
    componentDidMount() {
        let xmlHttp = new XMLHttpRequest();
        xmlHttp.open("POST", "get-guide", true);
        xmlHttp.setRequestHeader('Content-type', 'application/json');
        xmlHttp.onreadystatechange = () => {
            if(xmlHttp.readyState === 4 && xmlHttp.status === 200){
                let guideJson = JSON.parse(xmlHttp.responseText);
                this.setState({mdsReceived: guideJson});
            }
        };
        xmlHttp.send(null);
    }
    render() {
        return (
            <div>
                <h1 className="content-title">
                    Guías
                </h1>
                <ul>
                    {this.state.mdsReceived.map((item, index) => renderName({name: item.name, key: item.name + "-key-id-" + index}))}
                </ul>
            </div>
        );
    }
}