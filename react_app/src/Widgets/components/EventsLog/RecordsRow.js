import React from 'react'


export default function TagsCurrentValueRow({record, index}) {
    return (
        <tr>
            <td className='border-secondary text-secondary pl-2 d-none d-lg-table-cell' style={{width:'5%'}}> {index + 1} </td>   
            <td className='border-secondary d-none d-xl-table-cell' style={{width:'15%'}}> {format_date(record.date)} </td> 
            <td className='border-secondary d-table-cell d-xl-none' style={{width:'15%'}}> {format_date(record.date, 'short')} </td> 
            <td className='border-secondary' style={{width:'10%'}}> {format_time(record.date)} </td>
            <td className='border-secondary'> {record.message} </td>
        </tr>
    )
}


function format_time(time, style='medium') {
    const s = new Date(time)
    let formatter = new Intl.DateTimeFormat([] , {timeStyle: style});
    return formatter.format(s)
  }

function format_date(time, style='long') {
    const s = new Date(time)
    let formatter = new Intl.DateTimeFormat([] , {dateStyle: style});
    return formatter.format(s)
  }

