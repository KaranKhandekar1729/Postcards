import './index.css';
import Postcard from './components/Postcard';
import { BrowserRouter, Routes, Route }  from 'react-router-dom';
import CardCanvas from './components/CardCanvas';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={ <Postcard cardData={''} /> } />
        <Route path="/edit" element={ <CardCanvas /> } />
      </Routes>
    </BrowserRouter>
  )
}

export default App
