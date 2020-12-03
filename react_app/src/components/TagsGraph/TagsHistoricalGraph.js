import React from 'react';
import PropTypes from 'prop-types'
import Graph from './Graph'
import Legend from './Legend'
import Loader from '../../components/BaseParts/Loader'


function TagsHistoricalGraph(props) {
    const tags = props.tagsHistory  

    return (   
        <React.Fragment>
        <div className='card shadow-sm p-3 bg-dark text-light' style={{minHeight:'400px'}}>
        { props.loading ? <Loader /> :
            <div className="row m-0 p-0">

                <div className={`${ props.legend ? 'col-8' : 'col-12'} m-0 p-0`}>
                    <Graph tags={tags} disabledGraphs={props.disabledGraphs} />
                </div>

                { props.legend ? (
                    <div className="col-4 m-0 p-0">
                        <Legend tags={tags} disabledGraphs={props.disabledGraphs} onClick={props.toggleCurveDisplay} />
                    </div>
                    ) : null 
                }

            </div>
        }
        </div>
        </ React.Fragment>
    );
}


TagsHistoricalGraph.propTypes = {
    tagsHistory: PropTypes.arrayOf(PropTypes.object).isRequired
}

export default TagsHistoricalGraph