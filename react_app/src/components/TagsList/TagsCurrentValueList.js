import React from 'react'
import PropTypes from 'prop-types'
import TagsCurrentValueRow from './TagsCurrentValueRow'

function TagsCurrentValueList(props) {
    return (
        <div>     
            <div className="table-responsive">
            <table className="table table-striped table-sm">
                <thead> 
                <tr>
                    <td>№</td>
                    <td>Код параметра</td>
                    <td>Наименование параметра</td>
                    <td>Текущее значение</td>
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
        </div>
    )
}


TagsCurrentValueList.propTypes = {
    tags: PropTypes.arrayOf(PropTypes.object).isRequired
}

export default TagsCurrentValueList