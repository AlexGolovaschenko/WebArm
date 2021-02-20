import React, { useEffect } from 'react' 

import RecordsList from './components/EventsLog/RecordsList'
import axiosInstance from "../utils/axiosApi";
import getBaseUrl from '../utils/localSettings'
const BASE_URL = getBaseUrl()



export default function WidgetEventsLog(props) {
  const [records, setRecords] = React.useState([])
  const [loading, setLoading] = React.useState(true)
  const [categories, setCategories] = React.useState( [
    {name: 'Аварийные',       code: 'Alarm',   selected: true},
    {name: 'Предупреждения',  code: 'Warning',  selected: true},
    {name: 'Информационные',  code: 'Info',     selected: true},
    {name: 'Отладочные',      code: 'Debug',    selected: false}
  ])
  const device_id = props.device_id;
  const [pagination, setPagination] = React.useState({next: null, previous: null})
  const [page, setPage] = React.useState(1)

  const toggleCategorySelection = (toggle_index) => {
    setCategories( categories.map( (category, index)=> {
      if (toggle_index === index) {
        return {...category, selected: !category.selected}
      } else { return category }
    }))
  }

  function readLogRecords(url, props={}){
    axiosInstance.get(url, props)
    .then((responce) => {
      responce && setRecords(responce.data.results)
      responce && setPagination({
        next: responce.data.next, 
        previous: responce.data.previous, 
        num_pages: responce.data.num_pages, 
        page_number: responce.data.page_number, 
      })
    }) 
  }

  function readLogPage(page) {
    const selected_categories = categories.filter( category => category.selected )
    const selected_category_codes = selected_categories.map( category => category.code )
    readLogRecords(BASE_URL + "/events/log/", { params: { id: device_id, categories: selected_category_codes, page:page }} ) 
  }
  function readNextPage() {
    pagination.next && setPage(page+1)
  }
  function readPreviousPage() {
    pagination.previous && setPage(page-1)
  }
  function updateFirstPage(page) {
    if (page===1) {readLogPage(1)}
  }


  // read parameters
  useEffect(() => {
    readLogPage(page)
    const loadingTimeout = setTimeout( () => { setLoading(false) }, 500);
    const tagsUpdateInterval = setInterval(()=>updateFirstPage(page), 10000)
    return () => {
      clearTimeout(loadingTimeout);      
      clearInterval(tagsUpdateInterval);
    };
  }, [categories, page, ])


  // render the page
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
          readLogPage={readLogPage}
          pagination={pagination}
          loading={loading} 
        />
    </React.Fragment>
  );
}

