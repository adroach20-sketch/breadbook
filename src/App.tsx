import { BrowserRouter, Routes, Route } from 'react-router-dom'

function Home() {
  return (
    <div className="min-h-screen bg-crumb flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl text-crust font-bold mb-2">BreadBook</h1>
        <p className="text-ash">Your sourdough starter's best friend.</p>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </BrowserRouter>
  )
}
