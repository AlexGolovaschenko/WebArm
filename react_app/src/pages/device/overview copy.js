import React, { useEffect } from 'react' 

import Loader from '../../components/BaseParts/Loader'
import TagsCurrentValueList from '../../components/TagsList/TagsCurrentValueList'
import TagsHistoricalGraph from '../../components/TagsGraph/TagsHistoricalGraph'
import RenderWidgets from '../../components/Widgets/renderWidgets'
import axiosInstance from "../../utils/axiosApi";
import getColor from '../../components/TagsGraph/GraphColors'
import getBaseUrl from '../../utils/localSettings'
const BASE_URL = getBaseUrl()



const WidgetsTemplate = {
  widgets:[
    {
      type: 'table',
      size: 2,
      tags: ['TEMP1', 'TEMP2', 'TEMP3'],   
      fields: ['#No', 'code', 'name', 'value']              
    },
    {
      type: 'graph',
      size: 4,
      tags: ['TEMP1', 'TEMP2', 'TEMP3'],
      legend: true,
      history: 'last data',
      last: '12h',
      resolution: '10m'
    }      
  ]
}



export default function DeviceOverviewPage(props) {
  const [tags, setTags] = React.useState([])
  const [deviceName, setDeviceName] = React.useState('')
  const [loading, setLoading] = React.useState(true)
  const [tagsHistory, setTagsHistory] = React.useState([])

  const device_id = props.device_id;

  function readDeviceParameters() {
    axiosInstance.get(BASE_URL + "/device/parameters/", { params: { id: device_id }} )
      .then(responce => responce.data)
      .then(deviceParameters => { setDeviceName(deviceParameters.name) }) 
  }

  function readDeviceTags() {
    axiosInstance.get(BASE_URL + "/device/tags/value/", { params: { id: device_id }} )
    .then(responce => responce.data)
    .then(tags => setTags(tags) )  
  }

  function readTagsHistory() {
    axiosInstance.get(BASE_URL + "/device/tags/history/", { params: { id: device_id }} )
    .then(responce => responce.data)
    .then(tags => {
      const prepared_tags = tags.map( (tag, index) => {
        return ({
          tag_id: tag.tag_id,
          tag_code: tag.tag_code,
          tag_name: tag.tag_name,
          disabled: !tag.display_on_garaph,
          curve_color : getColor(index),
          values: tag.values.map( (value) => {
            return {x: new Date(value.add_date), y: value.value}
          })
        })
      })  
      setTagsHistory( (prev) => {
        return prepared_tags.map( (tag)=> {
          const fltr = prev.filter( entry=>entry.tag_id === tag.tag_id )
          var disabled = (fltr.length > 0) ? fltr[0].disabled : tag.disabled
          return {...tag, disabled: disabled}
        })
      })
    })  
  }
  
  // read parameters
  useEffect(() => {
    readDeviceParameters();
    readDeviceTags();
    readTagsHistory();
    setTimeout( () => { setLoading(false) }, 1000);

    // set update interval
    // const tagsUpdateInterval = setInterval(readDeviceTags, 2000);
    // const graphUpdateInterval = setInterval( readTagsHistory, 60000)
    // return () => {
    //   clearInterval(tagsUpdateInterval);
    //   clearInterval(graphUpdateInterval);
    // };
  }, [])

  

  // toggle curve display
  function toggleCurveDisplay(tag_id){
    const n = tagsHistory.map( entry => { 
      if (entry.tag_id===tag_id) { entry.disabled = !entry.disabled } 
      return entry
    })
    setTagsHistory(n)
  }

  // render the page
  return (
    <React.Fragment>
        <h3 className='pb-2'>Устройство: <b>{deviceName}</b></h3>
        {loading ? <Loader /> : <TagsCurrentValueList tags={tags} />}
        {loading ? null : <TagsHistoricalGraph tagsHistory={tagsHistory} toggleCurveDisplay={toggleCurveDisplay}/> }
        {loading ? null : < RenderWidgets widgets_template={WidgetsTemplate} device_id={device_id}/> }
    </React.Fragment>
  );
}
