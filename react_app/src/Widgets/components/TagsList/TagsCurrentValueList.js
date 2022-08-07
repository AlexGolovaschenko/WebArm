import React from 'react'
import PropTypes from 'prop-types'
import TagsCurrentValueRow from './TagsCurrentValueRow'
import Loader from '../../../base/components/Loader'


function TagsCurrentValueList(props) {
  // eslint-disable-next-line no-unused-vars
  const [modal, setModal] = React.useState(false) // use it just for force update this component
  const modalButton = React.useRef(null)
  const graphCard = React.useRef(null)

  const toggleModal = () => {
    const cl = ' full-screen-card'
    if (graphCard.current.className.includes(cl)) {
      graphCard.current.className = graphCard.current.className.replace(cl, '')
      modalButton.current.className = modalButton.current.className.replace('fa-compress', 'fa-expand') 
      modalButton.current.className = modalButton.current.className.replace('text-primary', 'text-light')      
      setModal(false)
    } else {
      graphCard.current.className += cl
      modalButton.current.className = modalButton.current.className.replace('fa-expand', 'fa-compress') 
      modalButton.current.className = modalButton.current.className.replace('text-light', 'text-primary')       
      setModal(true)
    }
  }

  return (
    <div ref={graphCard} className='card shadow-sm py-2 desk-bg-color-secondary desk-text-color-primary h-100'>
      <div className='d-flex mb-1'>
        <h5 className="px-3 pt-1 pb-0 m-0">{props.title}</h5>
        <span className='ml-auto'></span>

        <button type="button" 
          ref={modalButton} 
          className={'btn btn-link text-light m-0 p-0 mt-1 mr-2 fas fa-expand'} 
          style={{width: '28px', height: '28px', fontSize:'1em', textDecoration: 'none', outline: 'none', boxShadow: 'none'}} 
          onClick={toggleModal}
        ></button>  
      </div>
  
      { props.loading ? 
        <div className='d-flex justify-content-center'><Loader /></div> 
        :
        <>
        { props.columns ?    
        <div className="table-responsive px-3">
          <table className="table table-hover table-dark table-sm desk-bg-color-secondary desk-text-color-primary desk-border-color-primary w-100 mb-0">
            <thead> 
              <tr>
                { (props.columns.indexOf('#No') >= 0) ? <th className='border-0 text-secondary font-weight-bold pl-2'>№</th> : null }
                { (props.columns.indexOf('code') >= 0) ? <th className='border-0 text-secondary font-weight-bold'>Код параметра</th> : null }
                { (props.columns.indexOf('name') >= 0) ? <th className='border-0 text-secondary font-weight-bold'>Наименование параметра</th> : null }
                { (props.columns.indexOf('value') >= 0) ? <th className='border-0 text-secondary font-weight-bold'>Текущее значение</th> : null }
              </tr>
            </thead>
            <tbody>
                { props.tags.map((tag, index) => {
                  return (
                    <TagsCurrentValueRow tag={tag} columns={props.columns} key={tag.code} index={index} />
                  )
                }) }
            </tbody>
          </table>
        </div>
        :
          <i className='text-secondary ml-3'>Данные для отображения не заданы ... </i>
        } 
        </>
      }
    </div>
  )
}


TagsCurrentValueList.propTypes = {
    tags: PropTypes.arrayOf(PropTypes.object).isRequired
}

export default TagsCurrentValueList