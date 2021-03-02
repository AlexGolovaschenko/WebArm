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
          <ErrorMessage> {props.errors} </ErrorMessage>
          <CommentMessage> {props.comment} </CommentMessage>
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
          <ErrorMessage> {props.errors} </ErrorMessage>
          <CommentMessage> {props.comment} </CommentMessage>
        </div>
      </React.Fragment>
    ) 
  }
  
export function SelectField(props){
    // props.titel : str
    // props.placeholder : str
    // props.options : [{value, name}, {value, name}, ]
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
            value={ props.value ? props.value : '' }
            onChange={props.onChange}            
          >
            <option value="" disabled hidden>---</option>
            {props.options && props.options.map((option, index)=>{
              return <option key={index} value={option.value}>{option.name}</option>
            })}
          </select>
          <ErrorMessage> {props.errors} </ErrorMessage>
          <CommentMessage> {props.comment} </CommentMessage>
        </div>
      </React.Fragment>
    ) 
  }
  
export function MultipleSelectField(props){
    // props.titel : str
    // props.placeholder : str
    // props.options : [{value, name}, {value, name}, ]
    // props.id : str
    // props.value : []
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
            value={ props.value ? props.value : [] } 
            onChange={props.onChange}            
          >
            {props.options && props.options.map((option, index)=>{
              return <option key={index} value={option.value}>{option.name}</option>
            })}
          </select>
          <ErrorMessage> {props.errors} </ErrorMessage>
          <CommentMessage> {props.comment} </CommentMessage>
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
          <ErrorMessage> {props.errors} </ErrorMessage>
          <CommentMessage> {props.comment} </CommentMessage>
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
        <ErrorMessage> {props.errors} </ErrorMessage>
        <CommentMessage> {props.comment} </CommentMessage>
      </div>
    </React.Fragment>
  ) 
}



export function ErrorMessage(props){
  return <div className='text-small text-danger p-0 m-0'> {props.children} </div>  
}
export function CommentMessage(props){
  return <div className='text-small text-info p-0 m-0'> {props.children} </div> 
}

export function FormContainer(props) {
  return <div className='container p-0' style={{maxWidth: '800px'}}> {props.children} </div> 
}

  // ----------------------------------------------------------------------------------
// utils

export function getSelectedOptions(e) {
  var options = e.target.options;
  var value = [];
  for (var i = 0, l = options.length; i < l; i++) {
    if (options[i].selected) {
      value.push(options[i].value);
    }
  }  
  return value
}
