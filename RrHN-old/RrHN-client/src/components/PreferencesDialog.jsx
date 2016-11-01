import React from 'react'
import { browserHistory } from 'react-router';

export default class PreferencesDialog extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showItemsCount: this.props.showItemsCount,
            preferredColor: this.props.preferredColor,
            invalidItemCountEntered: false
        };

        this.updatePreferencesClick = (e) => {
            e.preventDefault();
            this.props.updatePreferences(this.state.showItemsCount, this.state.preferredColor);
            browserHistory.goBack();
        };
    }

    changeItemCount(e) {
        if(e.target.value < 0 || e.target.value > 500) {
            this.setState({
                invalidItemCountEntered : true
            });
        }
        else {
            this.setState({
                showItemsCount: e.target.value,
                invalidItemCountEntered : false
            });
        }
    };

    changeColor(e) {
        this.setState({
            preferredColor: e.target.value
        });
    };

    render() {
        return (
            <div className="preferences-dialog">
                {/*Items count input*/}
                Show &nbsp;
                <input
                    type="text"
                    value={this.state.showItemsCount}
                    onChange={this.changeItemCount.bind(this)}
                    className={this.state.invalidItemCountEntered ? 'red-border' : ''}
                />
                &nbsp; items
                <br/><br/>

                {/*Color selector*/}
                Color &nbsp;
                <select
                    value={this.state.preferredColor}
                    onChange={this.changeColor.bind(this)}
                >
                    <option value="orange">Orange</option>
                    <option value="green">Green</option>
                    <option value="red">Red</option>
                </select>
                <div className={`colorBox ${this.state.preferredColor}`}></div>
                <br/>

                {/*OK Button*/}
                <input
                    type="button"
                    defaultValue="OK"
                    onClick={this.updatePreferencesClick}
                />

                {/*Cancel Button*/}
                <input
                    type="button"
                    defaultValue="Cancel"
                    onClick={ () => browserHistory.goBack()}
                />
            </div>
        );
    }
}
