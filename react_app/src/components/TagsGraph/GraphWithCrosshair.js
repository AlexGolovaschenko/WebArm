import React from 'react';
import PropTypes from 'prop-types'
import {
    FlexibleXYPlot, 
    XAxis, 
    YAxis, 
    LineSeries,
    Crosshair,
    // VerticalGridLines, 
    HorizontalGridLines, 
    Highlight} from 'react-vis';



function Graph(props) {
  const tags = props.tags   
  const displayedTags = tags.filter( tag => tag.disabled === false )
  const [lastDrawLocation, setLastDrawLocation] = React.useState(null)
  const [crosshairValues, setCrosshairValues] = React.useState([])

  const resetZoomBtn = (
    <button
      className="btn btn-secondary m-3 btn-graph"
      onClick={() => setLastDrawLocation(null)}
      >
      Вернуть масштаб
    </button>)

  const crosshairData = displayedTags.map( (tag) => {
    return tag.values.map((value) => {
      value.titel = tag.tag_name
      return value
    })
  });  

  const _onMouseLeave = () => {
    setCrosshairValues([]);
  };

  const _onNearestX = (value, {index}) => {
    setCrosshairValues( crosshairData.map(d => d[index]) );
  };

  const _crosshairItemsFormat = (points) => {
    return points.map((point)=>{
      return {title: point.titel, value: point.y}
    })
  };

  const _crosshairTitleFormat = (points) => {
    const formatted_time = format_time(points[0].x)
    return {title: 'Время', value: formatted_time}
  };  
  

  function format_time(time) {
    const s = new Date(time)
    let formatter = new Intl.DateTimeFormat([] , {dateStyle: 'medium', timeStyle: 'medium'});
    return formatter.format(s)
  }

  if (displayedTags.length > 0) {
    return (
      <React.Fragment>
        {lastDrawLocation ? resetZoomBtn : null}
        <div className='graph-container  h-100' style={{overflow: 'hidden'}}>
          <FlexibleXYPlot 
            margin={{left: 40, right: 0, top: 0, bottom: 30}} 
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
            onMouseLeave={_onMouseLeave}        
          >
            <HorizontalGridLines style={{stroke: '#444A50'}} />
            <XAxis tickTotal={15} />
            <YAxis />
            { displayedTags.map((tag, index)=>{
              if (index === 0) {
                return <LineSeries onNearestX={_onNearestX} data={tag.values} color={tag.curve_color} key={tag.tag_id} />
              }
              else {
                return <LineSeries data={tag.values} color={tag.curve_color} key={tag.tag_id} />
              }
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

            <Crosshair
              values={crosshairValues}
              itemsFormat = {_crosshairItemsFormat}
              titleFormat = {_crosshairTitleFormat} 
            />              
          </FlexibleXYPlot>
        </div>
      </ React.Fragment>
    );  
  } else {
    return (
      <React.Fragment>
      <div className='graph-container h-100'>
        <FlexibleXYPlot 
          dontCheckIfEmpty
          margin={{left: 30, right: 0, top: 0, bottom: 30}}      
        >
          <HorizontalGridLines style={{stroke: '#444A50'}} />
          <XAxis />
          <YAxis />
          <LineSeries data={[{x:0, y:0}]} /> 
        </FlexibleXYPlot>
      </div>
      </ React.Fragment> 
    )                   
  }
}


Graph.propTypes = {
    tags: PropTypes.arrayOf(PropTypes.object).isRequired
}

export default Graph