import React, { useEffect } from 'react' 

import Loader from '../../components/BaseParts/Loader'
import TagsCurrentValueList from '../../components/TagsList/TagsCurrentValueList'
import axiosInstance from "../../utils/axiosApi";
import getBaseUrl from '../../utils/localSettings'
const BASE_URL = getBaseUrl()



export default function WidgetTable(props) {
  const [tags, setTags] = React.useState([])
  const [loading, setLoading] = React.useState(true)
  const device_id = props.device_id;

  function readDeviceTags() {
    axiosInstance.get(BASE_URL + "/device/tags/value/", { params: { id: device_id }} )
    .then(responce => responce.data)
    .then(tags => setTags(tags) )  
  }
  
  // read parameters
  useEffect(() => {
    readDeviceTags();
    setTimeout( () => { setLoading(false) }, 1000);
    const tagsUpdateInterval = setInterval(readDeviceTags, 2000);
    return () => {
      clearInterval(tagsUpdateInterval);
    };
  }, [])

  // render the page
  return (
    <React.Fragment>
        {loading ? <Loader /> : <TagsCurrentValueList tags={tags} />}
    </React.Fragment>
  );
}

