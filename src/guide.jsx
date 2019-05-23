import React from "react";
import ReactDOM from "react-dom";
import ReactMarkDown from 'react-markdown';
import {makeHTTPRequestJSON} from './common/html-request-handler.js';

function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = decodeURI(value);
    });
    return vars;
}
class Guide extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            md: ''
        };
    }
    componentDidMount() {
        let guideInfo = getUrlVars();
        this.getGuideRequest({
            area: guideInfo.area,
            level: guideInfo.level,
            group: guideInfo.group,
            name: guideInfo.name
        });
    }
    getGuideRequest(guide){
        let params = {
            method: 'POST',
            url: 'get-guides',
            body: {
                request: 'get_guide',
                guide_area: guide.area,
                guide_level: guide.level,
                guide_group: guide.group,
                guide_name: guide.name
            }};
        makeHTTPRequestJSON(params,(response) => this.getGuideRequestCallback(response));
    }
    getGuideRequestCallback(response) {
        if(response === undefined){
            return;
        }
        this.setState({md: JSON.parse(response).md});
    }

    render() {
        return (
            <ReactMarkDown  source={this.state.md}/>
        );
    }
}

ReactDOM.render(
    <Guide />,
    document.getElementById('root')
);

