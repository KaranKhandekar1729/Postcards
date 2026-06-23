import './index.css';
import { BrowserRouter, Routes, Route }  from 'react-router-dom';
import EditingView from './pages/EditingView';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import SignUp from './pages/SignUp';
import Login from './pages/Login';
import Home from './pages/Home';
import EnvelopeView from './pages/EnvelopeView';

function App() {
  const fontOptions = [
    { label: 'Arial', value: 'Arial', url: null },
    { label: 'Times New Roman', value: 'TimesNewRoman', url: null },
    { label: 'Cedarville Cursive', value: 'CedarvilleCursive', googleFont: true },
    { label: 'Instrument Serif', value: 'InstrumentSerif', googleFont: true },
    { label: 'Shadows Into Light', value: 'ShadowsIntoLight', googleFont: true },
    { label: 'Adversecase', value: 'Adversecase', url: 'https://res.cloudinary.com/docidcbkt/raw/upload/v1781364541/liypsjxnxyjxpmvrcur3.woff2' }
  ]

  const preloadFonts = async () => {
    const customFonts = fontOptions.filter(fontOption => fontOption.url || fontOption.googleFont)
    await Promise.all(customFonts.map(async font => {
        if (font.url) {
            const fontFace = new FontFace(font.value, `url(${font.url})`)
            await fontFace.load()
            document.fonts.add(fontFace)
        } else if (font.googleFont) {
            await document.fonts.load(`16px "${font.label}"`)
        }
    }))
  }

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={ <Home /> } />
          <Route path="/signup" element={ <SignUp /> } />
          <Route path="/login" element={<Login />}/>
          <Route path="/envelope/:slug" element={ <EnvelopeView preloadFonts={preloadFonts} /> } />
          <Route path="/envelope/new" element={ <EditingView fontOptions={fontOptions} preloadFonts={preloadFonts} /> } />
          <Route path="/envelope/edit/:slug" element={
            <ProtectedRoute>
              <EditingView fontOptions={fontOptions} preloadFonts={preloadFonts} />
            </ProtectedRoute> 
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
