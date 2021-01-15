import React from 'react' 

import WidgetGraph from './WidgetGraph'
import WidgetTable from './WidgetTable'
import WidgetIndicator from './WidgetIndicator' 



export default function RenderWidgets(props) {
  const widgetsTemplate = props.widgetsTemplate
  const device_id = props.device_id
  if (!props.widgetsTemplate) {return null}
  if (!props.widgetsTemplate.widgets) {return null}

  return (
    <React.Fragment>
      <div className='container-fluid row equal p-0 m-0'>
      {
        widgetsTemplate.widgets.map((widget, index)=>{
          return <WidgetRender widget={widget} device_id={device_id} key={index} />
        })
      }
      </div>
    </React.Fragment>
  )
}


function WidgetRender(props) {
  const widget = props.widget
  const device_id = props.device_id

  if (widget.type === 'table') {
    return (
      <div className={`col-xl-${widget.width * 3} col-lg-${Math.min(widget.width * 6, 12)} col-md-12 p-1 m-0`}>
        <WidgetTable device_id={device_id} widget={widget}/>
      </div>
    )
  }

  if (widget.type === 'graph') {
    return (
      <div className={`col-xl-${widget.width * 3} col-lg-${Math.min(widget.width * 6, 12)} col-md-12 p-1 m-0`}>
        <WidgetGraph device_id={device_id} widget={widget}/>
      </div>
    )    
  }   

  if (widget.type === 'indicator') {
    return (
      <div className={`col-xl-${widget.width * 3} col-lg-${Math.min(widget.width * 6, 12)} col-md-12 p-1 m-0`}>
        <WidgetIndicator device_id={device_id} widget={widget}/>
      </div>
    )    
  }    
}
