import React, {useEffect} from 'react';
import PropTypes from 'prop-types'
import {
    FlexibleXYPlot, 
    XAxis, 
    YAxis, 
    LineSeries,
    MarkSeries,
    Crosshair,
    // VerticalGridLines, 
    HorizontalGridLines, 
    Highlight} from 'react-vis';

import useTargetClick from '../../utils/useTargetClick'



function Graph(props) {
  const tags = props.tags   
  const displayedTags = tags.filter( tag => tag.disabled === false )  
  const resetZoomButton = props.resetZoomButton
  const [lastDrawLocation, setLastDrawLocation] = React.useState(null)
  const [crosshairValues, setCrosshairValues] = React.useState([])

  useTargetClick(resetZoomButton, ()=>{
    console.log('seted onclick')
    setLastDrawLocation(null)
  })

  useEffect(() => {
    if (lastDrawLocation) {
      resetZoomButton.current.className = resetZoomButton.current.className.replace(' d-none', '')
    } else {
      resetZoomButton.current.className += ' d-none'
    }
  }, [lastDrawLocation])

  
  const crosshairData = displayedTags.map( (tag) => {
    return tag.values.map((value) => {
      value.title = tag.tag_name
      value.color = tag.curve_color
      return value
    })
  });  

  const _onMouseLeave = () => {
    setCrosshairValues([]);
  };

  const _onNearestX = (value, {index}) => {
    setCrosshairValues( crosshairData.map(d => d[index]) );
  };

  function format_time(time) {
    const s = new Date(time)
    let formatter = new Intl.DateTimeFormat([] , {dateStyle: 'long', timeStyle: 'medium'});
    return formatter.format(s)
  }

  if (displayedTags.length > 0) {
    return (
      <React.Fragment>
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
            yPadding={10}
            onMouseLeave={_onMouseLeave}        
          >
            <HorizontalGridLines style={{stroke: '#444A50'}} />
            <XAxis style={{line:{stroke: '#6c757d'}}} tickTotal={15} />
            <YAxis style={{line:{stroke: '#6c757d'}}} />
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
                setLastDrawLocation({
                  lastDrawLocation: {
                    bottom: lastDrawLocation.bottom + (area.top - area.bottom),
                    left: lastDrawLocation.left - (area.right - area.left),
                    right: lastDrawLocation.right - (area.right - area.left),
                    top: lastDrawLocation.top + (area.top - area.bottom)
                  }
                });
              }}
            />

            {crosshairValues[0] && 
              crosshairValues.map((point, index)=>{
                return <MarkSeries
                          key = {index}
                          color = {point.color}
                          size = '5'
                          data={[point]}/>
            })}

            <Crosshair values={crosshairValues} style={{line:{backgroundColor:'red'}}}>  
              {crosshairValues[0] && 
                <div className='rounded p-1 mx-2' style={{background: 'rgba(37, 37, 38, 1)'}}>
                  <table className="table text-light p-0 m-0">
                    <thead> 
                    <tr>
                        <td colSpan="3" style={{fontSize: '1.2em', color: 'rgb(180, 180, 180)'}} 
                          className='border-0 font-weight-bold p-1 m-0 text-center text-nowrap'
                        >
                          {format_time(crosshairValues[0].x)}
                        </td>
                    </tr>
                    </thead>
                    <tbody>
                      { crosshairValues.map((point, index)=>{
                        return (
                          <tr style={{fontSize: '1.1em', color: 'rgb(210, 210, 210)'}} key={index}>
                            <td style={{color: point.color, paddingTop: '4px'}} className='text-nowrap border-0 px-1 pb-0 m-0	fas fa-minus'></td>   
                            <td className='text-nowrap border-0 pl-1 pr-2 py-0 m-0'> {point.title}: </td>   
                            <td className='text-nowrap border-0 px-1 py-0 m-0 font-weight-bold  text-right'> {point.y} </td>
                          </tr> 
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              }
            </Crosshair>
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