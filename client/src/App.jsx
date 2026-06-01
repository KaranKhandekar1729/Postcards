import './index.css';
import Postcard from './components/Postcard';
import { BrowserRouter, Routes, Route }  from 'react-router-dom';
import EditingView from './views/EditingView';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={ <Postcard cardData={''} /> } />
        <Route path="/edit" element={ <EditingView /> } />
      </Routes>
    </BrowserRouter>
  )
}

export default App
