# DentalFlow Project: Commits 13-20 (Continuation)

## Commit 13: Enhanced Appointment Management
**Message**: `feat: add comprehensive appointment management for admin`

**Create `src/app/components/AppointmentManagement.tsx`:**
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
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Box
} from '@mui/material'
import { Edit, Delete, Add } from '@mui/icons-material'
import { useData } from '../context/DataContext'

export const AppointmentManagement: React.FC = () => {
  const { appointments, patients, addAppointment, updateAppointment, deleteAppointment } = useData()
  const [open, setOpen] = useState(false)
  const [editingAppointment, setEditingAppointment] = useState<any>(null)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'primary'
      case 'in-progress': return 'warning' 
      case 'completed': return 'success'
      case 'cancelled': return 'error'
      default: return 'default'
    }
  }

  const getPatientName = (patientId: string) => {
    const patient = patients.find(p => p.id === patientId)
    return patient ? patient.name : 'Unknown Patient'
  }

  return (
    <Card>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">Appointment Management</Typography>
          <Button variant="contained" startIcon={<Add />} onClick={() => setOpen(true)}>
            Schedule Appointment
          </Button>
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Patient</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Time</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Cost</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {appointments.map((appointment) => (
                <TableRow key={appointment.id}>
                  <TableCell>{getPatientName(appointment.patientId)}</TableCell>
                  <TableCell>{appointment.date}</TableCell>
                  <TableCell>{appointment.time}</TableCell>
                  <TableCell>{appointment.type}</TableCell>
                  <TableCell>
                    <Chip 
                      label={appointment.status} 
                      color={getStatusColor(appointment.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>${appointment.cost || 0}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => {
                      setEditingAppointment(appointment)
                      setOpen(true)
                    }}>
                      <Edit />
                    </IconButton>
                    <IconButton onClick={() => deleteAppointment(appointment.id)}>
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  )
}
```

---

## Commit 14: File Upload System
**Message**: `feat: add file upload and attachment management`

**Create `src/app/components/FileUpload.tsx`:**
```tsx
import React, { useState, useRef } from 'react'
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Alert
} from '@mui/material'
import { CloudUpload, Delete, Visibility } from '@mui/icons-material'

interface FileUploadProps {
  onFilesChange: (files: File[]) => void
  maxFiles?: number
  acceptedTypes?: string[]
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onFilesChange,
  maxFiles = 5,
  acceptedTypes = ['image/*', 'application/pdf', '.doc', '.docx']
}) => {
  const [files, setFiles] = useState<File[]>([])
  const [error, setError] = useState<string>('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || [])
    
    if (files.length + selectedFiles.length > maxFiles) {
      setError(`Maximum ${maxFiles} files allowed`)
      return
    }

    const validFiles = selectedFiles.filter(file => {
      const isValidType = acceptedTypes.some(type => {
        if (type.includes('*')) {
          return file.type.startsWith(type.split('*')[0])
        }
        return file.type === type || file.name.endsWith(type)
      })
      
      if (!isValidType) {
        setError(`Invalid file type: ${file.name}`)
        return false
      }
      
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        setError(`File too large: ${file.name}`)
        return false
      }
      
      return true
    })

    const newFiles = [...files, ...validFiles]
    setFiles(newFiles)
    onFilesChange(newFiles)
    setError('')
  }

  const removeFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index)
    setFiles(newFiles)
    onFilesChange(newFiles)
  }

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = error => reject(error)
    })
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          File Attachments
        </Typography>
        
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        
        <Box sx={{ mb: 2 }}>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={handleFileSelect}
            style={{ display: 'none' }}
            accept={acceptedTypes.join(',')}
          />
          <Button
            variant="outlined"
            startIcon={<CloudUpload />}
            onClick={() => fileInputRef.current?.click()}
            disabled={files.length >= maxFiles}
          >
            Upload Files ({files.length}/{maxFiles})
          </Button>
        </Box>

        {files.length > 0 && (
          <List>
            {files.map((file, index) => (
              <ListItem key={index}>
                <ListItemText
                  primary={file.name}
                  secondary={`${(file.size / 1024).toFixed(1)} KB`}
                />
                <ListItemSecondaryAction>
                  <IconButton edge="end" onClick={() => removeFile(index)}>
                    <Delete />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        )}
      </CardContent>
    </Card>
  )
}
```

---

## Commit 15: Calendar Component
**Message**: `feat: implement calendar view for appointments`

**Create `src/app/components/Calendar.tsx`:**
```tsx
import React, { useState } from 'react'
import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Grid,
  Paper,
  Chip
} from '@mui/material'
import { ChevronLeft, ChevronRight } from '@mui/icons-material'

interface CalendarProps {
  appointments: Array<{
    id: string
    date: string
    time: string
    patientName: string
    type: string
    status: string
  }>
  onDateClick?: (date: Date) => void
}

export const Calendar: React.FC<CalendarProps> = ({ appointments, onDateClick }) => {
  const [currentDate, setCurrentDate] = useState(new Date())

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const getAppointmentsForDate = (date: Date) => {
    const dateString = date.toISOString().split('T')[0]
    return appointments.filter(apt => apt.date === dateString)
  }

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev)
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1)
      } else {
        newDate.setMonth(prev.getMonth() + 1)
      }
      return newDate
    })
  }

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentDate)
    const firstDay = getFirstDayOfMonth(currentDate)
    const days = []

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<Grid item xs key={`empty-${i}`} />)
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
      const dayAppointments = getAppointmentsForDate(date)
      const isToday = date.toDateString() === new Date().toDateString()

      days.push(
        <Grid item xs key={day}>
          <Paper
            sx={{
              p: 1,
              minHeight: 80,
              cursor: 'pointer',
              backgroundColor: isToday ? 'primary.light' : 'background.paper',
              '&:hover': { backgroundColor: 'grey.100' }
            }}
            onClick={() => onDateClick?.(date)}
          >
            <Typography variant="body2" fontWeight={isToday ? 'bold' : 'normal'}>
              {day}
            </Typography>
            {dayAppointments.map((apt, index) => (
              <Chip
                key={index}
                label={`${apt.time} - ${apt.type}`}
                size="small"
                color="primary"
                sx={{ mt: 0.5, fontSize: '0.6rem', height: 16 }}
              />
            ))}
          </Paper>
        </Grid>
      )
    }

    return days
  }

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  return (
    <Card>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Button startIcon={<ChevronLeft />} onClick={() => navigateMonth('prev')}>
            Previous
          </Button>
          <Typography variant="h6">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </Typography>
          <Button endIcon={<ChevronRight />} onClick={() => navigateMonth('next')}>
            Next
          </Button>
        </Box>

        <Grid container spacing={1}>
          {dayNames.map(day => (
            <Grid item xs key={day}>
              <Typography variant="body2" textAlign="center" fontWeight="bold">
                {day}
              </Typography>
            </Grid>
          ))}
          {renderCalendarDays()}
        </Grid>
      </CardContent>
    </Card>
  )
}
```

---

## Commit 16: Analytics and Reports
**Message**: `feat: add analytics dashboard and reporting features`

**Create `src/app/components/Analytics.tsx`:**
```tsx
import React from 'react'
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material'
import { useData } from '../context/DataContext'

export const Analytics: React.FC = () => {
  const { appointments, patients } = useData()

  const analytics = {
    totalRevenue: appointments
      .filter(apt => apt.status === 'completed')
      .reduce((sum, apt) => sum + (apt.cost || 0), 0),
    
    appointmentsByType: appointments.reduce((acc, apt) => {
      acc[apt.type] = (acc[apt.type] || 0) + 1
      return acc
    }, {} as Record<string, number>),
    
    appointmentsByStatus: appointments.reduce((acc, apt) => {
      acc[apt.status] = (acc[apt.status] || 0) + 1
      return acc
    }, {} as Record<string, number>),
    
    monthlyStats: appointments.reduce((acc, apt) => {
      const month = new Date(apt.date).toLocaleDateString('en-US', { 
        month: 'long', 
        year: 'numeric' 
      })
      if (!acc[month]) {
        acc[month] = { count: 0, revenue: 0 }
      }
      acc[month].count += 1
      if (apt.status === 'completed') {
        acc[month].revenue += apt.cost || 0
      }
      return acc
    }, {} as Record<string, { count: number, revenue: number }>)
  }

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Analytics & Reports
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h4" color="primary">
              ${analytics.totalRevenue}
            </Typography>
            <Typography variant="body2">Total Revenue</Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h4" color="primary">
              {appointments.length}
            </Typography>
            <Typography variant="body2">Total Appointments</Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h4" color="primary">
              {patients.length}
            </Typography>
            <Typography variant="body2">Total Patients</Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Appointments by Type
              </Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Type</TableCell>
                      <TableCell align="right">Count</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {Object.entries(analytics.appointmentsByType).map(([type, count]) => (
                      <TableRow key={type}>
                        <TableCell>{type}</TableCell>
                        <TableCell align="right">{count}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Monthly Performance
              </Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Month</TableCell>
                      <TableCell align="right">Appointments</TableCell>
                      <TableCell align="right">Revenue</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {Object.entries(analytics.monthlyStats).map(([month, stats]) => (
                      <TableRow key={month}>
                        <TableCell>{month}</TableCell>
                        <TableCell align="right">{stats.count}</TableCell>
                        <TableCell align="right">${stats.revenue}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}
```

Continue with remaining commits...