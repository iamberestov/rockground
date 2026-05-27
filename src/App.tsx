import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Portfolio from './pages/Portfolio'
import PortfolioItem from './pages/PortfolioItem'
import Prototyping from './pages/Prototyping'
import GeneratedViewer from './pages/GeneratedViewer'
import './App.css'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/portfolio" element={<Portfolio />} />
      <Route path="/portfolio/:id" element={<PortfolioItem />} />
      <Route path="/prototyping" element={<Prototyping />} />
      <Route path="/prototyping/generated/:slug" element={<GeneratedViewer />} />
    </Routes>
  )
}

export default App