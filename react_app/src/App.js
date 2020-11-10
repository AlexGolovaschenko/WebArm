import './App.css' 
import Header from './BaseParts/Header'
import Sidebar from './BaseParts/Sidebar'
import TagsCurrentValueList from './Devices/TagsCurrentValueList'

function App() {
  return (
    <div>
      <Header />

      <div class="row m-0 p-0">
        <Sidebar />
        <div className="col-10 m-0 p-0">
          <div className="content-height">
            <div className="p-3">
              <TagsCurrentValueList />
            </div>
          </div>
        </div>
      </div>
     
    </div>
  );
}

export default App;
