import './App.css' 
import Header from './BaseParts/Header'
import Sidebar from './BaseParts/Sidebar'
import TagsCurrentValueList from './Devices/TagsCurrentValueList'

function App() {
  const tags = [
    {code: 'HSF', name: 'Temperature 1', value: 12.3},
    {code: 'HSF1', name: 'Temperature 3', value: 22.3},
    {code: 'HSF2', name: 'Temperature 2', value: 23.3},
    {code: 'HSF3', name: 'Temperature 4', value: 45.3},
  ]

  return (
    <div>
      <Header />

      <div className="row m-0 p-0">
        <Sidebar />
        <div className="col-10 m-0 p-0">
          <div className="content-height">
            <div className="p-3">
              <TagsCurrentValueList tags={tags} />
            </div>
          </div>
        </div>
      </div>
     
    </div>
  );
}

export default App;
