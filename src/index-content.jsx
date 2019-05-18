import React from 'react';
import ReactDOM from 'react-dom';

export let navigationListener = {};
navigationListener.callback = null;

class TicTacToe extends React.Component {
    constructor(props){
        super(props);
        this.state = {
          text: 'Hello',
        };
    }
    componentDidMount() {
        navigationListener.callback = (data) => {
          this.setState({text: data});
        };
    }

    render() {
        return (
            <h1>
                {this.state.text}
            </h1>
        );
    }
}

// ========================================

const ticTacToe = ReactDOM.render(
    <TicTacToe />,
    document.getElementById('root')
);

