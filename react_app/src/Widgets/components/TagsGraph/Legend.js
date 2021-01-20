import React from 'react' 
import SearchableDiscreteColorLegend from 'react-vis/dist/legends/searchable-discrete-color-legend';




export default function Legend(props) { 
  var [searchText, setSearchText] = React.useState('')

  var state = {
    onClick: props.onClick,
    items: props.tags.map((tag) => {
      return {title: tag.tag_name, color: tag.curve_color, tag_id:tag.tag_id, disabled:tag.disabled}
    })
  }

  function _clickHandler (item) {
    state.onClick(item.tag_id);    
  };

  function _searchChangeHandler (searchText) {
    setSearchText(searchText)
  };

  return (
    <div className='d-block text-dark pl-3'>
      <SearchableDiscreteColorLegend
        height={ parseInt(props.height.replace('px', '')) }
        // width={300}
        onSearchChange={_searchChangeHandler}
        searchPlaceholder={'Поиск...'}
        searchText={searchText}
        onItemClick={_clickHandler}
        items={state.items}
      />
    </div>
  );
}