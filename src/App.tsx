import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import About from './pages/About'
import CaseStudy from './pages/CaseStudy'
import Home from './pages/Home'

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="work/:slug" element={<CaseStudy />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
