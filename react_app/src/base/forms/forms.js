import React from 'react' 

export function TextField(props){
    // props.titel : str
    // props.placeholder : str  
    // props.id : str
    // props.value : str
    // props.comment : str or jsx
    // props.onChange : function
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
            onChange={props.onChange}
          ></input>
          <p className='text-small text-info p-0 m-0'>{props.comment}</p>
        </div>
      </React.Fragment>
    ) 
  }
  
export function NumberField(props){
    // props.titel : str
    // props.placeholder : str  => like "12"
    // props.min : str  => like "1"
    // props.max : str  => like "5"
    // props.id : str
    // props.value : int
    // props.comment : str or jsx
    // props.onChange : function
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
            onChange={props.onChange}            
          ></input>
          <p className='text-small text-info p-0 pt-1 m-0'>{props.comment}</p>        
        </div>
      </React.Fragment>
    ) 
  }
  
export function SelectField(props){
    // props.titel : str
    // props.placeholder : str
    // props.options : []
    // props.id : str
    // props.value : int
    // props.comment : str or jsx
    // props.onChange : function
    return (
      <React.Fragment>
        <div className="form-group">
          <label htmlFor={props.id} className='text-secondary'>{props.titel}</label>
          <select 
            className="form-control form-control-sm bg-secondary border-secondary text-light" 
            id={props.id} 
            placeholder={props.placeholder} 
            defaultValue={props.value}
            onChange={props.onChange}            
          >
            <option value="" disabled selected hidden>---</option>
            {props.options && props.options.map((option, index)=>{
              return <option key={index}>{option}</option>
            })}
          </select>
          <p className='text-small text-info p-0 m-0'>{props.comment}</p>
        </div>
      </React.Fragment>
    ) 
  }
  
export function MultipleSelectField(props){
    // props.titel : str
    // props.placeholder : str
    // props.options : []
    // props.id : str
    // props.value : int
    // props.comment : str or jsx
    // props.onChange : function
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
            onChange={props.onChange}            
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
  
export function CheckboxField(props){
    // props.titel : str
    // props.id : str
    // props.checked : boolean
    // props.comment : str or jsx
    // props.onChange : function
    return (
      <React.Fragment>
        <div className="form-check pb-3">
          <input 
            type="checkbox" 
            className="form-check-input" 
            id={props.id} 
            checked={props.checked}
            onChange={props.onChange}
        ></input>
          <span>{props.titel}</span>
          <p className='text-small text-info p-0 m-0'>{props.comment}</p>
        </div>
      </React.Fragment>
    ) 
  }
  
export function InlineCheckboxField(props){
    // props.titel : str
    // props.id : str
    // props.checked : boolean
    // props.comment : str or jsx
    // props.onChange : function
    return (
      <React.Fragment>
        <div className="form-check-inline pb-3">
          <input 
            type="checkbox" 
            className="form-check-input" 
            id={props.id} 
            checked={props.checked}
            onChange={props.onChange}
          ></input>
          <span>{props.titel}</span>
          <p className='text-small text-info p-0 m-0'>{props.comment}</p>
        </div>
      </React.Fragment>
    ) 
  }