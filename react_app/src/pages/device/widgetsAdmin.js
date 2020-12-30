import React, {useEffect} from 'react' 

import {
  TextField,
  NumberField,
  SelectField,
  MultipleSelectField,
  CheckboxField,
} from '../../components/Forms/Forms'

export default function WidgetsAdminPage(props) {
  const updateWidgetsTemplate = props.updateWidgetsTemplate
  const [widgetsTemplate, setWidgetsTemplate] = React.useState(props.widgetsTemplate)
  const [selectedWidget, setSelectedWidget] = React.useState(0)

  const changeSelectedWidget = (widgetNumber) => {
    setSelectedWidget(widgetNumber)
  }

  const updateWidget = (WidgetData) => {
    const wt = widgetsTemplate.widgets.map((w, index)=>{
      if (index === selectedWidget) {
        return WidgetData
      } else {
        return w
      }
    })
    updateWidgetsTemplate({widgets: wt})
  }

  const addWidgetToTemplate = (widget) => {
    var a = widgetsTemplate.widgets.map((item)=>{return item})
    a.push(widget)
    setWidgetsTemplate({widgets: a})
    updateWidgetsTemplate({widgets: a})    
  }

  const addWidgetHendler = (type) => {
    if (type === 'table') { 
      addWidgetToTemplate({
        type: 'table',
        width: 4,
        title: 'Новая таблица',
        tags: [],   
        fields: []               
      })

    } else if (type === 'graph') {
      addWidgetToTemplate({
        type: 'graph',
        width: 4,
        title: 'Новый график',
        tags: [],
        legend: false,
        toolbar: true,              
      })

    } else if (type === 'indicator') {
      addWidgetToTemplate({
        type: 'indicator',
        width: 1,
        title: 'Новый индикатор',
        tags: [],               
      })
    }
  }

  // I use it for fix bug: witout this, when I change the same type forms, 
  // form fields data does not changing 
  // if i hide and show the form, fields data update correctly
  const [displayWidget, setDisplayWidget] = React.useState(false) 
  useEffect(() => {
    setDisplayWidget(false)
    setTimeout( () => { setDisplayWidget(true) }, 0);
  }, [selectedWidget])  

  return (
    <React.Fragment>
      <h3 className='mb-3'>Настройка виджетов</h3>
      <div className='row equal p-0 m-0'>
        <div className='col-md-6 col-lg-7 col-xl-8 px-1' style={{minHeight: '80vh'}}>
          <div className='p-0 m-0 bg-dark rounded h-100'>
            <WidgetsGrid widgetsTemplate={widgetsTemplate} selectedWidget={selectedWidget} changeSelectedWidget={changeSelectedWidget}/>
          </div>
        </div>
        <div className='col-md-6 col-lg-5 col-xl-4 px-1' style={{minHeight: '80vh'}}>
          <div className='p-0 m-0 bg-dark rounded h-100'>
            <WidgetsControlPanel addWidget={addWidgetHendler}/>
            { displayWidget ? 
              <WidgetForm widget={widgetsTemplate.widgets[selectedWidget]} updateWidget={updateWidget} /> 
              : null }
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}


// -------------------------------------------------------------------------------------------------
function WidgetsGrid(props){
  const widgetsTemplate = props.widgetsTemplate
  const selectedWidget = props.selectedWidget
  const changeSelectedWidget = props.changeSelectedWidget

  const WidgetPreview = (props) => {
    const widget = props.widget

    if (widget.type === 'table') {
      return (
        <div className='d-flex justify-content-center'>
          <span className='fas fa-table text-secondary m-2' style={{fontSize:'4em'}}></span>
        </div>
      )
    } else if (widget.type === 'graph') {
      return (
        <div className='d-flex justify-content-center'>
          <span className='fas fa-chart-area text-secondary m-2' style={{fontSize:'4em'}}></span>
        </div>
        )
    } else if (widget.type === 'indicator') {
      return (
        <div className='d-flex justify-content-center'>
          <span className='border rounded-sm text-secondary border-secondary text-nowrap m-2 px-2' style={{fontSize:'1.5em'}}>{widget.addTextLeft} XX.X {widget.addTextRight}</span>
        </div>
        )
    } else {
      return null
    }   
  }

  const content = widgetsTemplate.widgets.map((widget, index)=>{
    const btnAddClass= (index===selectedWidget) ?  'border-primary' : ''
    return (
      <div key={index} className={`col-${widget.width * 3} p-1 m-0`}> 
        <button className={'btn btn-dark w-100 h-100 text-left p-0 ' + btnAddClass} style={{overflow:'hidden', minHeight:'10vh', boxShadow: 'none'}} onClick={()=>{changeSelectedWidget(index)}}>
          <div className='h-100 p-0 px-2'>
            <span className='small text-nowrap'>{widget.title}</span>
            <WidgetPreview widget={widget} />
          </div>
        </button>
      </div>
    )
  })

  return (
    <div className='d-flex justify-content-center m-0 p-4' style={{}}>
      <div className='row equal rounded border border-secondary m-0 p-2' style={{backgroundColor: '#1E1E1E', maxWidth:'700px'}}>
        {content}
      </div>
    </div>
  )
} 


// function WidgetsList(props){
//   const widgetsTemplate = props.widgetsTemplate
//   const selectedWidget = props.selectedWidget
//   const changeSelectedWidget = props.changeSelectedWidget

//   const WidgetIcon = (props) => {
//     if (props.type === 'table') { return <i className='fas fa-table pr-3' style={{fontSize:'1.3em'}}></i> }
//     if (props.type === 'graph') { return <i className='fas fa-chart-area pr-3' style={{fontSize:'1.3em'}}></i> }
//     if (props.type === 'indicator') { return <i className='	fas fa-ticket-alt pr-3' style={{fontSize:'1.2em'}}></i> }     
//   }

//   const content = widgetsTemplate.widgets.map((widget, index)=>{
//     const btnAddClass = (index===selectedWidget) ? 'btn-primary' : 'btn-outline-primary'
//     return (
//       <button className={'btn border-0 w-100 my-1 text-left text-light ' + btnAddClass} style={{boxShadow: 'none'}} key={index} onClick={()=>{changeSelectedWidget(index)}}>
//         <WidgetIcon type={widget.type} />
//         <span className=''>{widget.title}</span>
//       </button>
//     )
//   })

//   return (
//     <div className='bg-dark ml-1 mr-0 py-2 px-3 border-top border-secondary mt-3'>
//       {content}
//     </div>
//   )
// } 

// -------------------------------------------------------------------------------------------------
function WidgetForm(props){
  const widget = props.widget
  const updateWidget = props.updateWidget
  let w = {}

  if (widget.type === 'table') { w = <WTableForm widget={widget} updateWidget={updateWidget}/> }
  if (widget.type === 'graph') { w = <WGraphForm widget={widget} updateWidget={updateWidget}/> }
  if (widget.type === 'indicator') { w = <WIndicatorForm widget={widget} updateWidget={updateWidget}/> } 
  
  return (
    <div className='p-0 m-0 my-1'> 
      <FormContainer2> {w} </FormContainer2>
    </div>
  )
}


function WidgetsControlPanel(props){
  const [show, setShow] = React.useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleAddWidget = (type) => {
    props.addWidget(type);
    handleClose();
  }

  return (
    <>
      <div className='p-2'> 
        <div className='m-1 pt-2 pb-3 border-bottom border-secondary'>
          <button className='btn btn-outline-primary' type='button' onClick={handleShow}>Добавить виджет</button>
        </div>
      </div>
      <ModalSelectWidgetType show={show} handleClose={handleClose} handleAddWidget={handleAddWidget}/>
    </>
  )
}


function ModalSelectWidgetType(props){
  if (props.show) {
    return(
      <div className="modal modal-bg d-block">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title">Добавить новый виджет</h4>
              <button type="button" className="close" onClick={props.handleClose}>&times;</button>
            </div>
            <div className="modal-body">
              <div className='row px-1'>
                <div className='col-4 px-1 w-100'>
                  <button type="button" className="btn btn-outline-primary w-100" onClick={()=> props.handleAddWidget('indicator')}>Индикатор</button>
                </div>
                <div className='col-4 px-1 w-100'>
                  <button type="button" className="btn btn-outline-primary w-100" onClick={()=> props.handleAddWidget('table')}>Таблица</button>
                </div>
                <div className='col-4 px-1 w-100'>
                  <button type="button" className="btn btn-outline-primary w-100" onClick={()=> props.handleAddWidget('graph')}>График</button>
                </div>  
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-danger" onClick={props.handleClose}>Отмена</button>
            </div>
          </div>
        </div>
      </div>
    )
  } else {
    return null
  }
}


// -------------------------------------------------------------------------------------------------
// function FormContainer(props){
//   return (
//     <div className='card shadow-sm bg-dark text-light p-2 m-0 mx-1 h-100'>
//       {props.children}
//     </div>
//   )
// }

function FormContainer2(props){
  return (
    <div className='text-light p-2 m-0 mx-1 h-100'>
      {props.children}
    </div>
  )
}


// ----------------------------------------------------------------------------------
function WTableForm(props){
  const [widget, setWidget] = React.useState({...props.widget})
  const updateWidget = props.updateWidget

  const updateButton = (e) => {
    e.preventDefault()
    updateWidget({...widget})
  }

  const handlTitleChange = (e) => { setWidget({...widget, title: e.target.value}) }
  const handlWidthChange = (e) => { setWidget({...widget, width: e.target.value}) }
  const handlSelectedTagsChange = (e) => { setWidget({...widget, tags: getSelectedOptions(e)}) }
  const handlSelectedFieldsChange = (e) => { setWidget({...widget, fields: getSelectedOptions(e)}) }

  return (
    <React.Fragment>
        <h6>Таблица</h6>
        <form>
          <TextField titel={'Название'} id={'title'} placeholder={'...'} value={widget.title} onChange={handlTitleChange}/>
          <NumberField titel={'Ширина'} id={'width'} placeholder={'...'} value={widget.width} min={1} max={4} onChange={handlWidthChange}/>
          <MultipleSelectField 
            titel={'Теги'} 
            id={'tags'} 
            placeholder={'...'} 
            value={widget.tags} 
            options={['TEMP1', 'TEMP2', 'TEMP3']} 
            comment={<span className='m-0 p-0 d-block mt-1'>Удерживайте <kbd className='text-info'>Ctrl</kbd> для выбора нескольких элементов</span>}
            onChange={handlSelectedTagsChange}
          />
          <MultipleSelectField 
            titel={'Колонки'} 
            id={'fields'} 
            placeholder={'...'} 
            value={widget.fields} 
            options={['#No', 'code', 'name', 'value']} 
            comment={<span className='m-0 p-0 d-block mt-1'>Удерживайте <kbd className='text-info'>Ctrl</kbd> для выбора нескольких элементов</span>}
            onChange={handlSelectedFieldsChange}
          />          
          <button type="submit" className="btn btn-sm btn-info" onClick={updateButton}>Применить</button>
        </form>
    </React.Fragment>
  )
}

// {
//   type: 'table',
//   width: 2,
//   title: 'Таблица параметров 2',
//   tags: ['TEMP1', 'TEMP2', 'TEMP3'],   
//   fields: ['#No', 'code', 'name', 'value']              
// }


// ----------------------------------------------------------------------------------
function WGraphForm(props){
  const [widget, setWidget] = React.useState({...props.widget})
  const updateWidget = props.updateWidget

  const updateButton = (e) => {
    e.preventDefault()
    updateWidget({...widget})
  }

  const handlTitleChange = (e) => { setWidget({...widget, title: e.target.value}) }
  const handlWidthChange = (e) => { setWidget({...widget, width: e.target.value}) }
  const handlSelectedTagsChange = (e) => { setWidget({...widget, tags: getSelectedOptions(e)}) }
  const handlLegendChange = (e) => { setWidget({...widget, legend: e.target.checked}) }
  const handlToolbarChange = (e) => { setWidget({...widget, toolbar: e.target.checked}) }

  return (
    <React.Fragment>
      <h6>График</h6>
      <form>
        <TextField titel={'Название'} id={'title'} placeholder={'...'} value={widget.title} onChange={handlTitleChange}/>
        <NumberField titel={'Ширина'} id={'width'} placeholder={'...'} value={widget.width} min={1} max={4} onChange={handlWidthChange}/>
        <MultipleSelectField 
          titel={'Теги'} 
          id={'tags'} 
          placeholder={'...'} 
          value={widget.tags} 
          options={['TEMP1', 'TEMP2', 'TEMP3']} 
          comment={<span className='m-0 p-0 d-block mt-1'>Удерживайте <kbd className='text-info'>Ctrl</kbd> для выбора нескольких элементов</span>}
          onChange={handlSelectedTagsChange}
        />
        <CheckboxField titel={'Легенда'} id={'legend'} checked={widget.legend} onChange={handlLegendChange}/>  
        <CheckboxField titel={'Панель инструментов'} id={'toolbar'} checked={widget.toolbar} onChange={handlToolbarChange}/>  
        <button type="submit" className="btn btn-sm btn-info" onClick={updateButton}>Применить</button>
      </form>
    </React.Fragment>
  )
}

// {
//   type: 'graph',
//   width: 2,
//   title: 'Влажность',
//   tags: ['RH1', 'RH2'],
//   legend: true,
//   toolbar: true,
// }  


// ----------------------------------------------------------------------------------
function WIndicatorForm(props){
  const [widget, setWidget] = React.useState({...props.widget})
  const updateWidget = props.updateWidget

  const updateButton = (e) => {
    e.preventDefault()
    updateWidget({...widget})
  }

  const handlTitleChange = (e) => { setWidget({...widget, title: e.target.value}) }
  const handlWidthChange = (e) => { setWidget({...widget, width: e.target.value}) }
  const handlTextLeftChange = (e) => { setWidget({...widget, addTextLeft: e.target.value}) }
  const handlTextRightChange = (e) => { setWidget({...widget, addTextRight: e.target.value}) }

  return (
    <React.Fragment>
        <h6>Индикатор</h6>
        <form>
          <TextField titel={'Название'} id={'title'} placeholder={'...'} value={widget.title} onChange={handlTitleChange}/>
          <NumberField titel={'Ширина'} id={'width'} placeholder={'...'} value={widget.width} min={1} max={4} onChange={handlWidthChange}/>
          <SelectField 
            titel={'Тег'} 
            id={'tags'} 
            placeholder={'...'} 
            value={widget.tags[0]} 
            options={['TEMP1', 'TEMP2', 'TEMP3']} 
          />
          <TextField titel={'Добавить текст слева'} id={'addTextLeft'} placeholder={'...'} value={widget.addTextLeft} onChange={handlTextLeftChange}/>
          <TextField titel={'Добавить текст справа'} id={'addTextRight'} placeholder={'...'} value={widget.addTextRight} onChange={handlTextRightChange}/>
          <button type="submit" className="btn btn-sm btn-info" onClick={updateButton}>Применить</button>
        </form>        
    </React.Fragment>
  )
}

// {
//   type: 'indicator',
//   width: 1,
//   title: 'Температура зоны 1',
//   addTextLeft: '',
//   addTextRight: '°C',      
//   tags: ['PT1'],                
// }


function getSelectedOptions(e) {
  var options = e.target.options;
  var value = [];
  for (var i = 0, l = options.length; i < l; i++) {
    if (options[i].selected) {
      value.push(options[i].value);
    }
  }  
  return value
}