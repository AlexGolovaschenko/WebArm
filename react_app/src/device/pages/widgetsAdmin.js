import React, {useEffect} from 'react' 

import {
  TextField,
  NumberField,
  SelectField,
  MultipleSelectField,
  CheckboxField,
} from '../../base/forms/forms'

import sortWidgetsByOrder from '../utils/sortWidgetsByOrder'

import Loader from '../../base/components/Loader'
import axiosInstance from "../../utils/axiosApi";
import getBaseUrl from '../../utils/localSettings'
const BASE_URL = getBaseUrl()

export default function WidgetsAdminPage(props) {
  const device_id = props.device_id;
  const updateWidgetsTemplate = props.updateWidgetsTemplate
  const [widgetsTemplate, setWidgetsTemplate] = React.useState( sortWidgetsByOrder(props.widgetsTemplate) )
  const [selectedWidget, setSelectedWidget] = React.useState(0)
  const [tags, setTags] = React.useState([])

  // read tags list
  const readDeviceTags = () => {
    axiosInstance.get(BASE_URL + "/device/tags/value/", { params: { id: device_id }} )
    .then((responce) => {
      responce && setTags(responce.data)
    })  
  }
  useEffect(() => {
    readDeviceTags();
  }, [])


  // I use it for fix bug: witout this, when I change the same type forms, 
  // form fields data does not changing 
  // if i hide and show the form, fields data update correctly
  const [displayWidget, setDisplayWidget] = React.useState(false) 
  const rerenderWidgetForm = () => {
    setDisplayWidget(false)
    setTimeout( () => { setDisplayWidget(true) }, 0);
  }
  useEffect(() => {
    rerenderWidgetForm()
  }, [selectedWidget, tags])  


  // control buttons
  const changeSelectedWidget = (widgetNumber) => {
    setSelectedWidget(widgetNumber)
  }

  const saveWidgetsTemplate = () => {
    updateWidgetsTemplate(widgetsTemplate)
  }

  const cancelTemplateChanges = () => {
    setWidgetsTemplate( sortWidgetsByOrder(props.widgetsTemplate) )
    setSelectedWidget(0)
    rerenderWidgetForm()
  }

  const deleteWidget = (index) => {
    const wt = widgetsTemplate.widgets.map((w)=>{return w})
    wt.splice(index, 1)
    setWidgetsTemplate({widgets: wt})
    setSelectedWidget(0)
  }

  // update widget config
  const updateWidget = (WidgetData) => {
    const wt = widgetsTemplate.widgets.map((w, index)=>{
      if (index === selectedWidget) {
        return WidgetData
      } else {
        return w
      }
    })
    setWidgetsTemplate({widgets: wt})
  }

  // const onChangeWidgetOrder = (w_index, new_order) => {
  //   // TODO
  //   ;
  // }

  // add new widget
  const addWidgetToTemplate = (widget) => {
    var a = widgetsTemplate.widgets.map((item)=>{return item})
    a.push(widget)
    setWidgetsTemplate({widgets: a})   
  }

  const addWidgetHendler = (type) => {
    if (type === 'table') { addWidgetToTemplate(DefaultTable) } 
    else if (type === 'graph') { addWidgetToTemplate(DefaultGraph) }
    else if (type === 'indicator') { addWidgetToTemplate(DefaultIndicator) }
  }

  if (!widgetsTemplate.widgets) {return <Loader />}

  // render page
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
            <WidgetsControlPanel addWidget={addWidgetHendler} saveWidgetsTemplate={saveWidgetsTemplate} cancelChanges={cancelTemplateChanges}/>
            { displayWidget ? 
              <WidgetForm widget={widgetsTemplate.widgets[selectedWidget]} tags={tags} updateWidget={updateWidget} deleteWidget={()=>deleteWidget(selectedWidget)}/> 
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

  if (!widgetsTemplate.widgets) {return <Loader />}

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
      <div className='row equal rounded m-0 p-3' style={{backgroundColor: '#1E1E1E', maxWidth:'800px'}}>
        {content}
      </div>
    </div>
  )
} 


const WidgetPreview = (props) => {
  const widget = props.widget
  const color = props.color ? props.color : 'secondary'

  if (widget.type === 'table') {
    return (
      <div className='d-flex justify-content-center'>
        <span className={`fas fa-table text-${color} m-2`} style={{fontSize:'4em'}}></span>
      </div>
    )
  } else if (widget.type === 'graph') {
    return (
      <div className='d-flex justify-content-center'>
        <span className={`fas fa-chart-area text-${color} m-2`} style={{fontSize:'4em'}}></span>
      </div>
      )
  } else if (widget.type === 'indicator') {
    return (
      <div className='d-flex justify-content-center'>
        <span className={`border rounded-sm text-${color} border-${color} text-nowrap m-2 px-2`} style={{fontSize:'1.5em'}}>{widget.addTextLeft} XX.X {widget.addTextRight}</span>
      </div>
      )
  } else {
    return null
  }   
}


// -------------------------------------------------------------------------------------------------
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
          <div className='d-flex justify-content-left'>
            <button className='btn btn-outline-info btn-sm mr-3' type='button' onClick={handleShow}> Добавить виджет</button>
            <button className='btn btn-outline-success btn-sm mr-3' type='button' onClick={props.saveWidgetsTemplate}>Сохранить</button>
            <button className='btn btn-outline-danger btn-sm' type='button' onClick={props.cancelChanges}>Отмена</button>
          </div>
        </div>
      </div>
      <ModalSelectWidgetType show={show} handleClose={handleClose} handleAddWidget={handleAddWidget}/>
    </>
  )
}


function WidgetForm(props){
  const widget = props.widget
  const tags = props.tags
  const updateWidget = props.updateWidget
  const deleteWidget = props.deleteWidget
  let w = {}

  if (! widget) {return null}

  if (widget.type === 'table') { w = <WTableForm widget={widget} tags={tags} updateWidget={updateWidget} deleteWidget={deleteWidget}/> }
  if (widget.type === 'graph') { w = <WGraphForm widget={widget} tags={tags} updateWidget={updateWidget} deleteWidget={deleteWidget}/> }
  if (widget.type === 'indicator') { w = <WIndicatorForm widget={widget} tags={tags} updateWidget={updateWidget} deleteWidget={deleteWidget}/> } 
  
  return (
    <div className='p-0 m-0 my-1'> 
      <FormContainer> {w} </FormContainer>
    </div>
  )
}


function FormContainer(props){
  return (
    <div className='text-light p-2 m-0 mx-1 h-100'>
      {props.children}
    </div>
  )
}


// -------------------------------------------------------------------------------------------------
function ModalSelectWidgetType(props){
  const WidgetTypeButton = (props) => {
    return (
      <div className='col-4 p-1 w-100'>
        <button type="button" className="btn btn-primary w-100 h-100" onClick={props.onClick}>
          <div className='h-100 p-0 px-2'>
            {props.children}
          </div>
        </button>
      </div>
    )
  }

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
              <div className='row equal px-1'>
                <WidgetTypeButton onClick={()=> props.handleAddWidget('indicator')}>
                  <span className='text-nowrap'>Индикатор</span>
                  <div className='pt-2'></div>
                  <WidgetPreview widget={{type:'indicator'}} color={'light'} />
                </WidgetTypeButton>
                <WidgetTypeButton onClick={()=> props.handleAddWidget('table')}>
                  <span className='text-nowrap'>Таблица</span>
                  <WidgetPreview widget={{type:'table'}} color={'light'} />
                </WidgetTypeButton>
                <WidgetTypeButton onClick={()=> props.handleAddWidget('graph')}>
                  <span className='text-nowrap'>График</span>
                  <WidgetPreview widget={{type:'graph'}} color={'light'} />
                </WidgetTypeButton>  
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
function WTableForm(props){
  const widget = props.widget
  const tags = props.tags
  const updateWidget = props.updateWidget
  const columnOptions = ['#No', 'code', 'name', 'value']
  let tagsOptions = []

  if (tags) {
    tagsOptions = tags.map((tag)=>{
      return tag.code
    })
  }

  const handlTitleChange = (e) => { updateWidget({...widget, title: e.target.value}) }
  const handlOrderChange = (e) => { updateWidget({...widget, order: e.target.value}) }
  const handlWidthChange = (e) => { updateWidget({...widget, width: e.target.value}) }
  const handlSelectedTagsChange = (e) => { updateWidget({...widget, tags: getSelectedOptions(e)}) }
  const handlSelectedFieldsChange = (e) => { updateWidget({...widget, fields: getSelectedOptions(e)}) }

  return (
    <React.Fragment>
      <div className='d-flex'>
        <h6>Таблица</h6>
        <button type="button" className="btn btn-sm btn-outline-danger ml-auto" onClick={props.deleteWidget}>Удалить</button>
      </div>
      <form>
        <TextField titel={'Название'} id={'title'} placeholder={'...'} value={widget.title} onChange={handlTitleChange}/>
        <NumberField titel={'Порядок отображения'} id={'order'} placeholder={'...'} value={widget.order} onChange={handlOrderChange}/>
        <NumberField titel={'Ширина'} id={'width'} placeholder={'...'} value={widget.width} min={1} max={4} onChange={handlWidthChange}/>
        <MultipleSelectField 
          titel={'Теги'} 
          id={'tags'} 
          placeholder={'...'} 
          value={widget.tags} 
          options={tagsOptions} 
          comment={<span className='m-0 p-0 d-block mt-1'>Удерживайте <kbd className='text-info'>Ctrl</kbd> для выбора нескольких элементов</span>}
          onChange={handlSelectedTagsChange}
        />
        <MultipleSelectField 
          titel={'Колонки'} 
          id={'fields'} 
          placeholder={'...'} 
          value={widget.fields} 
          options={columnOptions} 
          comment={<span className='m-0 p-0 d-block mt-1'>Удерживайте <kbd className='text-info'>Ctrl</kbd> для выбора нескольких элементов</span>}
          onChange={handlSelectedFieldsChange}
        />          
      </form>
    </React.Fragment>
  )
}

// table config example
// {
//   type: 'table',
//   width: 2,
//   title: 'Таблица параметров 2',
//   tags: ['TEMP1', 'TEMP2', 'TEMP3'],   
//   fields: ['#No', 'code', 'name', 'value']              
// }


// ----------------------------------------------------------------------------------
function WGraphForm(props){
  const widget = props.widget
  const tags = props.tags
  const updateWidget = props.updateWidget
  let tagsOptions = []

  if (tags) {
    tagsOptions = tags.map((tag)=>{
      return tag.code
    })
  }

  const handlTitleChange = (e) => { updateWidget({...widget, title: e.target.value}) }
  const handlOrderChange = (e) => { updateWidget({...widget, order: e.target.value}) }
  const handlWidthChange = (e) => { updateWidget({...widget, width: e.target.value}) }
  const handlSelectedTagsChange = (e) => { updateWidget({...widget, tags: getSelectedOptions(e)}) }
  const handlLegendChange = (e) => { updateWidget({...widget, legend: e.target.checked}) }
  const handlToolbarChange = (e) => { updateWidget({...widget, toolbar: e.target.checked}) }

  return (
    <React.Fragment>
      <div className='d-flex'>
        <h6>График</h6>
        <button type="button" className="btn btn-sm btn-outline-danger ml-auto" onClick={props.deleteWidget}>Удалить</button>
      </div>
      <form>
        <TextField titel={'Название'} id={'title'} placeholder={'...'} value={widget.title} onChange={handlTitleChange}/>
        <NumberField titel={'Порядок отображения'} id={'order'} placeholder={'...'} value={widget.order} onChange={handlOrderChange}/>
        <NumberField titel={'Ширина'} id={'width'} placeholder={'...'} value={widget.width} min={1} max={4} onChange={handlWidthChange}/>
        <MultipleSelectField 
          titel={'Теги'} 
          id={'tags'} 
          placeholder={'...'} 
          value={widget.tags} 
          options={tagsOptions} 
          comment={<span className='m-0 p-0 d-block mt-1'>Удерживайте <kbd className='text-info'>Ctrl</kbd> для выбора нескольких элементов</span>}
          onChange={handlSelectedTagsChange}
        />
        <CheckboxField titel={'Легенда'} id={'legend'} checked={widget.legend} onChange={handlLegendChange}/>  
        <CheckboxField titel={'Панель инструментов'} id={'toolbar'} checked={widget.toolbar} onChange={handlToolbarChange}/>  
      </form>
    </React.Fragment>
  )
}

// graph config example
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
  const widget = props.widget
  const tags = props.tags
  const updateWidget = props.updateWidget
  let tagsOptions = []

  if (tags) {
    tagsOptions = tags.map((tag)=>{
      return tag.code
    })
  }

  const handlTitleChange = (e) => { updateWidget({...widget, title: e.target.value}) }
  const handlOrderChange = (e) => { updateWidget({...widget, order: e.target.value}) }
  const handlWidthChange = (e) => { updateWidget({...widget, width: e.target.value}) }
  const handlSelectedTagsChange = (e) => { updateWidget({...widget, tags: getSelectedOptions(e)}) }  
  const handlPrecisionChange = (e) => { updateWidget({...widget, precision: e.target.value}) }  
  const handlTextLeftChange = (e) => { updateWidget({...widget, addTextLeft: e.target.value}) }
  const handlTextRightChange = (e) => { updateWidget({...widget, addTextRight: e.target.value}) }

  return (
    <React.Fragment>
      <div className='d-flex'>
        <h6>Индикатор</h6>
        <button type="button" className="btn btn-sm btn-outline-danger ml-auto" onClick={props.deleteWidget}>Удалить</button>
      </div>
      <form>
        <TextField titel={'Название'} id={'title'} placeholder={'...'} value={widget.title} onChange={handlTitleChange}/>
        <NumberField titel={'Порядок отображения'} id={'order'} placeholder={'...'} value={widget.order} onChange={handlOrderChange}/>
        <NumberField titel={'Ширина'} id={'width'} placeholder={'...'} value={widget.width} min={1} max={4} onChange={handlWidthChange}/>
        <SelectField 
          titel={'Тег'} 
          id={'tags'} 
          placeholder={'...'} 
          value={widget.tags[0]} 
          options={tagsOptions} 
          onChange={handlSelectedTagsChange}          
        />
        <NumberField titel={'Количество знаков после запятой'} id={'precision'} placeholder={'...'} value={widget.precision} min={0} max={5} onChange={handlPrecisionChange}/>
        <TextField titel={'Добавить текст слева'} id={'addTextLeft'} placeholder={'...'} value={widget.addTextLeft} onChange={handlTextLeftChange}/>
        <TextField titel={'Добавить текст справа'} id={'addTextRight'} placeholder={'...'} value={widget.addTextRight} onChange={handlTextRightChange}/>
      </form>        
    </React.Fragment>
  )
}

// indicator config example
// {
//   type: 'indicator',
//   width: 1,
//   title: 'Температура зоны 1',
//   addTextLeft: '',
//   addTextRight: '°C',      
//   tags: ['PT1'],                
// }




// ----------------------------------------------------------------------------------
// utils

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


const DefaultTable = {
  type: 'table',
  width: 4,
  title: 'Новая таблица',
  tags: [],   
  fields: []               
}

const DefaultGraph = {
  type: 'graph',
  width: 4,
  title: 'Новый график',
  tags: [],
  legend: false,
  toolbar: true,              
}

const DefaultIndicator = {
  type: 'indicator',
  width: 1,
  title: 'Новый индикатор',
  tags: [],          
  precision: 1,     
}