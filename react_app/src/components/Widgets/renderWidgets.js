import React from 'react' 

import WidgetGraph from './WidgetGraph'
import WidgetTable from './WidgetTable'




export default function RenderWidgets(props) {
  const widgets_template = props.widgets_template
  const device_id = props.device_id
  if (!props.widgets_template) {return null}

  return (
    <React.Fragment>
      <div className='container-fluid row p-0 m-0'>
      {
        widgets_template.widgets.map((widget, index)=>{
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
      <div className={`col-xl-${widget.size * 3} col-lg-${Math.min(widget.size * 6, 12)} col-md-12 p-1 m-0`}>
        <WidgetTable device_id={device_id}/>
      </div>
    )
  }

  if (widget.type === 'graph') {
    return (
      <div className={`col-xl-${widget.size * 3} col-lg-${Math.min(widget.size * 6, 12)} col-md-12 p-1 m-0`}>
        <WidgetGraph device_id={device_id} legend={widget.legend} toolbar={widget.toolbar}/>
      </div>
    )    
  }   
   
}
