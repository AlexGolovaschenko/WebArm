import React, {useEffect} from 'react';
import PropTypes from 'prop-types'
import {
    FlexibleXYPlot, 
    XAxis, 
    YAxis, 
    LineSeries,
    // VerticalGridLines, 
    HorizontalGridLines, 
    Highlight} from 'react-vis';

import useTargetClick from '../../utils/useTargetClick'


function Graph(props) {
  const tags = props.tags 
  const displayedTags = tags.filter( tag => tag.disabled === false )
  const resetZoomButton = props.resetZoomButton
  const [lastDrawLocation, setLastDrawLocation] = React.useState(null)

  useTargetClick(resetZoomButton, ()=>{
    console.log('seted onclick')
    setLastDrawLocation(null)
  })

  useEffect(() => {
    if (lastDrawLocation) {
      resetZoomButton.current.className = resetZoomButton.current.className.replace('d-none', 'd-block')
    } else {
      resetZoomButton.current.className = resetZoomButton.current.className.replace('d-block', 'd-none')
    }
  }, [lastDrawLocation])

  
  let has_displayed_tags = false
  displayedTags.map( (tag) => {
    if (tag.values.length > 0) {has_displayed_tags = true}
  })

  if (has_displayed_tags) {
    return (
      <React.Fragment>
        <div className='graph-container h-100' style={{overflow: 'hidden'}}>
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
          >
            <HorizontalGridLines style={{stroke: '#444A50'}} />
            <XAxis style={{line:{stroke: '#6c757d'}}} tickTotal={15} />
            <YAxis style={{line:{stroke: '#6c757d'}}} />
            { displayedTags.map((tag)=>{ 
              return <LineSeries data={tag.values} color={tag.curve_color} key={tag.tag_id} />
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