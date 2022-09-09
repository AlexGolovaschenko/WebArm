import React from 'react'; 
import SearchableDiscreteColorLegend from 'react-vis/dist/legends/searchable-discrete-color-legend';


export default function Legend(props) { 
  const [searchText, setSearchText] = React.useState('');
  const state = {
    onClick: props.onClick,
    items: props.tags.map((tag) => {
      return {title: tag.tag_name, color: tag.curve_color, tag_id:tag.tag_id, disabled:tag.disabled}
    })
  };
  const legendBlockHeight = parseInt(props.height.replace('px', '')) || null; // TODO: this can't be parsed and couse of error if height seted like 65vh
  const _clickHandler = (item) => state.onClick(item.tag_id);    
  const _searchChangeHandler = (searchText) => setSearchText(searchText);

  return (
    <div className='d-block text-dark pl-3'>
      <SearchableDiscreteColorLegend
        height={legendBlockHeight} 
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