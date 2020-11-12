import React from 'react';
import PropTypes from 'prop-types'
import Graph from './Graph'
import Legend from './Legend'
import getColor from './GraphColors'

function TagsHistoricalGraph(props) {
    const tags = props.tagsHistory
    const prepared_tags = tags.map( (tag, index) => {
        return (
            {
                tag_id: tag.tag_id,
                tag_code: tag.tag_code,
                tag_name: tag.tag_name,
                curve_color : getColor(index),
                values: tag.values.map( (value) => {
                    return {x: new Date(value.add_date), y: value.value}
                } )
            }
        )
    })     

    return (
        <React.Fragment>
            <div className="row m-0 p-3">
                <div className="col-8 m-0 p-0">
                    <Graph tags={prepared_tags} />
                </div>
                <div className="col-4 m-0 p-0">
                    <Legend tags={prepared_tags} />
                </div>
            </div>
        </ React.Fragment>
    );
}


TagsHistoricalGraph.propTypes = {
    tagsHistory: PropTypes.arrayOf(PropTypes.object).isRequired
}

export default TagsHistoricalGraph