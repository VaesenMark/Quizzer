import React from 'react'
import * as ReactRedux from 'react-redux';
import {judgeAnswerAction} from '../reducers';
//TODO binnengekomen calls met error goed afhandelen

class PlayedQuestionItemsUI extends React.Component {
    constructor(props) {
        super(props);
    }

    acceptAnswer() {
        this.props.judgeAnswer(this.props.teamId, true)
    }

    render() {
        // let clickHandler = (evt) => {
        //     evt.preventDefault();
        //     console.log(this.props.quiz._id);
        //     this.props.approveTeam(this.props.quiz._id, this.props.roundNumber, this.props.questionNumber, this.props.teamId)
        // };

        return  (
            <div>
                Team: {this.props.teamId}
                <br/>
                Answer: {this.props.answer}
                <br/>
                { this.props.judgeAble ? <button onClick={this.acceptAnswer.bind(this)}>Accept</button> : '' }

                {this.props.message}
                {/*<span onClick={clickHandler}>*/}
                 {/*{this.props.answer}*/}
                 {/*</span>*/}
            </div>
        )
    }
}


function mapDispatchToProps(dispatch) {
    return {
        judgeAnswer: (teamId, accepted) => dispatch(judgeAnswerAction(teamId, accepted)),
        // approveTeam: (quizID, roundNumber,questionNumber, teamID) => dispatch(approveAnswerTeam(quizID, roundNumber,questionNumber, teamID ))
    }
}

function mapStateToProps(state) {
    return {
        answers : state.PlayedQuestionState.answers,
        quiz: state.MainState.quizItem,
        roundNumber:  state.QuestionsState.roundNumber,
        questionNumber: state.QuestionsState.questionNumber,
        message: state.PlayedQuestionState.message
    }
}

export const PlayedQuestionItem = ReactRedux.connect(mapStateToProps, mapDispatchToProps)(PlayedQuestionItemsUI);