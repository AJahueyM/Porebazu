import React from "react";
import ReactDOM from "react-dom";
import ReactMarkDown from 'react-markdown';
import {makeHTTPRequestJSON} from './common/html-request-handler.js';


class Guide extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            md: ''
        };
    }
    componentDidMount() {
        let guideID = window.location.href.split('/')[4];
        guideID = parseInt(guideID);
        this.getGuideRequest({
            id: guideID
        });
    }
    getGuideRequest(guide){
        let params = {
            method: 'POST',
            url: '/get-guides',
            body: {
                request: 'get_guide',
                guide_id: guide.id
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

