import * as ReactRedux from 'react-redux';
import React from 'react';


export default class WaitingRoomUI extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div>
                <h1>Wait for the quizmaster to start the game</h1>
            </div>
        );
    }
}