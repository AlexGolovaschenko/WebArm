import React from 'react'
import PropTypes from 'prop-types'


function TagsCurrentValueRow({tag, index}) {
    return (
        <tr>
            <td> {index + 1} </td>   
            <td> {tag.code} </td>
            <td> {tag.name} </td>
            <td> {tag.value} </td>
        </tr>
    )
}



TagsCurrentValueRow.propTypes = {
    tag: PropTypes.object.isRequired,
    index: PropTypes.number.isRequired,
}

export default TagsCurrentValueRow