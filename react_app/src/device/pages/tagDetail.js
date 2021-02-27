import React from 'react' 
import {useParams} from 'react-router-dom'



export default function TagDetailPage(props) {
    const { tag_id, device_id } = useParams();

    return (
        <React.Fragment>
            <p>Редактирование тега {tag_id} {device_id} </p>
        </React.Fragment>
    )
}