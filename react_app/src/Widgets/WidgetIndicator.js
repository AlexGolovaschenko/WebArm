import React, { useEffect } from 'react';

import TagIndicator from './components/TagsIndicator/TagIndicator';
import {getTagValue} from "../backendAPI/backendAPI";


export default function WidgetIndicator(props) {
  const [tags, setTags] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const device_id = props.device_id;
  const displayedTags =  props.widget.tags;  
  const tag = tags[0]; // TODO: widget display just 1 tag now

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
  }, []);

  return (
    <React.Fragment>
        <TagIndicator
          tag={tag} 
          title={props.widget.title}
          precision={props.widget.precision}
          addTextRight={props.widget.addTextRight}
          addTextLeft={props.widget.addTextLeft}
          loading={loading} 
        />
    </React.Fragment>
  );
}

