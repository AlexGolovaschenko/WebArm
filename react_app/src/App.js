import './App.css'
import React, { useEffect } from 'react' 
import Navbar from './components/BaseParts/Navbar'
import Sidebar from './components/BaseParts/Sidebar'
import Loader from './components/BaseParts/Loader'
import TagsCurrentValueList from './components/TagsList/TagsCurrentValueList'

import '../node_modules/react-vis/dist/style.css'
import TagsHistoricalGraph from './components/TagsGraph/TagsHistoricalGraph'

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
    .then(tags => setTagsHistory(tags) )  
  }

  // read parameters
  useEffect(() => {
    readDeviceParameters();
    readDeviceTags();
    readTagsHistory();
    setTimeout( () => { setLoading(false) }, 2000);

    // set update interval
    const tagsUpdateInterval = setInterval(readDeviceTags, 2000);
    const graphUpdateInterval = setInterval(readTagsHistory, 10000)
    return () => {
      clearInterval(tagsUpdateInterval);
      clearInterval(graphUpdateInterval);
    };
  }, [])

  
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

            {loading ? null : <TagsHistoricalGraph tagsHistory={tagsHistory}/> }
            
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

export default App;
