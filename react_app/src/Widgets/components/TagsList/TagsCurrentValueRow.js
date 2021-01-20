import React from 'react'
import PropTypes from 'prop-types'


function TagsCurrentValueRow({tag, index}) {
    return (
        <tr>
            <td className='border-secondary text-secondary pl-2'> {index + 1} </td>   
            <td className='border-secondary'> {tag.code} </td>
            <td className='border-secondary'> {tag.name} </td>
            <td className='border-secondary'> {tag.value} </td>
        </tr>
    )
}



TagsCurrentValueRow.propTypes = {
    tag: PropTypes.object.isRequired,
    index: PropTypes.number.isRequired,
}

export default TagsCurrentValueRow