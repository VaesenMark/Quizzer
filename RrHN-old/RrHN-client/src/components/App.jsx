import React from 'react'
import request from 'superagent';

// Bootstrap
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';

import ItemList from './ItemList';


export class RRHN_App extends React.Component {
    constructor(props) {
        super(props);

        this.startLoadingItems();

        this.state = {
            items: 0,
            showItemsCount: 5,
            preferredColor: 'red'
        }
    }

    startLoadingItems() {
        request.get("http://localhost:3000/hn/topstories")
            .end( (err,response) => {
                if(err)
                    throw err;
                else {
                    this.setState({
                        items: response.body
                    });
                }

            })
    }

    updatePreferences(itemCount, color) {
        this.setState({
            showItemsCount: itemCount,
            preferredColor: color
        });
    }

    render() {
        let itemsFiltered = [];
        if(this.state.items) {
            for(let i = 0; i < this.state.showItemsCount; i++) {
                itemsFiltered.push(this.state.items[i]);
            }
        }

        let urlItemID = this.props.children.props.params.id;
        let item = {};
        if(urlItemID) {
            for (let i = 0; i < this.state.items.length; i++) {
                if (this.state.items[i].id == urlItemID) {
                    item = this.state.items[i];
                }
            }
        }

        let childProps = {
            preferredColor: this.state.preferredColor,
            showItemsCount: this.state.showItemsCount,
            updatePreferences: this.updatePreferences.bind(this),
            item: item
        };

        let enhancedChild = React.cloneElement(this.props.children, childProps);

        return (
            <div>
                <Row className={`TopBar ${this.state.preferredColor}`}>
                    <p>Welcome to RRHN</p>
                    <p>There are {this.state.items.length} HN items.</p>
                </Row>
                <Row className="Content">
                    <Col xs={3} className="left-column">
                        <ItemList
                            items={itemsFiltered}
                            selectedColor={this.state.preferredColor}
                            showItemsCount={this.state.showItemsCount}
                        />
                    </Col>
                    <Col xs={9} className="right-column">
                        {enhancedChild}
                    </Col>
                </Row>
            </div>
        );
    }
}