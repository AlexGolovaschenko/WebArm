import React, { useEffect } from 'react' 
import SearchableDiscreteColorLegend from 'react-vis/dist/legends/searchable-discrete-color-legend';




export default function Legend(props) {
  const tags = props.tags   
  var [searchText, setSearchText] = React.useState('')

  var state = {
    items: [],
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
    <div className='d-block pl-3'>
      <SearchableDiscreteColorLegend
        height={400}
        // width={300}
        onSearchChange={_searchChangeHandler}
        // searchPlaceholder={'Поиск...'}
        searchText={searchText}
        onItemClick={_clickHandler}
        items={state.items}
      />
    </div>
  );
}