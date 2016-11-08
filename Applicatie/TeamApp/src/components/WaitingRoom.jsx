import React from 'react';


export default class WaitingRoomUI extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div>
                <h2>Your team registration has been accepted</h2>
                <h2>Wait for the quizmaster to start the game</h2>
            </div>
        );
    }
}