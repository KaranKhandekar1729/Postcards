import './index.css';
import { BrowserRouter, Routes, Route }  from 'react-router-dom';
import EditingView from './pages/EditingView';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import SignUp from './pages/SignUp';
import Login from './pages/Login';
import Home from './pages/Home';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={ <Home /> } />
          <Route path="/signup" element={ <SignUp /> } />
          <Route path="/login" element={<Login />}/>
          {/* <Route path="/p/:slug" element={ <Postcard cardData /> } /> */}
          <Route path="/postcard/new" element={ 
            <ProtectedRoute>
              <EditingView /> 
            </ProtectedRoute>
          } />
          <Route path="/postcard/edit/:slug" element={
            <ProtectedRoute>
              <EditingView />
            </ProtectedRoute> 
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
