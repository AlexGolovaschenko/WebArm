import React from 'react' 

export default function WidgetsAdminPage(props) {
  const updateWidgetsTemplate = props.updateWidgetsTemplate
  const widgetsTemplate = props.widgetsTemplate
  const [selectedWidget, setSelectedWidget] = React.useState(0)

  const changeSelectedWidget = (widgetNumber) => {
    setSelectedWidget(widgetNumber)
  }

  return (
    <React.Fragment>
      <h3 className='mb-3'>Настройка виджетов</h3>
      <div className='row bg-dark rounded equal p-0 m-0'>
        <div className='col-md-6 col-lg-7 col-xl-8 p-0 m-0'>
          <WidgetsGrid widgetsTemplate={widgetsTemplate} changeSelectedWidget={changeSelectedWidget}/>
          <WidgetsList widgetsTemplate={widgetsTemplate} changeSelectedWidget={changeSelectedWidget}/>
        </div>
        <div className='col-md-6 col-lg-5 col-xl-4 p-0 mx-0 my-1 bg-dark rounded'>
          <WForm widget={widgetsTemplate.widgets[selectedWidget]} />
        </div>
      </div>
    </React.Fragment>
  );
}


// -------------------------------------------------------------------------------------------------
function WidgetsGrid(props){
  const widgetsTemplate = props.widgetsTemplate
  const changeSelectedWidget = props.changeSelectedWidget
  const content = widgetsTemplate.widgets.map((widget, index)=>{
    return (
      <div key={index} className={`col-${widget.width * 3} p-1 m-0`}> 
        <button className='btn btn-dark w-100 h-100 text-left p-2' style={{overflow:'hidden', minHeight:'10vh'}} onClick={()=>{changeSelectedWidget(index)}}>
          <span className='small text-secondary'>{widget.type}</span><br/>
          <span className='small text-nowrap'>{widget.title}</span>
        </button>
      </div>
    )
  })

  return (
    <div className='d-flex justify-content-center mt-4 mb-0 mx-4 p-0' style={{}}>
      <div className='row equal rounded border border-secondary m-0 p-2' style={{backgroundColor: '#1E1E1E', maxWidth:'700px'}}>
        {content}
      </div>
    </div>
  )
} 


function WidgetsList(props){
  const widgetsTemplate = props.widgetsTemplate
  const changeSelectedWidget = props.changeSelectedWidget
  const content = widgetsTemplate.widgets.map((widget, index)=>{
    return (
      <button className='btn btn-outline-primary border-0 w-100 my-1 text-left text-light' key={index} onClick={()=>{changeSelectedWidget(index)}}>
        <i className='fas fa-circle pr-3' style={{fontSize:'0.6em'}}></i>
        <span className=''>{widget.type}: </span>
        <span className=''>{widget.title}</span>
      </button>
    )
  })

  return (
    <div className='bg-dark rounded m-1 py-2 px-3'>
      {content}
    </div>
  )
} 

// -------------------------------------------------------------------------------------------------
// function WidgetsForms(props){
//   const widgetsTemplate = props.widgetsTemplate
//   return widgetsTemplate.widgets.map((widget, index)=>{
//     return <WForm widget={widget} key={index}/>
//   })
// } 

function WForm(props){
  const widget = props.widget
  let w = {}

  if (widget.type === 'table') { w = <WTableForm widget={widget}/> }
  if (widget.type === 'graph') { w = <WGraphForm widget={widget}/> }
  if (widget.type === 'indicator') { w = <WIndicatorForm widget={widget}/> } 
  
  return (
    <div className='p-0 m-0 my-1'> 
      <FormContainer2> {w} </FormContainer2>
    </div>
  )
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

function WTableForm(props){
  const widget = props.widget
  return (
    <React.Fragment>
        <h6>Таблица</h6>
        <form>
          <TextField titel={'Название'} id={'title'} placeholder={'...'} value={widget.title}/>
          <NumberField titel={'Ширина'} id={'width'} placeholder={'...'} value={widget.width} min={1} max={4}/>
          <MultipleSelectField 
            titel={'Теги'} 
            id={'tags'} 
            placeholder={'...'} 
            value={widget.tags} 
            options={['TEMP1', 'TEMP2', 'TEMP3']} 
            comment={<span className='m-0 p-0 d-block mt-1'>Удерживайте <kbd className='text-info'>Ctrl</kbd> для выбора нескольких элементов</span>}
          />
          <MultipleSelectField 
            titel={'Колонки'} 
            id={'fields'} 
            placeholder={'...'} 
            value={widget.fields} 
            options={['#No', 'code', 'name', 'value']} 
            comment={<span className='m-0 p-0 d-block mt-1'>Удерживайте <kbd className='text-info'>Ctrl</kbd> для выбора нескольких элементов</span>}
          />          
          <button type="button" className="btn btn-sm btn-info">Применить</button>
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

function WGraphForm(props){
  const widget = props.widget
  return (
    <React.Fragment>
        <h6>График</h6>
        <form>
          <TextField titel={'Название'} id={'title'} placeholder={'...'} value={widget.title}/>
          <NumberField titel={'Ширина'} id={'width'} placeholder={'...'} value={widget.width} min={1} max={4}/>
          <MultipleSelectField 
            titel={'Теги'} 
            id={'tags'} 
            placeholder={'...'} 
            value={widget.tags} 
            options={['TEMP1', 'TEMP2', 'TEMP3']} 
            comment={<span className='m-0 p-0 d-block mt-1'>Удерживайте <kbd className='text-info'>Ctrl</kbd> для выбора нескольких элементов</span>}
          />
          <CheckboxField titel={'Легенда'} id={'legend'} value={widget.legend} />  
          <CheckboxField titel={'Панель инструментов'} id={'toolbar'} value={widget.toolbar} />  
          <button type="button" className="btn btn-sm btn-info">Применить</button>
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

function WIndicatorForm(props){
  const widget = props.widget
  return (
    <React.Fragment>
        <h6>Индикатор</h6>
        <form>
          <TextField titel={'Название'} id={'title'} placeholder={'...'} value={widget.title}/>
          <NumberField titel={'Ширина'} id={'width'} placeholder={'...'} value={widget.width} min={1} max={4}/>
          <SelectField 
            titel={'Тег'} 
            id={'tags'} 
            placeholder={'...'} 
            value={widget.tags[0]} 
            options={['TEMP1', 'TEMP2', 'TEMP3']} 
          />
          <TextField titel={'Добавить текст слева'} id={'addTextLeft'} placeholder={'...'} value={widget.addTextLeft}/>
          <TextField titel={'Добавить текст справа'} id={'addTextRight'} placeholder={'...'} value={widget.addTextRight}/>
          <button type="button" className="btn btn-sm btn-info">Применить</button>
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


// -------------------------------------------------------------------------------------------------
function TextField(props){
  // props.titel : str
  // props.placeholder : str  
  // props.id : str
  // props.value : str
  // props.comment : str or jsx
  return (
    <React.Fragment>
      <div className="form-group">
        <label htmlFor={props.id} className='text-secondary'>{props.titel}</label>
        <input 
          type="text" 
          className="form-control form-control-sm bg-secondary border-secondary text-light" 
          placeholder={props.placeholder} 
          id={props.id} 
          defaultValue={props.value}
        ></input>
        <p className='text-small text-info p-0 m-0'>{props.comment}</p>
      </div>
    </React.Fragment>
  ) 
}

function NumberField(props){
  // props.titel : str
  // props.placeholder : str  => like "12"
  // props.min : str  => like "1"
  // props.max : str  => like "5"
  // props.id : str
  // props.value : int
  // props.comment : str or jsx
  return (
    <React.Fragment>
      <div className="form-group">
        <label htmlFor={props.id} className='text-secondary'>{props.titel}</label>
        <input 
          type="number" 
          className="form-control form-control-sm bg-secondary border-secondary text-light" 
          placeholder={props.placeholder} 
          id={props.id} 
          defaultValue={props.value}
          min={props.min}
          max={props.max}
        ></input>
        <p className='text-small text-info p-0 pt-1 m-0'>{props.comment}</p>        
      </div>
    </React.Fragment>
  ) 
}

function SelectField(props){
  // props.titel : str
  // props.placeholder : str
  // props.options : []
  // props.id : str
  // props.value : int
  // props.comment : str or jsx
  return (
    <React.Fragment>
      <div className="form-group">
        <label htmlFor={props.id} className='text-secondary'>{props.titel}</label>
        <select 
          className="form-control form-control-sm bg-secondary border-secondary text-light" 
          id={props.id} 
          placeholder={props.placeholder} 
          defaultValue={props.value}
        >
          {props.options && props.options.map((option, index)=>{
            return <option key={index}>{option}</option>
          })}
        </select>
        <p className='text-small text-info p-0 m-0'>{props.comment}</p>
      </div>
    </React.Fragment>
  ) 
}

function MultipleSelectField(props){
  // props.titel : str
  // props.placeholder : str
  // props.options : []
  // props.id : str
  // props.value : int
  // props.comment : str or jsx
  return (
    <React.Fragment>
      <div className="form-group">
        <label htmlFor={props.id} className='text-secondary'>{props.titel}</label>
        <select 
          multiple 
          className="form-control form-control-sm bg-secondary border-secondary text-light" 
          id={props.id} 
          placeholder={props.placeholder} 
          defaultValue={props.value}
        >
          {props.options && props.options.map((option, index)=>{
            return <option key={index}>{option}</option>
          })}
        </select>
        <p className='text-small text-info p-0 m-0'>{props.comment}</p>
      </div>
    </React.Fragment>
  ) 
}

function CheckboxField(props){
  // props.titel : str
  // props.id : str
  // props.value : boolean
  // props.comment : str or jsx
  return (
    <React.Fragment>
      <div className="form-check pb-3">
        <input type="checkbox" className="form-check-input" id={props.id} defaultValue={props.value}></input>
        <span>{props.titel}</span>
        <p className='text-small text-info p-0 m-0'>{props.comment}</p>
      </div>
    </React.Fragment>
  ) 
}

function InlineCheckboxField(props){
  // props.titel : str
  // props.id : str
  // props.value : boolean
  // props.comment : str or jsx
  return (
    <React.Fragment>
      <div className="form-check-inline pb-3">
        <input type="checkbox" className="form-check-input" id={props.id} defaultValue={props.value}></input>
        <span>{props.titel}</span>
        <p className='text-small text-info p-0 m-0'>{props.comment}</p>
      </div>
    </React.Fragment>
  ) 
}