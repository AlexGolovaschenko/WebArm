import React from 'react';
import PropTypes from 'prop-types'
import Graph from './Graph'
import GraphWithCrosshair from './GraphWithCrosshair'
import Legend from './Legend'
import Toolbar from './Toolbar'
import Loader from '../../components/BaseParts/Loader'


function TagsHistoricalGraph(props) {
  const [modal, setModal] = React.useState(false) // use this just for force update graph component
  const [crosshair, setCrosshair] = React.useState(false)
  const graphCard = React.useRef(null)
  const graphContainer = React.useRef(null)
  const legendContainer = React.useRef(null)
  const tags = props.tagsHistory  

  const toggleModal = () => {
    const cl = ' full-screen-card'
    if (graphCard.current.className.includes(cl)) {
      graphCard.current.className = graphCard.current.className.replace(cl, '')
      graphContainer.current.style.height = '400px'
      graphContainer.current.className = graphContainer.current.className.replace('col-10', 'col-8')
      if (props.legend) {legendContainer.current.className = legendContainer.current.className.replace('col-2', 'col-4')}
      setModal(false)
    } else {
      graphCard.current.className += cl
      graphContainer.current.style.height = '90%'
      graphContainer.current.className = graphContainer.current.className.replace('col-8', 'col-10')
      if (props.legend) {legendContainer.current.className = legendContainer.current.className.replace('col-4', 'col-2')}          
      setModal(true)
    }
  }

  const toggleCroshair = () => {
    setCrosshair(!crosshair)
  }

  return (   
    <React.Fragment>
    <div ref={graphCard} className='card shadow-sm px-3 py-2 bg-dark text-light'>
      <h5 className="p-0 m-0 pb-2">{props.title}</h5>
      { props.loading ? 
          <Loader /> :
          <div className="row m-0 p-0  h-100 w-100">
            <div ref={graphContainer} className={`${ props.legend ? 'col-8' : 'col-12'} m-0 p-0`} style={{height:'400px'}}>
              { crosshair ? 
                <GraphWithCrosshair tags={tags} disabledGraphs={props.disabledGraphs} /> : 
                <Graph tags={tags} disabledGraphs={props.disabledGraphs} /> 
              }
            </div>

            { props.legend && (
              <div ref={legendContainer} className="col-4 m-0 p-0">
                <Legend tags={tags} disabledGraphs={props.disabledGraphs} onClick={props.toggleCurveDisplay} />
              </div>
            )}

            { props.toolbar && (
              <div className="col-12 m-0 p-0">
                <Toolbar toggleModal={toggleModal} toggleCroshair={toggleCroshair}/>
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