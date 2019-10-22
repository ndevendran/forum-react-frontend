import React from 'react';
import ReactDOM from 'react-dom';

class ItemCheckbox extends React.Component {
  render() {
    return (
      <input className="listItem" type="checkbox" checked={this.props.isChecked}
        onClick={() => this.props.onClick()}
      >
        {this.props.itemTitle} {this.props.itemDueDate}
      </input>
    );
  }
}

class ItemList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      items: [],
      checkedItems: [],
    };
  }

  componentDidMount() {
    fetch("http://localhost:8000/todo/list/8/rest")
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({
            items: result.itemList.map(function(item) {
              var newItem = {};
              newItem.itemId = item.item_id;
              newItem.itemTitle = item.item_title;
              newItem.itemDueDate = item.item_due_date;
              newItem.isChecked = false;
              return newItem;
            }),
            isLoaded: true
          });
        },
        (error) => {
          this.setState({
            isLoaded: true,
            error: error,
          });
        }
      )
  }

  handleClick(itemId) {
    const items = this.state.items.slice();
    for(var i = 0; i < items.length; i++) {
      var item = items[i];
      if(item.itemId === itemId){
        item.isChecked = !item.isChecked;
        this.setState({items: items});
        return
      }
    }
  }

  renderCheckbox(itemTitle, itemDueDate, isChecked, itemId) {
    return (
      <ItemCheckbox
          itemTitle={itemTitle} itemDueDate={itemDueDate}
          isChecked={isChecked}
          onClick={() => this.handleClick({itemId})}
        />
    );
  }

  render() {
    const { error, isLoaded, items } = this.state;
    if (error) {
      return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
      return <div>Loading...</div>;
    } else {
      return (
        <div>
          {items.map(item => (
            this.renderCheckbox(item.item_title, item.due_date, item.isChecked, item.itemId)
          ))}
        </div>
      );
    }
  }
}

ReactDOM.render(
  <ItemList />,
  document.getElementById("root")
);
