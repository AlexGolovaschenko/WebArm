import React, { useEffect } from 'react'; 

import TagsCurrentValueList from './components/TagsList/TagsCurrentValueList';
import {getTagValue} from "../backendAPI/backendAPI";


export default function WidgetTable(props) {
  const [tags, setTags] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const device_id = props.device_id;
  const displayedTags =  props.widget.tags;

  const readDeviceTags = () => {
    getTagValue(device_id, displayedTags, 
      (responce) => responce && setTags(responce)
    );
  };
  
  useEffect(() => {
    readDeviceTags();
    const loadingTimeout = setTimeout( () => { setLoading(false) }, 1000);
    const tagsUpdateInterval = setInterval(readDeviceTags, 2000);
    return () => {
      clearTimeout(loadingTimeout);      
      clearInterval(tagsUpdateInterval);
    };
  }, [])

  return (
    <React.Fragment>
        <TagsCurrentValueList
          tags={tags} 
          title={props.widget.title} 
          columns={props.widget.columns} 
          loading={loading} 
        />
    </React.Fragment>
  );
}

