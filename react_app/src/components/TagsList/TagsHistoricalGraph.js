import React from 'react';
import PropTypes from 'prop-types'
import {XYPlot, XAxis, YAxis, LineSeries, VerticalGridLines, HorizontalGridLines} from 'react-vis';

function Graph(props) {
    const tags = props.tagsHistory
    const prepared_tags = tags.map( (tag, index) => {
        return (
            {
                tag_id: tag.tag_id,
                tag_code: tag.tag_code,
                tag_name: tag.tag_name,
                values: tag.values.map( (value) => {
                    return {x: new Date(value.add_date), y: value.value}
                } )
            }
        )
    })     
 
    return (
        <div className="App">
        <XYPlot height={400} width={1000} xType="time">
            <VerticalGridLines />
            <HorizontalGridLines />
            <XAxis />
            <YAxis />
            { prepared_tags.map((tag, index)=>{
                return <LineSeries data={tag.values} key={tag.tag_id} />
            }) }
        </XYPlot>
        </div>
    );
}


Graph.propTypes = {
    tagsHistory: PropTypes.arrayOf(PropTypes.object).isRequired
}

export default Graph