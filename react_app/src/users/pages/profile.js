import React from 'react' 


export default function ProfilePage(props) {
  return (
    <React.Fragment>
    <div className='desk-bg-color-primary content-height'> 
      <div className='container card desk-bg-color-secondary desk-text-color-secondary shadow-sm my-4 pt-4'>
        <h2>Профиль пользователя</h2>

        <div className='row my-3'>
          <div className='col-lg-6'>
            <table className="table tadle-dark desk-text-color-primary desk-border-color-primary">
              <tbody>
                <tr>
                  <td className='border-secondary'>Пользователь:</td> 
                  <td className='border-secondary'><b>{props.userInfo.username}</b></td>
                </tr>
                <tr>
                  <td className='border-secondary'>Имя:</td> 
                  <td className='border-secondary'><b>{props.userInfo.first_name}</b></td>
                </tr>
                <tr>
                  <td className='border-secondary'>Фамилия:</td> 
                  <td className='border-secondary'><b>{props.userInfo.last_name}</b></td>
                </tr>
                <tr>
                  <td className='border-secondary'>Электронная почта:</td> 
                  <td className='border-secondary'><b>{props.userInfo.email}</b></td>
                </tr>            
              </tbody>
            </table>
          </div> 
        </div> 
      </div>  
    </div>
    </React.Fragment>
);
}
