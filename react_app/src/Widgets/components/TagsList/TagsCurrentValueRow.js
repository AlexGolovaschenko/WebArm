import React from 'react'
import PropTypes from 'prop-types'


function TagsCurrentValueRow({tag, columns, index}) {
    return (
        <tr>
            { (columns.indexOf('#No') >= 0) ? <td className='border-secondary text-secondary pl-2'> {index + 1} </td> : null }  
            { (columns.indexOf('code') >= 0) ? <td className='border-secondary'> {tag.code} </td> : null }
            { (columns.indexOf('name') >= 0) ? <td className='border-secondary'> {tag.name} </td> : null }
            { (columns.indexOf('value') >= 0) ? <td className='border-secondary'> {tag.value} </td> : null }
        </tr>
    )
}



TagsCurrentValueRow.propTypes = {
    tag: PropTypes.object.isRequired,
    index: PropTypes.number.isRequired,
}

export default TagsCurrentValueRow