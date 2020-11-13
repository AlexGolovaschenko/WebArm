import React from 'react';
import SearchableDiscreteColorLegend from 'react-vis/dist/legends/searchable-discrete-color-legend';

export default class Legend extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [],
      searchText: '',
      onClick: props.onClick
    };
    this.state.items = this.props.tags.map((tag) => {
        return {title: tag.tag_name, color: tag.curve_color, tag_id:tag.tag_id, disabled:tag.disabled}
    });
  }

  _clickHandler = item => {
    const {items} = this.state;
    item.disabled = !item.disabled;
    this.state.onClick(item.tag_id);    
    this.setState({items});
  };

  _searchChangeHandler = searchText => {
    this.setState({searchText});
  };

  render() {
    const {items, searchText} = this.state;
    return (
    <div className='d-block pl-3'>
      <SearchableDiscreteColorLegend
        height={400}
        // width={300}
        onSearchChange={this._searchChangeHandler}
        searchText={searchText}
        onItemClick={this._clickHandler}
        items={items}
      />
    </div>
    );
  }
}