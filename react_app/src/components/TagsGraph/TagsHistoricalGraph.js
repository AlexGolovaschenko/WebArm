import React from 'react';
import PropTypes from 'prop-types'
import Graph from './Graph'
import Legend from './Legend'


function TagsHistoricalGraph(props) {
    const tags = props.tagsHistory  

    return (
        <React.Fragment>
            <div className="row m-0 p-3">
                <div className="col-8 m-0 p-0">
                    <Graph tags={tags} disabledGraphs={props.disabledGraphs} />
                </div>
                <div className="col-4 m-0 p-0">
                    <Legend tags={tags} disabledGraphs={props.disabledGraphs} onClick={props.toggleCurveDisplay} />
                </div>
            </div>
        </ React.Fragment>
    );
}


TagsHistoricalGraph.propTypes = {
    tagsHistory: PropTypes.arrayOf(PropTypes.object).isRequired
}

export default TagsHistoricalGraph