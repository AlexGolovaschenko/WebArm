import React from 'react'
import RecordsRow from './RecordsRow'
import Loader from '../../../base/components/Loader'


export default function TagsCurrentValueList(props) {
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
    <div ref={graphCard} className='card shadow-sm py-2 bg-dark text-light h-100'>
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
          { props.records.length > 0 ? <RecordsTable records={props.records}/> : <NoRecords /> }
        </>
      }
    </div>
  )
}


function RecordsTable(props) {
  return (
    <div className="table-responsive px-3">
      <table className="table table-hover table-dark table-sm text-light w-100 mb-0">
        <thead> 
          <tr>
            <th className='border-0 text-secondary font-weight-bold pl-2 d-none d-lg-table-cell' style={{width:'5%'}}>№</th>
            <th className='border-0 text-secondary font-weight-bold' style={{width:'15%'}}>Дата</th>
            <th className='border-0 text-secondary font-weight-bold' style={{width:'10%'}}>Время</th>
            <th className='border-0 text-secondary font-weight-bold'>Событие</th>
          </tr>
        </thead>
        <tbody>
            { props.records.map((record, index) => {
              return (
                <RecordsRow record={record} key={index} index={index} />
              )
            }) }
        </tbody>
      </table>
    </div>
  )
}


function NoRecords() {
  return <i className='text-secondary ml-3'>Записи отсутствуют ...</i>
}