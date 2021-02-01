import React, { useEffect } from 'react' 

import RecordsList from './components/EventsLog/RecordsList'
import axiosInstance from "../utils/axiosApi";
import getBaseUrl from '../utils/localSettings'
const BASE_URL = getBaseUrl()



export default function WidgetEventsLog(props) {
  const [records, setRecords] = React.useState([])
  const [loading, setLoading] = React.useState(true)
  const device_id = props.device_id;

  function readLogRecords() {
    axiosInstance.get(BASE_URL + "/events/log/", { params: { id: device_id }} )
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
  }, [])

  // render the page
  return (
    <React.Fragment>
        <RecordsList
          records={records} 
          title={props.widget.title} 
          loading={loading} 
        />
    </React.Fragment>
  );
}

