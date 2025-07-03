import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { DataProvider } from './app/context/DataContext'
import { AuthProvider } from './app/context/AuthContext'
import Home from './app/pages/Home'
import PatientDashboard from './app/pages/PatientDashboard'
import AdminDashboard from './app/pages/AdminDashboard'

function App() {
  return (
    <div className="antialiased">
      <DataProvider>
        <AuthProvider>
          <Router>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/patient/dashboard" element={<PatientDashboard />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
            </Routes>
          </Router>
        </AuthProvider>
      </DataProvider>
    </div>
  )
}

export default App