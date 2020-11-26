import React from 'react' 


export default function ProfilePage(props) {
  return (
    <React.Fragment>
      <div className='container card shadow-sm my-4 pt-4'>
        <h2>Профиль пользователя</h2>

        <div className='row my-3'>
          <div className='col-lg-6'>
            <table className="table">
              <tbody>
                <tr>
                  <td>Пользователь:</td> 
                  <td><b>{props.userInfo.username}</b></td>
                </tr>
                <tr>
                  <td>Имя:</td> 
                  <td><b>{props.userInfo.first_name}</b></td>
                </tr>
                <tr>
                  <td>Фамилия:</td> 
                  <td><b>{props.userInfo.last_name}</b></td>
                </tr>
                <tr>
                  <td>Электронная почта:</td> 
                  <td><b>{props.userInfo.email}</b></td>
                </tr>            
              </tbody>
            </table>
          </div> 
        </div> 
      </div>  
    </React.Fragment>
);
}
