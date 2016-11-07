import React from 'react';
import * as ReactRedux from 'react-redux';

import {
    quizSelectedAction
} from '../reducers';


class QuizSelectionItemUI extends React.Component {
    constructor(props) {
        super(props)
    }

    quizSelected() {
        console.log('zzz',this.props.quizId);
        this.props.quizSelected(this.props.quizId, this.props.quizStatus)
    }

    render() {
        return (
            <div className="quizSelectionBlock">
                QuizId: {this.props.quizId}
                <br/>
                QuizStatus: {this.props.quizStatus}
                <br/>
                <button onClick={this.quizSelected.bind(this)}>Submit</button>
            </div>
        );
    }
}


function mapStateToProps(state) {
    return {
    }
}


function mapDispatchToProps(dispatch) {
    return {
        quizSelected: (quizId, quizStatus) => dispatch(quizSelectedAction(quizId, quizStatus))
    }
}




export const QuizSelectionItem =
    ReactRedux.connect(mapStateToProps, mapDispatchToProps)(QuizSelectionItemUI);
