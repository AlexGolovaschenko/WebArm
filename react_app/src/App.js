import './App.css'
import React, { useEffect } from 'react' 
import Navbar from './components/BaseParts/Navbar'
import Sidebar from './components/BaseParts/Sidebar'
import Loader from './components/BaseParts/Loader'
import TagsCurrentValueList from './components/TagsList/TagsCurrentValueList'

import '../node_modules/react-vis/dist/style.css'
import TagsHistoricalGraph from './components/TagsGraph/TagsHistoricalGraph'
import getColor from './components/TagsGraph/GraphColors'

const BASE_URL = "http://bfcloud.space/"
// const BASE_URL = "http://localhost:8000/"


function App() {
  const [tags, setTags] = React.useState([])
  const [deviceName, setDeviceName] = React.useState('')
  const [loading, setLoading] = React.useState(true)
  const [tagsHistory, setTagsHistory] = React.useState([])

  function readDeviceParameters() {
    fetch(BASE_URL + "api/v1/device")
      .then(responce => responce.json())
      .then(deviceParameters => { setDeviceName(deviceParameters.name) }) 
  }

  function readDeviceTags() {
    fetch(BASE_URL + "api/v1/device/current-values")
    .then(responce => responce.json())
    .then(tags => setTags(tags) )  
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
          curve_color : getColor(index),
          values: tag.values.map( (value) => {
            return {x: new Date(value.add_date), y: value.value}
          })
        })
      })  
      setTagsHistory( (prev) => {
        return prepared_tags.map( (tag)=> {
          const fltr = prev.filter( entry=>entry.tag_id === tag.tag_id )
          var disabled = (fltr.length > 0) ? fltr[0].disabled : false
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
    setTimeout( () => { setLoading(false) }, 2000);

    // set update interval
    const tagsUpdateInterval = setInterval(readDeviceTags, 2000);
    const graphUpdateInterval = setInterval( readTagsHistory, 10000)
    return () => {
      clearInterval(tagsUpdateInterval);
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
      <Navbar />
      <div className="row m-0 p-0">
        <Sidebar />
        <div className="col-10 m-0 p-0">
          <div className="content-height">
            <div className="p-3">
              <p>Устройство: <b>{deviceName}</b></p>
              {loading ? <Loader /> : <TagsCurrentValueList tags={tags} />}
            </div>

            {loading ? null : <TagsHistoricalGraph tagsHistory={tagsHistory} toggleCurveDisplay={toggleCurveDisplay}/> }
            
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

export default App;
