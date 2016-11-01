import React from 'react'
import Item from './Item'
import request from 'superagent';
import { Link } from 'react-router'

export default class ItemList extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            itemStatusses: ''
        };

        this.startLoadingStatuses = () => {
            request.get("http://localhost:3000/itemStatuses")
                .end( (err,response) => {
                    if(err)
                        throw err;
                    else {
                        this.setState({
                           itemStatusses: response.body
                        });
                    }
                })
        };

        this.seenAllItems = () => {
            let clonedStatusesObject = Object.assign({}, this.state.itemStatusses);
            for(let i = 0; i < this.props.items.length; i++) {
                if(clonedStatusesObject[this.props.items[i].id] != 'read') {
                    clonedStatusesObject[this.props.items[i].id] = 'seen';
                    this.storeItemStatus(this.props.items[i].id, 'seen');
                }
            }
            this.setState({
                itemStatusses: clonedStatusesObject
            });
        };

        this.onSelectItem = (listItem) => {
            this.state.itemStatusses[listItem.id] = 'read';
            this.storeItemStatus(listItem.id, 'read');
        };

        this.startLoadingStatuses();
    }

    storeItemStatus(id,status) {  // status is either "seen" or "read"
        request.put("http://localhost:3000/itemStatuses/" + id)
            .set('Content-Type', 'text/plain')
            .send(status)
            .end( (err,response) => {
                if(err)
                    throw err;
                else
                    console.log("STATUS STORED");
            })
    }



    render() {
        console.log(this.props.items);
        let items;
        if(this.props.items) {
            items = this.props.items.map((item) => {
                return (
                    <Item
                        title={item.title}
                        url={item.url}
                        score={item.score}
                        by={item.by}
                        id={item.id}
                        key={item.id}
                        onSelectItem={this.onSelectItem}
                        status={this.state.itemStatusses[item.id] ? this.state.itemStatusses[item.id] : 'new'}
                    />
                );
            });
        }

        return (
            <div>
                <div className="ItemListHeader">
                    <Link to="preferences">Preferences</Link>
                </div>
                {items}
                <div className="ItemListFooter">
                    <input type="button" onClick={this.seenAllItems} defaultValue="Seen all items"/>
                </div>
            </div>
        );
    }
}
