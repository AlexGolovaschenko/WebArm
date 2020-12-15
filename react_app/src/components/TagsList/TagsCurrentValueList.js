import React from 'react'
import PropTypes from 'prop-types'
import TagsCurrentValueRow from './TagsCurrentValueRow'
import Loader from '../../components/BaseParts/Loader'


function TagsCurrentValueList(props) {
    return (
        <div className='card shadow-sm p-3 bg-dark text-light'>
        { props.loading ? 
            <Loader /> :     
            <div className="table-responsive">

            <table className="table table-sm text-light tadle-dark w-100 mb-0">
                <thead> 
                <tr>
                    <td className='border-0 text-secondary font-weight-bold pl-2'>№</td>
                    <td className='border-0 text-secondary font-weight-bold'>Код параметра</td>
                    <td className='border-0 text-secondary font-weight-bold'>Наименование параметра</td>
                    <td className='border-0 text-secondary font-weight-bold'>Текущее значение</td>
                </tr>
                </thead>
                <tbody>
                    { props.tags.map((tag, index) => {
                        return (
                            <TagsCurrentValueRow tag={tag} key={tag.code} index={index} />
                        )
                    }) }
                </tbody>
            </table>
            </div>
        }
        </div>
    )
}


TagsCurrentValueList.propTypes = {
    tags: PropTypes.arrayOf(PropTypes.object).isRequired
}

export default TagsCurrentValueList