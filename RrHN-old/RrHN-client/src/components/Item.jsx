import React from 'react'
import { Link } from 'react-router'

export default class Item extends React.Component {
    constructor(props) {
        super(props);

        this.clicked = () => {
            this.props.onSelectItem(this.props);
        };
    }

    render() {
        return (
            <div>
                <div className="Item">
                    <Link to={`/item/${this.props.id}`} onClick={this.clicked}>{this.props.title}</Link>
                    <br/>
                    {this.props.status}
                    <br/>
                    <span className="ItemText">{this.props.score} points | by {this.props.by}</span>
                    <br/>
                </div>
                <hr/>
            </div>
        );
    }
}
