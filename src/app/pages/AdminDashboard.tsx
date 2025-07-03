import { useState, useMemo, useEffect } from 'react';
import { 
  DashboardRounded, 
  PeopleRounded, 
  CalendarTodayRounded, 
  LocalHospitalRounded, 
  AnalyticsRounded,
  SettingsRounded,
  ExitToAppRounded,
  AddRounded,
  EditRounded,
  DeleteRounded
} from '@mui/icons-material';
import { 
  Typography, 
  Card, 
  CardContent, 
  Button, 
  Box, 
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Chip,
  Alert,
  Snackbar,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  AppBar,
  Toolbar,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { formatAppointmentDate } from '../utils/dateFormatter';
import FileUpload from '../components/FileUpload';
import FileViewer from '../components/FileViewer';
import Calendar from '../components/Calendar';

// Navigation items
const navigationItems = [
  { id: 'overview', title: 'Overview', icon: <DashboardRounded /> },
  { id: 'patients', title: 'Patients', icon: <PeopleRounded /> },
  { id: 'appointments', title: 'Appointments', icon: <CalendarTodayRounded /> },
  { id: 'treatments', title: 'Treatments', icon: <LocalHospitalRounded /> },
  { id: 'calendar', title: 'Calendar', icon: <CalendarTodayRounded /> },
  { id: 'analytics', title: 'Analytics', icon: <AnalyticsRounded /> },
  { id: 'settings', title: 'Settings', icon: <SettingsRounded /> },
];

// Patient Form Dialog Component
const PatientFormDialog = ({ 
  open, 
  onClose, 
  onSubmit, 
  patient = null 
}: { 
  open: boolean; 
  onClose: () => void;
  onSubmit: (patientData: any) => void;
  patient?: any;
}) => {
  const [formData, setFormData] = useState({
    name: patient?.name || '',
    dob: patient?.dob || '',
    contact: patient?.contact || '',
    healthInfo: patient?.healthInfo || ''
  });

  useEffect(() => {
    if (patient) {
      setFormData({
        name: patient.name || '',
        dob: patient.dob || '',
        contact: patient.contact || '',
        healthInfo: patient.healthInfo || ''
      });
    } else {
      setFormData({
        name: '',
        dob: '',
        contact: '',
        healthInfo: ''
      });
    }
  }, [patient]);

  const handleSubmit = () => {
    if (!formData.name || !formData.dob || !formData.contact) {
      alert('Please fill in all required fields');
      return;
    }
    onSubmit({ ...formData, id: patient?.id });
    onClose();
    setFormData({ name: '', dob: '', contact: '', healthInfo: '' });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{patient ? 'Edit Patient' : 'Add New Patient'}</DialogTitle>
      <DialogContent>
        <Box display="flex" flexDirection="column" gap={2} style={{ marginTop: '10px' }}>
          <TextField
            label="Full Name *"
            variant="outlined"
            fullWidth
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
          />
          <TextField
            label="Date of Birth *"
            type="date"
            variant="outlined"
            InputLabelProps={{ shrink: true }}
            fullWidth
            value={formData.dob}
            onChange={(e) => setFormData({...formData, dob: e.target.value})}
          />
          <TextField
            label="Contact Number *"
            variant="outlined"
            fullWidth
            value={formData.contact}
            onChange={(e) => setFormData({...formData, contact: e.target.value})}
          />
          <TextField
            label="Health Information"
            multiline
            rows={3}
            variant="outlined"
            placeholder="Allergies, medical conditions, etc."
            fullWidth
            value={formData.healthInfo}
            onChange={(e) => setFormData({...formData, healthInfo: e.target.value})}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          {patient ? 'Update' : 'Add'} Patient
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// Incident Form Dialog Component (simplified without FileUpload for now)
const IncidentFormDialog = ({ 
  open, 
  onClose, 
  onSubmit, 
  incident = null 
}: { 
  open: boolean; 
  onClose: () => void;
  onSubmit: (incidentData: any) => void;
  incident?: any;
}) => {
  const { patients } = useData();
  const [formData, setFormData] = useState({
    patientId: incident?.patientId || '',
    title: incident?.title || '',
    description: incident?.description || '',
    comments: incident?.comments || '',
    appointmentDate: incident?.appointmentDate?.substring(0, 16) || '',
    cost: incident?.cost || 0,
    status: incident?.status || 'Scheduled'
  });

  useEffect(() => {
    if (incident) {
      setFormData({
        patientId: incident.patientId || '',
        title: incident.title || '',
        description: incident.description || '',
        comments: incident.comments || '',
        appointmentDate: incident.appointmentDate?.substring(0, 16) || '',
        cost: incident.cost || 0,
        status: incident.status || 'Scheduled'
      });
    } else {
      setFormData({ 
        patientId: '', 
        title: '', 
        description: '', 
        comments: '', 
        appointmentDate: '', 
        cost: 0, 
        status: 'Scheduled' 
      });
    }
  }, [incident]);

  const handleSubmit = () => {
    if (!formData.patientId || !formData.title || !formData.appointmentDate) {
      alert('Please fill in all required fields');
      return;
    }
    onSubmit({ 
      ...formData, 
      id: incident?.id,
      files: incident?.files || []
    });
    onClose();
    setFormData({ 
      patientId: '', title: '', description: '', comments: '', 
      appointmentDate: '', cost: 0, status: 'Scheduled' 
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{incident ? 'Edit Appointment' : 'Schedule New Appointment'}</DialogTitle>
      <DialogContent>
        <Box display="flex" flexDirection="column" gap={2} style={{ marginTop: '10px' }}>
          <FormControl fullWidth>
            <InputLabel>Patient *</InputLabel>
            <Select
              value={formData.patientId}
              onChange={(e) => setFormData({...formData, patientId: e.target.value})}
            >
              {patients.map((patient) => (
                <MenuItem key={patient.id} value={patient.id}>
                  {patient.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="Treatment Title *"
            variant="outlined"
            fullWidth
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
          />
          <TextField
            label="Description"
            multiline
            rows={2}
            variant="outlined"
            fullWidth
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
          />
          <TextField
            label="Appointment Date & Time *"
            type="datetime-local"
            variant="outlined"
            InputLabelProps={{ shrink: true }}
            fullWidth
            value={formData.appointmentDate}
            onChange={(e) => setFormData({...formData, appointmentDate: e.target.value})}
          />
          <Box display="flex" gap={2}>
            <TextField
              label="Cost ($)"
              type="number"
              variant="outlined"
              fullWidth
              value={formData.cost}
              onChange={(e) => setFormData({...formData, cost: Number(e.target.value)})}
            />
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={formData.status}
                onChange={(e) => setFormData({...formData, status: e.target.value})}
              >
                <MenuItem value="Scheduled">Scheduled</MenuItem>
                <MenuItem value="In Progress">In Progress</MenuItem>
                <MenuItem value="Completed">Completed</MenuItem>
                <MenuItem value="Cancelled">Cancelled</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <TextField
            label="Comments"
            multiline
            rows={2}
            variant="outlined"
            fullWidth
            value={formData.comments}
            onChange={(e) => setFormData({...formData, comments: e.target.value})}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          {incident ? 'Update' : 'Schedule'} Appointment
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// Content components
const OverviewContent = () => {
  const { patients, incidents } = useData();
  
  const kpis = useMemo(() => {
    const now = new Date();
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    
    const todayAppointments = incidents.filter(incident => {
      const appointmentDate = new Date(incident.appointmentDate);
      return appointmentDate.toDateString() === now.toDateString();
    }).length;
    
    const monthlyRevenue = incidents
      .filter(incident => {
        const appointmentDate = new Date(incident.appointmentDate);
        return appointmentDate >= thisMonth && appointmentDate < nextMonth && incident.status === 'Completed';
      })
      .reduce((sum, incident) => sum + incident.cost, 0);
    
    const pendingTreatments = incidents.filter(incident => 
      incident.status === 'Scheduled' || incident.status === 'In Progress'
    ).length;

    const upcomingAppointments = incidents
      .filter(incident => {
        const appointmentDate = new Date(incident.appointmentDate);
        return appointmentDate > now;
      })
      .sort((a, b) => new Date(a.appointmentDate).getTime() - new Date(b.appointmentDate).getTime())
      .slice(0, 10);

    return {
      totalPatients: patients.length,
      todayAppointments,
      monthlyRevenue,
      pendingTreatments,
      upcomingAppointments
    };
  }, [patients, incidents]);

  return (
    <div>
      <Typography variant="h4" gutterBottom>Admin Dashboard Overview</Typography>
      
      {/* KPI Cards */}
      <Box display="flex" flexWrap="wrap" gap={2} marginBottom="30px">
        <Card style={{ flex: '1', minWidth: '200px' }}>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>Total Patients</Typography>
            <Typography variant="h4">{kpis.totalPatients}</Typography>
          </CardContent>
        </Card>
        <Card style={{ flex: '1', minWidth: '200px' }}>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>Today's Appointments</Typography>
            <Typography variant="h4">{kpis.todayAppointments}</Typography>
          </CardContent>
        </Card>
        <Card style={{ flex: '1', minWidth: '200px' }}>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>Revenue This Month</Typography>
            <Typography variant="h4">${kpis.monthlyRevenue}</Typography>
          </CardContent>
        </Card>
        <Card style={{ flex: '1', minWidth: '200px' }}>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>Pending Treatments</Typography>
            <Typography variant="h4">{kpis.pendingTreatments}</Typography>
          </CardContent>
        </Card>
      </Box>

      {/* Next 10 Appointments */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>Next 10 Appointments</Typography>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Patient</TableCell>
                <TableCell>Treatment</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {kpis.upcomingAppointments.map((appointment) => {
                const patient = patients.find(p => p.id === appointment.patientId);
                return (
                  <TableRow key={appointment.id}>
                    <TableCell>{formatAppointmentDate(appointment.appointmentDate)}</TableCell>
                    <TableCell>{patient?.name || 'Unknown'}</TableCell>
                    <TableCell>{appointment.title}</TableCell>
                    <TableCell>
                      <Chip 
                        label={appointment.status} 
                        color={appointment.status === 'Scheduled' ? 'primary' : 'default'}
                        size="small"
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

const PatientsContent = () => {
  const { patients, addPatient, updatePatient, deletePatient } = useData();
  const [patientDialogOpen, setPatientDialogOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState<any>(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const handleAddPatient = (patientData: any) => {
    addPatient(patientData);
    setSnackbar({ open: true, message: 'Patient added successfully!', severity: 'success' });
  };

  const handleEditPatient = (patientData: any) => {
    updatePatient(patientData.id, patientData);
    setEditingPatient(null);
    setSnackbar({ open: true, message: 'Patient updated successfully!', severity: 'success' });
  };

  const handleDeletePatient = (patientId: string) => {
    if (window.confirm('Are you sure you want to delete this patient?')) {
      deletePatient(patientId);
      setSnackbar({ open: true, message: 'Patient deleted successfully!', severity: 'success' });
    }
  };

  return (
    <div>
      <Box display="flex" justifyContent="space-between" alignItems="center" marginBottom="20px">
        <Typography variant="h4">Patient Management</Typography>
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<AddRounded />}
          onClick={() => setPatientDialogOpen(true)}
        >
          Add New Patient
        </Button>
      </Box>
      
      <Card>
        <CardContent>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Date of Birth</TableCell>
                <TableCell>Contact</TableCell>
                <TableCell>Health Information</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {patients.map((patient) => (
                <TableRow key={patient.id}>
                  <TableCell>{patient.name}</TableCell>
                  <TableCell>{new Date(patient.dob).toLocaleDateString()}</TableCell>
                  <TableCell>{patient.contact}</TableCell>
                  <TableCell>{patient.healthInfo}</TableCell>
                  <TableCell>
                    <IconButton 
                      color="primary" 
                      onClick={() => {
                        setEditingPatient(patient);
                        setPatientDialogOpen(true);
                      }}
                    >
                      <EditRounded />
                    </IconButton>
                    <IconButton 
                      color="error" 
                      onClick={() => handleDeletePatient(patient.id)}
                    >
                      <DeleteRounded />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <PatientFormDialog
        open={patientDialogOpen}
        onClose={() => {
          setPatientDialogOpen(false);
          setEditingPatient(null);
        }}
        onSubmit={editingPatient ? handleEditPatient : handleAddPatient}
        patient={editingPatient}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity as any}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

const AppointmentsContent = () => {
  const { incidents, patients, addIncident, updateIncident, deleteIncident } = useData();
  const [incidentDialogOpen, setIncidentDialogOpen] = useState(false);
  const [editingIncident, setEditingIncident] = useState<any>(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const handleAddIncident = (incidentData: any) => {
    addIncident(incidentData);
    setSnackbar({ open: true, message: 'Appointment scheduled successfully!', severity: 'success' });
  };

  const handleEditIncident = (incidentData: any) => {
    updateIncident(incidentData.id, incidentData);
    setEditingIncident(null);
    setSnackbar({ open: true, message: 'Appointment updated successfully!', severity: 'success' });
  };

  const handleDeleteIncident = (incidentId: string) => {
    if (window.confirm('Are you sure you want to delete this appointment?')) {
      deleteIncident(incidentId);
      setSnackbar({ open: true, message: 'Appointment deleted successfully!', severity: 'success' });
    }
  };

  return (
    <div>
      <Box display="flex" justifyContent="space-between" alignItems="center" marginBottom="20px">
        <Typography variant="h4">Appointment Management</Typography>
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<AddRounded />}
          onClick={() => setIncidentDialogOpen(true)}
        >
          Schedule Appointment
        </Button>
      </Box>
      
      <Card>
        <CardContent>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Patient</TableCell>
                <TableCell>Date & Time</TableCell>
                <TableCell>Treatment</TableCell>
                <TableCell>Cost</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {incidents.map((incident) => {
                const patient = patients.find(p => p.id === incident.patientId);
                return (
                  <TableRow key={incident.id}>
                    <TableCell>{patient?.name || 'Unknown'}</TableCell>
                    <TableCell>{formatAppointmentDate(incident.appointmentDate)}</TableCell>
                    <TableCell>{incident.title}</TableCell>
                    <TableCell>${incident.cost}</TableCell>
                    <TableCell>
                      <Chip 
                        label={incident.status} 
                        color={
                          incident.status === 'Completed' ? 'success' : 
                          incident.status === 'Scheduled' ? 'primary' : 'default'
                        }
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton 
                        color="primary" 
                        onClick={() => {
                          setEditingIncident(incident);
                          setIncidentDialogOpen(true);
                        }}
                      >
                        <EditRounded />
                      </IconButton>
                      <IconButton 
                        color="error" 
                        onClick={() => handleDeleteIncident(incident.id)}
                      >
                        <DeleteRounded />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <IncidentFormDialog
        open={incidentDialogOpen}
        onClose={() => {
          setIncidentDialogOpen(false);
          setEditingIncident(null);
        }}
        onSubmit={editingIncident ? handleEditIncident : handleAddIncident}
        incident={editingIncident}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity as any}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

// Simplified content components
const TreatmentsContent = () => {
  const { incidents, patients } = useData();
  const completedTreatments = incidents.filter(incident => incident.status === 'Completed');

  return (
    <div>
      <Typography variant="h4" gutterBottom>Treatment Management</Typography>
      <Card>
        <CardContent>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Patient</TableCell>
                <TableCell>Treatment</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Cost</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {completedTreatments.map((treatment) => {
                const patient = patients.find(p => p.id === treatment.patientId);
                return (
                  <TableRow key={treatment.id}>
                    <TableCell>{patient?.name || 'Unknown'}</TableCell>
                    <TableCell>{treatment.title}</TableCell>
                    <TableCell>{formatAppointmentDate(treatment.appointmentDate)}</TableCell>
                    <TableCell>${treatment.cost}</TableCell>
                    <TableCell>
                      <Chip label={treatment.status} color="success" size="small" />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

const CalendarContent = () => {
  const { incidents, patients } = useData();
  
  return (
    <div>
      <Typography variant="h4" gutterBottom>Calendar View</Typography>
      <Card>
        <CardContent>
          <Typography>Calendar component would be displayed here</Typography>
          <Typography variant="body2" color="textSecondary">
            Total appointments: {incidents.length}
          </Typography>
        </CardContent>
      </Card>
    </div>
  );
};

const AnalyticsContent = () => {
  const { incidents, patients } = useData();

  const analytics = useMemo(() => {
    const treatmentCounts: { [key: string]: number } = {};
    incidents.forEach(incident => {
      treatmentCounts[incident.title] = (treatmentCounts[incident.title] || 0) + 1;
    });

    const patientVisits: { [key: string]: number } = {};
    incidents.forEach(incident => {
      patientVisits[incident.patientId] = (patientVisits[incident.patientId] || 0) + 1;
    });

    const topPatients = Object.entries(patientVisits)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([patientId, visits]) => {
        const patient = patients.find(p => p.id === patientId);
        return { patient: patient?.name || 'Unknown', visits };
      });

    return {
      treatmentCounts,
      topPatients,
      totalRevenue: incidents.filter(i => i.status === 'Completed').reduce((sum, i) => sum + i.cost, 0),
      averageVisitCost: (() => {
        const completedIncidents = incidents.filter(i => i.status === 'Completed');
        return completedIncidents.length > 0 ? 
          Math.round((completedIncidents.reduce((sum, i) => sum + i.cost, 0) / completedIncidents.length) * 100) / 100 : 0;
      })()
    };
  }, [incidents, patients]);

  return (
    <div>
      <Typography variant="h4" gutterBottom>Analytics & Reports</Typography>
      
      <Box display="flex" flexWrap="wrap" gap={2} marginBottom="30px">
        <Card style={{ flex: '1', minWidth: '300px' }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>Financial Overview</Typography>
            <Typography>Total Revenue: ${analytics.totalRevenue}</Typography>
            <Typography>Average Visit Cost: ${analytics.averageVisitCost}</Typography>
            <Typography>Total Appointments: {incidents.length}</Typography>
          </CardContent>
        </Card>
        
        <Card style={{ flex: '1', minWidth: '300px' }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>Top Patients by Visits</Typography>
            {analytics.topPatients.map((patient, index) => (
              <Typography key={index}>
                {index + 1}. {patient.patient} - {patient.visits} visits
              </Typography>
            ))}
          </CardContent>
        </Card>
      </Box>
      
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>Most Common Treatments</Typography>
          {Object.entries(analytics.treatmentCounts)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 10)
            .map(([treatment, count]) => (
              <Typography key={treatment}>
                {treatment}: {count} times
              </Typography>
            ))}
        </CardContent>
      </Card>
    </div>
  );
};

const SettingsContent = () => {
  const { reloadData } = useData();
  
  return (
    <div>
      <Typography variant="h4" gutterBottom>Settings</Typography>
      <Typography variant="body1" style={{ marginBottom: '20px' }}>
        Manage practice settings and configurations.
      </Typography>
      <Card style={{ maxWidth: 600, marginBottom: '20px' }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Practice Information</Typography>
          <Typography variant="body2">Name: DentalFlow Clinic</Typography>
          <Typography variant="body2">Address: 123 Healthcare Ave</Typography>
          <Typography variant="body2">Phone: (555) 987-6543</Typography>
          <Typography variant="body2">Email: admin@dentalflow.com</Typography>
          <Button variant="outlined" style={{ marginTop: '15px' }}>
            Edit Settings
          </Button>
        </CardContent>
      </Card>
      
      <Card style={{ maxWidth: 600 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Data Management</Typography>
          <Typography variant="body2" style={{ marginBottom: '15px' }}>
            Reload sample data with updated file attachments.
          </Typography>
          <Button 
            variant="contained" 
            color="secondary" 
            onClick={reloadData}
            style={{ marginTop: '10px' }}
          >
            Reload Sample Data
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default function AdminDashboard() {
  const [currentPage, setCurrentPage] = useState('overview');
  const { logOut } = useAuth();

  const renderContent = () => {
    switch (currentPage) {
      case 'overview':
        return <OverviewContent />;
      case 'patients':
        return <PatientsContent />;
      case 'appointments':
        return <AppointmentsContent />;
      case 'treatments':
        return <TreatmentsContent />;
      case 'calendar':
        return <CalendarContent />;
      case 'analytics':
        return <AnalyticsContent />;
      case 'settings':
        return <SettingsContent />;
      default:
        return <OverviewContent />;
    }
  };

  const drawerWidth = 240;

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <LocalHospitalRounded sx={{ mr: 2 }} />
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            DentalFlow - Admin Portal
          </Typography>
          <Button color="inherit" onClick={logOut} startIcon={<ExitToAppRounded />}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto' }}>
          <List>
            {navigationItems.map((item) => (
              <ListItem key={item.id} disablePadding>
                <ListItemButton 
                  selected={currentPage === item.id}
                  onClick={() => setCurrentPage(item.id)}
                >
                  <ListItemIcon>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.title} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        {renderContent()}
      </Box>
    </Box>
  );
}