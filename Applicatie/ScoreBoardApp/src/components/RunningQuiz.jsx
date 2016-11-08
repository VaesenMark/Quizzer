import React from 'react';
import * as ReactRedux from 'react-redux';
import {TeamSubmission} from './TeamSubmission'
import {TeamScores} from './TeamScores'

import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';

class RunningQuizUI extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        let theItems = [];
        if (this.props.teamSubmissions) {
            theItems = this.props.teamSubmissions.map((itm, idx) =>
                <TeamSubmission teamName={itm.teamName}
                                submittedAnswer={itm.answer}
                                answerApproved={itm.approved}
                                key={itm.teamName}/>
            );
        }
        return (
            <div>
                <div className="topBar">
                    <br/>
                    <h4><strong>Question:</strong></h4>
                    <h4>{this.props.question}</h4>
                    <br/>
                </div>
                <hr/>
                <div className="gameScores">
                    <div className="teamSubmissions">
                        <strong>Team answers:</strong>
                        {theItems}
                    </div>

                    <div className="Team scores">
                        <TeamScores/>
                    </div>
                </div>
                <hr/>
                <div className="bottomBar">
                    <Row>
                        <Col xs={12} sm={6}>
                            <h4>Question {this.props.questionNumber}/12 --- Round {this.props.roundNumber}</h4>
                        </Col>
                        <Col xs={12} sm={4} className="text-center">
                            <h4>Category: {this.props.category}</h4>
                        </Col>
                    </Row>
                </div>
            </div>
        );
    }
}


function mapStateToProps(state) {
    return {
        question: state.base.question,
        questionNumber: state.base.questionNumber,
        category: state.base.category,
        quizPassword: state.base.quizPassword,
        roundNumber: state.base.roundNumber,
        teamSubmissions: state.base.teamSubmissions
    }
}


function mapDispatchToProps(dispatch) {
    return {
    }
}




export const RunningQuiz =
    ReactRedux.connect(mapStateToProps, mapDispatchToProps)(RunningQuizUI);
