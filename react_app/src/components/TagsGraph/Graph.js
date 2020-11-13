import React from 'react';
import PropTypes from 'prop-types'
import {
    XYPlot, 
    XAxis, 
    YAxis, 
    LineSeries,
    // VerticalGridLines, 
    HorizontalGridLines, 
    Highlight} from 'react-vis';



function Graph(props) {
    const tags = props.tags   
    const [lastDrawLocation, setLastDrawLocation] = React.useState(null)

    const resetZoomBtn = (
        <button
            className="btn btn-secondary m-3 btn-graph"
            onClick={() => setLastDrawLocation(null)}
            >
            Вернуть масштаб
        </button>)

    const hasDisplay = tags.filter( tag => tag.disabled === false ).length > 0
    if (hasDisplay) {
        return (
            <React.Fragment>
                <div className='graph-container'>
                    <XYPlot 
                        height={400} 
                        width={1000}
                        margin={{left: 30, right: 0, top: 0, bottom: 30}} 
                        xType="time"
                        animation
                        xDomain={
                            lastDrawLocation && [
                                lastDrawLocation.left,
                                lastDrawLocation.right
                            ]
                        }
                        yDomain={
                            lastDrawLocation && [
                                lastDrawLocation.bottom,
                                lastDrawLocation.top
                            ]
                        }       
                    >
                        <HorizontalGridLines />
                        <XAxis tickTotal={20} />
                        <YAxis />
                        { tags.map((tag)=>{ 
                            return !tag.disabled ? <LineSeries data={tag.values} color={tag.curve_color} key={tag.tag_id} /> : null
                        }) }
    
                        <Highlight
                            onBrushEnd={area => setLastDrawLocation(area)}
                            onDrag={area => {
                                this.setState({
                                    lastDrawLocation: {
                                        bottom: lastDrawLocation.bottom + (area.top - area.bottom),
                                        left: lastDrawLocation.left - (area.right - area.left),
                                        right: lastDrawLocation.right - (area.right - area.left),
                                        top: lastDrawLocation.top + (area.top - area.bottom)
                                    }
                                });
                            }}
                        />
                    </XYPlot>
                </div>
                {lastDrawLocation ? resetZoomBtn : null}
            </ React.Fragment>
        );
    } else {
        return (
            <React.Fragment>
            <div className='graph-container'>
                <XYPlot 
                    height={400} 
                    width={1000}
                    dontCheckIfEmpty
                    margin={{left: 30, right: 0, top: 0, bottom: 30}}      
                >
                    <HorizontalGridLines />
                    <XAxis />
                    <YAxis />
                    <LineSeries data={[{x:0, y:0}]} /> 
                </XYPlot>
            </div>
            </ React.Fragment> 
        )                   
    }


}


Graph.propTypes = {
    tags: PropTypes.arrayOf(PropTypes.object).isRequired
}

export default Graph