import React from 'react'
import Loader from '../../../base/components/Loader'


export default function TagIndicator(props) {
  const tag = props.tag
  const addTextRight = props.addTextRight
  const addTextLeft = props.addTextLeft

  return (
    <div className='card shadow-sm py-2 bg-dark text-light h-100'>
      <div className='d-flex mb-1'>
        <h5 className="px-3 pt-1 pb-0 m-0">{props.title}</h5>
        <span className='ml-auto'></span>  
      </div>
  
      { props.loading ? 
        <div className='d-flex justify-content-center'><Loader /></div> :     
        <div className="d-flex justify-content-center align-items-end h-100 px-3">
          {tag ? 
            <p className='display-4 m-0 p-0'>
              <span>{addTextLeft} </span> 
              {tag.value} 
              <span> {addTextRight}</span>
            </p> :
            <p className='display-4 text-secondary m-0 p-0'>Нет данных</p> 
          }
        </div>
      }
    </div>
  )
}


