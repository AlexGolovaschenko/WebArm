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

  const toggleCategorySelection = (toggle_index) => {
    setCategories( categories.map( (category, index)=> {
      if (toggle_index === index) {
        return {...category, selected: !category.selected}
      } else { return category }
    }))
  }

  function readLogRecords() {
    const selected_categories = categories.filter( category => category.selected )
    const selected_category_codes = selected_categories.map( category => category.code )
    axiosInstance.get(BASE_URL + "/events/log/", { params: { id: device_id, categories: selected_category_codes }} )
    .then((responce) => {
      responce && setRecords(responce.data)     
    })  
  }

  // read parameters
  useEffect(() => {
    readLogRecords();
    const loadingTimeout = setTimeout( () => { setLoading(false) }, 500);
    const tagsUpdateInterval = setInterval(readLogRecords, 10000);
    return () => {
      clearTimeout(loadingTimeout);      
      clearInterval(tagsUpdateInterval);
    };
  }, [categories, ])

  // render the page
  return (
    <React.Fragment>
        <RecordsList
          records={records} 
          title={props.widget.title} 
          categories={categories}
          category_selection_panel={props.widget.category_selection_panel} 
          toggleCategorySelection={toggleCategorySelection}
          loading={loading} 
        />
    </React.Fragment>
  );
}

