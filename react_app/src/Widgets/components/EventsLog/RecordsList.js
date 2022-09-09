import React from 'react';
import RecordsRow from './RecordsRow';
import Loader from '../../../base/components/Loader';


export default function TagsCurrentValueList(props) {
  // eslint-disable-next-line no-unused-vars
  const [modal, setModal] = React.useState(false); // use it just for force update this component
  const modalButton = React.useRef(null);
  const graphCard = React.useRef(null);
  const toggleCategorySelection = props.toggleCategorySelection;
  const categories = props.categories;

  const toggleModal = () => {
    const cl = ' full-screen-card'
    if (graphCard.current.className.includes(cl)) {
      graphCard.current.className = graphCard.current.className.replace(cl, '');
      modalButton.current.className = modalButton.current.className.replace('fa-compress', 'fa-expand'); 
      modalButton.current.className = modalButton.current.className.replace('text-primary', 'text-light');      
      setModal(false);
    } else {
      graphCard.current.className += cl;
      modalButton.current.className = modalButton.current.className.replace('fa-expand', 'fa-compress'); 
      modalButton.current.className = modalButton.current.className.replace('text-light', 'text-primary');       
      setModal(true);
    }
  };

  return (
    <div ref={graphCard} className='card shadow-sm py-2 desk-bg-color-secondary desk-text-color-primary h-100'>
      <div className='d-flex mb-1'>
        <h5 className="px-3 pt-1 pb-0 m-0">{props.title}</h5>
        <span className='ml-auto'></span>

        { props.category_selection_panel && 
          <CategorySelectionPanel toggleCategorySelection={toggleCategorySelection} categories={categories}/> 
        }

        <button type="button" 
          ref={modalButton} 
          className={'btn btn-link desk-text-color-primary m-0 p-0 mt-1 mr-2 fas fa-expand'} 
          style={{width: '28px', height: '28px', fontSize:'1em', textDecoration: 'none', outline: 'none', boxShadow: 'none'}} 
          onClick={toggleModal}
        ></button>  
      </div>
  
      { props.loading ? 
        <div className='d-flex justify-content-center'><Loader /></div> 
        :
        <>
          { props.records.length > 0 ? <RecordsTable records={props.records}/> : <NoRecords /> }
          <PaginationBar readNextPage={props.readNextPage} 
            readPreviousPage={props.readPreviousPage} 
            changePage={props.changePage} pagination={props.pagination} 
          />
        </>
      }
    </div>
  )
}


function RecordsTable(props) {
  return (
    <div className="table-responsive px-3">
      <table className="table table-hover table-dark table-sm desk-bg-color-secondary desk-text-color-primary desk-border-color-primary w-100 mb-0">
        <thead> 
          <tr>
            <th className='border-0 desk-text-color-secondary font-weight-bold pl-2 d-none d-lg-table-cell' style={{width:'5%'}}>№</th>
            <th className='border-0 desk-text-color-secondary font-weight-bold' style={{width:'15%'}}>Дата</th>
            <th className='border-0 desk-text-color-secondary font-weight-bold' style={{width:'10%'}}>Время</th>
            <th className='border-0 desk-text-color-secondary font-weight-bold'>Событие</th>
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
  return <i className='desk-text-color-secondary ml-3'>Записи отсутствуют ...</i>
}


function CategorySelectionPanel(props) {
  const toggleCategorySelection = props.toggleCategorySelection;
  const categories = props.categories;
  return(
    <>
      <div className='d-inline mr-3'>
        {categories.map( (category, index)=>{
          return <CategorySecetionButton key={index} selected={category.selected} onClick={()=>{toggleCategorySelection(index)}}>{category.name}</CategorySecetionButton>
        } )}
      </div>
    </>
  )
}


function CategorySecetionButton(props) {
  return (
    <button 
      type="button" 
      className='btn btn-link desk-text-color-primary ml-3 p-0 mt-1' 
      style={{boxShadow: 'none'}}
      onClick={props.onClick}
    >
      { props.selected ? <i className='fas fa-check-square text-success mr-2'></i> : <i className='far fa-square text-info mr-2'></i> }
      { props.children }
    </button>    
  )
}



function PaginationBar(props) {
  const list = Array.apply(null, Array(props.pagination.num_pages));
  
  if (props.pagination.num_pages <= 1) {
    return null;
  }

  return (
    <div className='d-flex justify-content-center p-3'>
      <button type='button' className='btn btn-sm btn-outline-info m-1' onClick={props.readPreviousPage} > {'<<'} </button>
      { list.map((item, index)=>{
          const active = (index+1 === props.pagination.page_number) ? ' active' : ''
          return(
            <button type='button' key={index}
              className={'btn btn-sm btn-outline-info m-1' + active} 
              style={{minWidth:'35px'}}
              onClick={()=>{props.changePage(index+1)}}
            >
              {index+1}
            </button>
          )
        })
      }
      <button type='button' className='btn btn-sm btn-outline-info m-1' onClick={props.readNextPage} > {'>>'} </button>
    </div>
  )
}