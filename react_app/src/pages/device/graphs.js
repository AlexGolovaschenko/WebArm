import React, { useEffect } from 'react' 
import Loader from '../../components/BaseParts/Loader'

import TagsHistoricalGraph from '../../components/TagsGraph/TagsHistoricalGraph'
import getColor from '../../components/TagsGraph/GraphColors'

import getBaseUrl from '../../utils/localSettings'
const BASE_URL = getBaseUrl()

export default function DeviceOverviewPage() {
  const [deviceName, setDeviceName] = React.useState('')
  const [loading, setLoading] = React.useState(true)
  const [tagsHistory, setTagsHistory] = React.useState([])

  function readDeviceParameters() {
    fetch(BASE_URL + "api/v1/device")
      .then(responce => responce.json())
      .then(deviceParameters => { setDeviceName(deviceParameters.name) }) 
  }

  function readTagsHistory() {
    fetch(BASE_URL + "api/v1/device/tags/history")
    .then(responce => responce.json())
    .then(tags => {
      const prepared_tags = tags.map( (tag, index) => {
        return ({
          tag_id: tag.tag_id,
          tag_code: tag.tag_code,
          tag_name: tag.tag_name,
          disabled: !tag.gisplay_on_garaph,
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
    readTagsHistory();
    setTimeout( () => { setLoading(false) }, 1000);

    // set update interval
    const graphUpdateInterval = setInterval( readTagsHistory, 10000)
    return () => {
      clearInterval(graphUpdateInterval);
    };
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
        <p>Устройство: <b>{deviceName}</b></p>
        {loading ? <Loader /> : null }
        {loading ? null : <TagsHistoricalGraph tagsHistory={tagsHistory} toggleCurveDisplay={toggleCurveDisplay}/> }
    </React.Fragment>
  );
}

