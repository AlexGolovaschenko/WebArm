import React, { useEffect } from 'react' 

import TagsHistoricalGraph from '../TagsGraph/TagsHistoricalGraph'
import getColor from '../TagsGraph/GraphColors'
import axiosInstance from "../../utils/axiosApi";
import getBaseUrl from '../../utils/localSettings'
const BASE_URL = getBaseUrl()



export default function WidgetGraph(props) {
  const [loading, setLoading] = React.useState(true)
  const [graphInterval, setGraphInterval] = React.useState({interval:'1h', resolution:'1m', tags: props.widget.tags})
  const [tagsHistory, setTagsHistory] = React.useState([])
  const device_id = props.device_id;

  function updateTagsHistory(tags) {
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

  // read tags historical data
  function readTagsHistory() {
    axiosInstance.get(BASE_URL + "/device/tags/history/", { params: { id: device_id, ...graphInterval}} )
    .then(responce => {
      responce && updateTagsHistory(responce.data)
    })  
  }
  
  // read parameters
  useEffect(() => {
    readTagsHistory();
    const loadingTimeout = setTimeout( () => { setLoading(false) }, 1000);
    const graphUpdateInterval = setInterval( readTagsHistory, getGraphUpdateTimeout(graphInterval.interval))
    return () => {
      clearTimeout(loadingTimeout);
      clearInterval(graphUpdateInterval);
    };
  }, [graphInterval])

  
  function changeGraphInterval(interval, resolution){
    setGraphInterval( (prev) => {
      return {...prev, interval: interval, resolution: resolution}
    })
  }

  function getGraphUpdateTimeout(interval){
    if (interval === '5m') {
      return 2000                       // 2s
    } else if (interval === '1h') {
      return 30000                      // 30s
    } else if (interval === '6h') {
      return 60000 * 2                  // 2m
    } else if (interval === '12h') {
      return 60000 * 5                  // 5m
    } else if (interval === '1d') {
      return 60000 * 15                 // 15m
    } else if (interval === '7d') {
      return 60000 * 60                 // 1h
    } else if (interval === '30d') {
      return 60000 * 60 * 6             // 6h
    } else {
      return 60000 * 5                  // 5m
    }
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
            height={props.widget.height}
            changeGraphInterval={changeGraphInterval}
        /> 
    </React.Fragment>
  );
}

