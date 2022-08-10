import React, { useEffect } from 'react'; 

import RecordsList from './components/EventsLog/RecordsList';
import {getLogRecords} from "../backendAPI/backendAPI";


export default function WidgetEventsLog(props) {
  const [records, setRecords] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [categories, setCategories] = React.useState( [
    {name: 'Аварийные',       code: 'Alarm',   selected: true},
    {name: 'Предупреждения',  code: 'Warning',  selected: true},
    {name: 'Информационные',  code: 'Info',     selected: true},
    {name: 'Отладочные',      code: 'Debug',    selected: false}
  ]);
  const device_id = props.device_id;
  const [pagination, setPagination] = React.useState({next: null, previous: null});
  const [page, setPage] = React.useState(1);

  const toggleCategorySelection = (toggle_index) => {
    setCategories( categories.map( (category, index)=> {
      if (toggle_index === index) {
        return {...category, selected: !category.selected}
      } else { return category }
    }))
  };

  const readLogRecords = (parameters) => {
    getLogRecords(device_id, parameters,
      (responce) => {
        responce && setRecords(responce.results)
        responce && setPagination({
          next: responce.next, 
          previous: responce.previous, 
          num_pages: responce.num_pages, 
          page_number: responce.page_number, 
        })
      }
    );
  };

  const readLogPage = (page) => {
    const selected_categories = categories.filter( category => category.selected )
    const selected_category_codes = selected_categories.map( category => category.code )
    readLogRecords({categories: selected_category_codes, page:page}) 
  };
  const readNextPage = () => pagination.next && setPage(page+1);
  const readPreviousPage = () => pagination.previous && setPage(page-1);
  const changePage = (page) => setPage(page);  
  const updateFirstPage = (page) => { if (page===1) {readLogPage(1)} };

  useEffect(() => {
    readLogPage(page)
    const loadingTimeout = setTimeout( () => { setLoading(false) }, 500);
    const tagsUpdateInterval = setInterval(()=>updateFirstPage(page), 10000);
    return () => {
      clearTimeout(loadingTimeout);      
      clearInterval(tagsUpdateInterval);
    };
  }, [categories, page, ]);

  return (
    <React.Fragment>
        <RecordsList
          records={records} 
          title={props.widget.title} 
          categories={categories}
          category_selection_panel={props.widget.category_selection_panel} 
          toggleCategorySelection={toggleCategorySelection}
          readNextPage={readNextPage}
          readPreviousPage={readPreviousPage}
          changePage={changePage}
          pagination={pagination}
          loading={loading} 
        />
    </React.Fragment>
  );
}

