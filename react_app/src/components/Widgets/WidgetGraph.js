import React, { useEffect } from 'react' 

import TagsHistoricalGraph from '../TagsGraph/TagsHistoricalGraph'
import getColor from '../TagsGraph/GraphColors'
import axiosInstance from "../../utils/axiosApi";
import getBaseUrl from '../../utils/localSettings'
const BASE_URL = getBaseUrl()




export default function WidgetGraph(props) {
  const [loading, setLoading] = React.useState(true)
  const [graphInterval, setGraphInterval] = React.useState({interval:'5m', resolution:'full', tags: props.widget.tags})
  const [tagsHistory, setTagsHistory] = React.useState([])
  const device_id = props.device_id;

  function readTagsHistory() {
    axiosInstance.get(BASE_URL + "/device/tags/history/", { params: { id: device_id, ...graphInterval}} )
    .then(responce => {
      if (responce) {
        const tags = responce.data
        const prepared_tags = tags.map( (tag, index) => {
          return ({
            tag_id: tag.tag_id,
            tag_code: tag.tag_code,
            tag_name: tag.tag_name,
            disabled: false,
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
      }
    })  
  }
  
  // read parameters
  useEffect(() => {
    readTagsHistory();
    setTimeout( () => { setLoading(false) }, 1000);
    const graphUpdateInterval = setInterval( readTagsHistory, 60000)
    return () => {
      clearInterval(graphUpdateInterval);
    };
  }, [])

  
  function changeGraphinterval(interval, resolution){
    return null
  }

  // toggle curve display
  function toggleCurveDisplay(tag_id){
    const n = tagsHistory.map( entry => { 
      if (entry.tag_id===tag_id) { entry.disabled = !entry.disabled } 
      return entry
    })
    setTagsHistory(n)
  }

  // render the widget
  return (
    <React.Fragment>
        <TagsHistoricalGraph 
            tagsHistory={tagsHistory} 
            toggleCurveDisplay={toggleCurveDisplay}
            title={props.widget.title}
            legend={props.widget.legend}
            loading={loading}
            toolbar={props.widget.toolbar}
            changeGraphinterval={changeGraphinterval}
        /> 
    </React.Fragment>
  );
}

