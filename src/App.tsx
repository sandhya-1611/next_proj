import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { DataProvider } from './app/context/DataContext'
import { AuthProvider } from './app/context/AuthContext'
import Home from './app/pages/Home'
import PatientDashboard from './app/pages/PatientDashboard'
import AdminDashboard from './app/pages/AdminDashboard'

function App() {
  return (
    <div style={{backgroundColor: 'red', color: 'white', padding: '20px'}}>
      <h1>Hello World - App is working!</h1>
    </div>
  )
}

export default App