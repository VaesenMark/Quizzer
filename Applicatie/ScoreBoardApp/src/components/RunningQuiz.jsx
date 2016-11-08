import React from 'react';
import * as ReactRedux from 'react-redux';
import {TeamSubmissions} from './TeamSubmissions'
import {TeamScores} from './TeamScores'

import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';

class RunningQuizUI extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div>
                <div className="topBar">
                    <br/>
                    <span className="scoreBoardQuestion">{this.props.question}</span>
                    <br/>
                </div>
                <hr/>
                <div className="gameScores">
                    <Row>
                        <Col xs={12} sm={8}>
                            <div className="teamSubmissions">
                                <TeamSubmissions/>
                            </div>
                        </Col>
                        <Col xs={12} sm={4}>
                            <div className="teamScores">
                                <TeamScores/>
                            </div>
                        </Col>
                    </Row>
                </div>
                <hr/>
                <div className="bottomBar">
                    <Row>
                        <Col xs={12} sm={6}>
                            <h4>Question {this.props.questionNumber}/12  -  Round {this.props.roundNumber}</h4>
                        </Col>
                        <Col xs={12} sm={6} className="text-center">
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
