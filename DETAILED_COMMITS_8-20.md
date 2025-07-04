# DentalFlow Project: Detailed Commits 8-20

## Commit 8: Dashboard Layout Structure
**Message**: `ui: implement dashboard layout with navigation sidebar`

### Files to create/modify:

**Create `src/app/components/Layout/DashboardLayout.tsx`:**
```tsx
import React from 'react'
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

interface DashboardLayoutProps {
  children: React.ReactNode
  title: string
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, title }) => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            DentalFlow - {title}
          </Typography>
          <Typography variant="body2" sx={{ mr: 2 }}>
            Welcome, {user?.name}
          </Typography>
          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        {children}
      </Box>
    </Box>
  )
}
```

**Update `src/App.tsx`** to include layout protection:
```tsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { DataProvider } from './app/context/DataContext'
import { AuthProvider } from './app/context/AuthContext'
import { Home } from './app/pages/Home'
import { PatientDashboard } from './app/pages/PatientDashboard'
import { AdminDashboard } from './app/pages/AdminDashboard'

const theme = createTheme()

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <DataProvider>
        <Router>
          <AuthProvider>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/patient/dashboard" element={<PatientDashboard />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
            </Routes>
          </AuthProvider>
        </Router>
      </DataProvider>
    </ThemeProvider>
  )
}

export default App
```

---

## Commit 9: Patient Dashboard Basic
**Message**: `feat: create patient dashboard with basic components`

**Create `src/app/pages/PatientDashboard.tsx`:**
```tsx
import React from 'react'
import { Container, Grid, Card, CardContent, Typography, Box } from '@mui/material'
import { useAuth } from '../context/AuthContext'
import { DashboardLayout } from '../components/Layout/DashboardLayout'

export const PatientDashboard: React.FC = () => {
  const { user } = useAuth()

  if (!user || user.isAdmin) {
    return <div>Access denied</div>
  }

  return (
    <DashboardLayout title="Patient Dashboard">
      <Container maxWidth="lg">
        <Typography variant="h4" gutterBottom>
          Welcome, {user.name}
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Upcoming Appointments
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  No upcoming appointments scheduled
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  My Profile
                </Typography>
                <Typography variant="body2">
                  Email: {user.email}
                </Typography>
                <Typography variant="body2">
                  Patient ID: {user.patientId || 'N/A'}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </DashboardLayout>
  )
}
```

---

## Commit 10: Patient Appointment Management
**Message**: `feat: implement patient appointment viewing and booking`

**Create `src/app/components/AppointmentBooking.tsx`:**
```tsx
import React, { useState } from 'react'
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  MenuItem,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material'
import { useData } from '../context/DataContext'

export const AppointmentBooking: React.FC = () => {
  const { addAppointment } = useData()
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    type: '',
    description: ''
  })

  const appointmentTypes = [
    'Consultation',
    'Cleaning',
    'Root Canal',
    'Filling',
    'Extraction'
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Add appointment logic here
    addAppointment({
      ...formData,
      id: Date.now().toString(),
      patientId: 'current-patient-id',
      status: 'scheduled'
    })
    setOpen(false)
    setFormData({ date: '', time: '', type: '', description: '' })
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Book New Appointment
        </Typography>
        <Button variant="contained" onClick={() => setOpen(true)}>
          Book Appointment
        </Button>

        <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Book New Appointment</DialogTitle>
          <DialogContent>
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
              <TextField
                fullWidth
                label="Date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                margin="normal"
                InputLabelProps={{ shrink: true }}
                required
              />
              <TextField
                fullWidth
                label="Time"
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                margin="normal"
                InputLabelProps={{ shrink: true }}
                required
              />
              <TextField
                fullWidth
                select
                label="Appointment Type"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                margin="normal"
                required
              >
                {appointmentTypes.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                margin="normal"
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmit} variant="contained">Book</Button>
          </DialogActions>
        </Dialog>
      </CardContent>
    </Card>
  )
}
```

**Update `src/app/pages/PatientDashboard.tsx`** to include AppointmentBooking component.

---

## Commit 11: Admin Dashboard Basic
**Message**: `feat: create admin dashboard with overview metrics`

**Create `src/app/pages/AdminDashboard.tsx`:**
```tsx
import React from 'react'
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Paper
} from '@mui/material'
import { useAuth } from '../context/AuthContext'
import { useData } from '../context/DataContext'
import { DashboardLayout } from '../components/Layout/DashboardLayout'

export const AdminDashboard: React.FC = () => {
  const { user } = useAuth()
  const { patients, appointments } = useData()

  if (!user || !user.isAdmin) {
    return <div>Access denied</div>
  }

  const stats = {
    totalPatients: patients.length,
    totalAppointments: appointments.length,
    todayAppointments: appointments.filter(apt => 
      new Date(apt.date).toDateString() === new Date().toDateString()
    ).length,
    monthlyRevenue: appointments
      .filter(apt => apt.status === 'completed')
      .reduce((sum, apt) => sum + (apt.cost || 0), 0)
  }

  return (
    <DashboardLayout title="Admin Dashboard">
      <Container maxWidth="lg">
        <Typography variant="h4" gutterBottom>
          Admin Dashboard
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h4" color="primary">
                {stats.totalPatients}
              </Typography>
              <Typography variant="body2">Total Patients</Typography>
            </Paper>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h4" color="primary">
                {stats.totalAppointments}
              </Typography>
              <Typography variant="body2">Total Appointments</Typography>
            </Paper>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h4" color="primary">
                {stats.todayAppointments}
              </Typography>
              <Typography variant="body2">Today's Appointments</Typography>
            </Paper>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h4" color="primary">
                ${stats.monthlyRevenue}
              </Typography>
              <Typography variant="body2">Monthly Revenue</Typography>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </DashboardLayout>
  )
}
```

---

## Commit 12: Patient Management for Admin
**Message**: `feat: implement patient management CRUD operations`

**Create `src/app/components/PatientManagement.tsx`:**
```tsx
import React, { useState } from 'react'
import {
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Box,
  IconButton
} from '@mui/material'
import { Edit, Delete, Add } from '@mui/icons-material'
import { useData } from '../context/DataContext'

export const PatientManagement: React.FC = () => {
  const { patients, addPatient, updatePatient, deletePatient } = useData()
  const [open, setOpen] = useState(false)
  const [editingPatient, setEditingPatient] = useState<any>(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    dateOfBirth: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingPatient) {
      updatePatient(editingPatient.id, formData)
    } else {
      addPatient({
        ...formData,
        id: Date.now().toString(),
        appointments: []
      })
    }
    handleClose()
  }

  const handleClose = () => {
    setOpen(false)
    setEditingPatient(null)
    setFormData({ name: '', email: '', phone: '', address: '', dateOfBirth: '' })
  }

  const handleEdit = (patient: any) => {
    setEditingPatient(patient)
    setFormData({
      name: patient.name,
      email: patient.email,
      phone: patient.phone,
      address: patient.address,
      dateOfBirth: patient.dateOfBirth
    })
    setOpen(true)
  }

  return (
    <Card>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">Patient Management</Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setOpen(true)}
          >
            Add Patient
          </Button>
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {patients.map((patient) => (
                <TableRow key={patient.id}>
                  <TableCell>{patient.name}</TableCell>
                  <TableCell>{patient.email}</TableCell>
                  <TableCell>{patient.phone}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleEdit(patient)}>
                      <Edit />
                    </IconButton>
                    <IconButton onClick={() => deletePatient(patient.id)}>
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
          <DialogTitle>
            {editingPatient ? 'Edit Patient' : 'Add New Patient'}
          </DialogTitle>
          <DialogContent>
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
              <TextField
                fullWidth
                label="Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                margin="normal"
                required
              />
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                margin="normal"
                required
              />
              <TextField
                fullWidth
                label="Phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                margin="normal"
                required
              />
              <TextField
                fullWidth
                label="Address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Date of Birth"
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                margin="normal"
                InputLabelProps={{ shrink: true }}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={handleSubmit} variant="contained">
              {editingPatient ? 'Update' : 'Add'}
            </Button>
          </DialogActions>
        </Dialog>
      </CardContent>
    </Card>
  )
}
```

Continue with remaining commits...