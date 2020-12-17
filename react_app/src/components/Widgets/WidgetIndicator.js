import React, { useEffect } from 'react' 

import TagIndicator from '../../components/TagsIndicator/TagIndicator'
import axiosInstance from "../../utils/axiosApi";
import getBaseUrl from '../../utils/localSettings'
const BASE_URL = getBaseUrl()



export default function WidgetIndicator(props) {
  const [tags, setTags] = React.useState([])
  const [loading, setLoading] = React.useState(true)
  const device_id = props.device_id;
  const requestParams = {id: device_id, tags: props.widget.tags};
  const tag = tags[0] // TODO: widget display just 1 tag

  function readDeviceTags() {
    axiosInstance.get(BASE_URL + "/device/tags/value/", { params: requestParams} )
    .then((responce) => {
      responce && setTags(responce.data)
    })  
  }

  useEffect(() => {
    readDeviceTags();
    setTimeout( () => { setLoading(false) }, 1000);
    const tagsUpdateInterval = setInterval(readDeviceTags, 2000);
    return () => {
      clearInterval(tagsUpdateInterval);
    };
  }, [])


  return (
    <React.Fragment>
        <TagIndicator
          tag={tag} 
          title={props.widget.title}
          addTextRight={props.widget.addTextRight}
          addTextLeft={props.widget.addTextLeft}
          loading={loading} 
        />
    </React.Fragment>
  );
}
