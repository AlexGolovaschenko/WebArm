import React from 'react'

export default function TagsCurrentValueList() {
    return (
        <div>
            <p>Устройство: <b><span>DEVICE NAME</span></b></p>
        
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
                <tr ng-repeat="t in Tags">
                    <td ng-bind="$index + 1"> INDEX </td>   
                    <td ng-bind="t.code"> CODE </td>
                    <td ng-bind="t.name"> NAME </td>
                    <td ng-bind="t.value"> VALUE </td>
                </tr>
                </tbody>
            </table>
            </div>
        </div>
    )
}