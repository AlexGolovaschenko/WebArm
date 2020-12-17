import React from 'react';
import PropTypes from 'prop-types'
import Graph from './Graph'
import GraphWithCrosshair from './GraphWithCrosshair'
import Legend from './Legend'
import Toolbar from './Toolbar'
import Loader from '../../components/BaseParts/Loader'


function TagsHistoricalGraph(props) {
  const [modal, setModal] = React.useState(false) // use it just for force update this component
  const [crosshair, setCrosshair] = React.useState(false)
  const graphCard = React.useRef(null)
  const graphContainer = React.useRef(null)
  const modalButton = React.useRef(null)
  const crosshairButton = React.useRef(null)
  const legendContainer = React.useRef(null)
  const resetZoomButton = React.useRef(null)
  const tags = props.tagsHistory  
  const GRAPH_HEIGH = '300px'

  const toggleModal = () => {
    const cl = ' full-screen-card'
    if (graphCard.current.className.includes(cl)) {
      graphCard.current.className = graphCard.current.className.replace(cl, '')
      graphContainer.current.style.height = GRAPH_HEIGH
      graphContainer.current.className = graphContainer.current.className.replace('col-10', 'col-8')
      if (props.legend) {legendContainer.current.className = legendContainer.current.className.replace('col-2', 'col-4')}    
      modalButton.current.className = modalButton.current.className.replace('fa-compress', 'fa-expand') 
      modalButton.current.className = modalButton.current.className.replace('text-primary', 'text-light')      
      setModal(false)
    } else {
      graphCard.current.className += cl
      graphContainer.current.style.height = '90%'
      graphContainer.current.className = graphContainer.current.className.replace('col-8', 'col-10')
      if (props.legend) {legendContainer.current.className = legendContainer.current.className.replace('col-4', 'col-2')}
      modalButton.current.className = modalButton.current.className.replace('fa-expand', 'fa-compress') 
      modalButton.current.className = modalButton.current.className.replace('text-light', 'text-primary')       
      setModal(true)
    }
  }

  const toggleCroshair = () => {
    if (crosshair) {
      setCrosshair(!crosshair)
      crosshairButton.current.className = crosshairButton.current.className.replace('text-primary', 'text-light')      
    } else {
      setCrosshair(!crosshair)
      crosshairButton.current.className = crosshairButton.current.className.replace('text-light', 'text-primary') 
    }
  }

  return (   
    <React.Fragment>
    <div ref={graphCard} className='card shadow-sm py-2 bg-dark text-light'>
      <div className='d-flex mb-1'>
        <h5 className="px-3 pt-1 pb-2 m-0">{props.title}</h5>
        <span className='ml-auto'></span>

        <button type="button" 
          ref={resetZoomButton} 
          className={'btn btn-link text-primary m-0 p-0 mt-1 mr-2 fas fa-search-minus d-none'} 
          style={{width: '28px', height: '28px', fontSize:'1em', textDecoration: 'none', outline: 'none', boxShadow: 'none'}} 
          onClick={null}
        ></button>

        <button type="button"
          ref={crosshairButton} 
          className={'btn btn-link text-light m-0 p-0 mt-1 mr-2 fas fa-ruler-vertical'} 
          style={{width: '28px', height: '28px', fontSize:'1em', textDecoration: 'none', outline: 'none', boxShadow: 'none'}}
          onClick={toggleCroshair}
        ></button> 

        <button type="button" 
          ref={modalButton} 
          className={'btn btn-link text-light m-0 p-0 mt-1 mr-2 fas fa-expand'} 
          style={{width: '28px', height: '28px', fontSize:'1em', textDecoration: 'none', outline: 'none', boxShadow: 'none'}} 
          onClick={toggleModal}
        ></button>  
      </div>

      { props.loading ? 
          <div className='d-flex justify-content-center'><Loader /></div> :
          <div className="row m-0 px-3 py-0 h-100 w-100">
            <div ref={graphContainer} className={`${ props.legend ? 'col-8' : 'col-12'} m-0 p-0`} style={{height: GRAPH_HEIGH}}>
              { crosshair ? 
                <GraphWithCrosshair tags={tags} resetZoomButton={resetZoomButton} /> : 
                <Graph tags={tags} resetZoomButton={resetZoomButton} /> 
              }
            </div>

            { props.legend && (
              <div ref={legendContainer} className="col-4 m-0 p-0">
                <Legend tags={tags} onClick={props.toggleCurveDisplay} height={GRAPH_HEIGH}/>
              </div>
            )}

            { props.toolbar && (
              <div className="col-12 m-0 p-0">
                <Toolbar toggleModal={toggleModal} toggleCroshair={toggleCroshair} changeGraphInterval={props.changeGraphInterval}/>
              </div>
            )}
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