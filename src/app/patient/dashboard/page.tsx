"use client"
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { AppProvider } from '@toolpad/core/AppProvider';
import { Navigation } from '@toolpad/core';
import { useState, useMemo } from 'react';
import { 
  CalendarTodayRounded, 
  HistoryRounded, 
  PersonRounded,
  ExitToAppRounded,
  LocalHospitalRounded,
  AddRounded
} from '@mui/icons-material';
import { Typography, Card, CardContent, Button, Box, TextField, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';

// Navigation configuration for patient dashboard
const NAVIGATION: Navigation = [
  {
    segment: 'upcoming',
    title: 'Upcoming Appointments',
    icon: <CalendarTodayRounded />,
  },
  {
    segment: 'history',
    title: 'Appointment History',
    icon: <HistoryRounded />,
  },
  {
    segment: 'profile',
    title: 'Profile',
    icon: <PersonRounded />,
  },
  {
    kind: 'divider',
  },
  {
    segment: 'logout',
    title: 'Logout',
    icon: <ExitToAppRounded />,
    action: true,
  },
];

// Helper function to format date
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
};

// Helper function to format time
const formatTime = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
};

// Content components for each section
const UpcomingAppointmentsContent = ({ 
  onCreateAppointment, 
  upcomingIncidents 
}: { 
  onCreateAppointment: () => void;
  upcomingIncidents: any[];
}) => {
  const nextAppointment = upcomingIncidents[0];
  
  return (
    <div>
      <Typography variant="h4" gutterBottom>Upcoming Appointments</Typography>
      <Typography variant="body1" style={{ marginBottom: '20px' }}>
        View and manage your scheduled dental appointments.
      </Typography>
      
      <Button 
        variant="contained" 
        color="primary" 
        startIcon={<AddRounded />}
        onClick={onCreateAppointment}
        style={{ marginBottom: '20px' }}
      >
        Schedule New Appointment
      </Button>
      
      <Box display="flex" flexWrap="wrap" gap={2} style={{ marginBottom: '20px' }}>
        <Box flex="1" minWidth="250px">
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Next Appointment</Typography>
              {nextAppointment ? (
                <>
                  <Typography color="textSecondary">{formatDate(nextAppointment.appointmentDate)}</Typography>
                  <Typography variant="body2">{formatTime(nextAppointment.appointmentDate)} - {nextAppointment.title}</Typography>
                  <Typography variant="body2">{nextAppointment.description}</Typography>
                  <Typography variant="body2">Status: {nextAppointment.status}</Typography>
                  <Button variant="outlined" size="small" style={{ marginTop: '10px' }}>
                    Reschedule
                  </Button>
                </>
              ) : (
                <Typography color="textSecondary">No upcoming appointments</Typography>
              )}
            </CardContent>
          </Card>
        </Box>
        <Box flex="1" minWidth="250px">
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Upcoming This Month</Typography>
              <Typography color="textSecondary">{upcomingIncidents.length} appointments scheduled</Typography>
              <Typography variant="body2">
                {upcomingIncidents.length > 0 
                  ? `Next: ${formatDate(upcomingIncidents[0]?.appointmentDate)}${upcomingIncidents[1] ? ` • Following: ${formatDate(upcomingIncidents[1]?.appointmentDate)}` : ''}`
                  : 'No upcoming appointments'
                }
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* Custom table for upcoming appointments */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>Upcoming Appointments List</Typography>
          {upcomingIncidents.length > 0 ? (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #e0e0e0' }}>
                    <th style={{ padding: '12px', textAlign: 'left' }}>Date</th>
                    <th style={{ padding: '12px', textAlign: 'left' }}>Time</th>
                    <th style={{ padding: '12px', textAlign: 'left' }}>Treatment</th>
                    <th style={{ padding: '12px', textAlign: 'left' }}>Description</th>
                    <th style={{ padding: '12px', textAlign: 'left' }}>Status</th>
                    <th style={{ padding: '12px', textAlign: 'left' }}>Cost</th>
                  </tr>
                </thead>
                <tbody>
                  {upcomingIncidents.map((incident, index) => (
                    <tr key={incident.id} style={{ borderBottom: '1px solid #e0e0e0' }}>
                      <td style={{ padding: '12px' }}>{formatDate(incident.appointmentDate)}</td>
                      <td style={{ padding: '12px' }}>{formatTime(incident.appointmentDate)}</td>
                      <td style={{ padding: '12px' }}>{incident.title}</td>
                      <td style={{ padding: '12px' }}>{incident.description}</td>
                      <td style={{ padding: '12px' }}>
                        <span style={{ 
                          padding: '4px 8px', 
                          borderRadius: '4px', 
                          backgroundColor: incident.status === 'Scheduled' ? '#e3f2fd' : '#fff3e0',
                          color: incident.status === 'Scheduled' ? '#1976d2' : '#f57c00'
                        }}>
                          {incident.status}
                        </span>
                      </td>
                      <td style={{ padding: '12px' }}>${incident.cost}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <Typography color="textSecondary">No upcoming appointments found.</Typography>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

const AppointmentHistoryContent = ({ completedIncidents }: { completedIncidents: any[] }) => {
  const currentYear = new Date().getFullYear();
  const thisYearIncidents = completedIncidents.filter(incident => 
    new Date(incident.appointmentDate).getFullYear() === currentYear
  );
  const lastAppointment = completedIncidents[0];

  return (
    <div>
      <Typography variant="h4" gutterBottom>Appointment History</Typography>
      <Typography variant="body1" style={{ marginBottom: '20px' }}>
        View your completed and past appointments.
      </Typography>
      
      <Box display="flex" flexWrap="wrap" gap={2} style={{ marginBottom: '20px' }}>
        <Box flex="1" minWidth="200px">
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Appointments
              </Typography>
              <Typography variant="h5" component="div">
                {completedIncidents.length}
              </Typography>
            </CardContent>
          </Card>
        </Box>
        <Box flex="1" minWidth="200px">
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                This Year
              </Typography>
              <Typography variant="h5" component="div">
                {thisYearIncidents.length}
              </Typography>
            </CardContent>
          </Card>
        </Box>
        <Box flex="1" minWidth="200px">
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Last Appointment
              </Typography>
              <Typography variant="h5" component="div">
                {lastAppointment ? formatDate(lastAppointment.appointmentDate).split(',')[0] : 'None'}
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* Custom table for appointment history */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>Appointment History</Typography>
          {completedIncidents.length > 0 ? (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #e0e0e0' }}>
                    <th style={{ padding: '12px', textAlign: 'left' }}>Date</th>
                    <th style={{ padding: '12px', textAlign: 'left' }}>Treatment</th>
                    <th style={{ padding: '12px', textAlign: 'left' }}>Description</th>
                    <th style={{ padding: '12px', textAlign: 'left' }}>Cost</th>
                    <th style={{ padding: '12px', textAlign: 'left' }}>Status</th>
                    <th style={{ padding: '12px', textAlign: 'left' }}>Comments</th>
                  </tr>
                </thead>
                <tbody>
                  {completedIncidents.map((incident, index) => (
                    <tr key={incident.id} style={{ borderBottom: '1px solid #e0e0e0' }}>
                      <td style={{ padding: '12px' }}>{formatDate(incident.appointmentDate)}</td>
                      <td style={{ padding: '12px' }}>{incident.title}</td>
                      <td style={{ padding: '12px' }}>{incident.description}</td>
                      <td style={{ padding: '12px' }}>${incident.cost}</td>
                      <td style={{ padding: '12px' }}>
                        <span style={{ 
                          padding: '4px 8px', 
                          borderRadius: '4px', 
                          backgroundColor: '#e8f5e8',
                          color: '#2e7d32'
                        }}>
                          {incident.status}
                        </span>
                      </td>
                      <td style={{ padding: '12px' }}>{incident.comments || 'No comments'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <Typography color="textSecondary">No appointment history found.</Typography>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

const ProfileContent = ({ user, patient }: { user: any; patient: any }) => (
  <div>
    <Typography variant="h4" gutterBottom>Patient Profile</Typography>
    <Typography variant="body1" style={{ marginBottom: '20px' }}>
      Manage your personal information and preferences.
    </Typography>
    
    <Box display="flex" flexWrap="wrap" gap={3}>
      <Box flex="1" minWidth="400px">
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>Personal Information</Typography>
            <Box display="flex" flexDirection="column" gap={2}>
              <TextField 
                label="Full Name" 
                defaultValue={patient?.name || user?.name || ''} 
                variant="outlined" 
              />
              <TextField 
                label="Email" 
                defaultValue={user?.email || ''} 
                variant="outlined" 
              />
              <TextField 
                label="Phone" 
                defaultValue={patient?.contact || ''} 
                variant="outlined" 
              />
              <TextField 
                label="Date of Birth" 
                defaultValue={patient?.dob || ''} 
                type="date" 
                variant="outlined" 
                InputLabelProps={{ shrink: true }} 
              />
              <TextField 
                label="Address" 
                defaultValue="Address not available" 
                variant="outlined" 
                multiline 
                rows={2} 
              />
            </Box>
            <Button variant="contained" style={{ marginTop: '15px' }}>
              Update Profile
            </Button>
          </CardContent>
        </Card>
      </Box>
      
      <Box flex="1" minWidth="300px">
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>Medical Information</Typography>
            <Typography variant="body2" style={{ marginBottom: '10px' }}>
              Health Information: {patient?.healthInfo || 'No information available'}
            </Typography>
            <Typography variant="body2" style={{ marginBottom: '10px' }}>
              Insurance Provider: Not specified
            </Typography>
            <Typography variant="body2" style={{ marginBottom: '10px' }}>
              Policy Number: Not specified
            </Typography>
            <Typography variant="body2" style={{ marginBottom: '10px' }}>
              Emergency Contact: Not specified
            </Typography>
            <Typography variant="body2" style={{ marginBottom: '15px' }}>
              Patient ID: {patient?.id || 'N/A'}
            </Typography>
            <Button variant="outlined">
              Update Medical Info
            </Button>
          </CardContent>
        </Card>
        
        <Card style={{ marginTop: '20px' }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>Account Information</Typography>
            <Typography variant="body2" style={{ marginBottom: '10px' }}>
              User ID: {user?.id || 'N/A'}
            </Typography>
            <Typography variant="body2" style={{ marginBottom: '10px' }}>
              Account Type: {user?.isAdmin ? 'Admin' : 'Patient'}
            </Typography>
            <Typography variant="body2" style={{ marginBottom: '15px' }}>
              Linked Patient ID: {user?.patientId || 'N/A'}
            </Typography>
            <Button variant="outlined">
              Update Preferences
            </Button>
          </CardContent>
        </Card>
      </Box>
    </Box>
  </div>
);

// New appointment dialog component
const NewAppointmentDialog = ({ 
  open, 
  onClose, 
  onSubmit 
}: { 
  open: boolean; 
  onClose: () => void;
  onSubmit: (appointmentData: any) => void;
}) => {
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    treatment: '',
    notes: ''
  });

  const handleSubmit = () => {
    onSubmit(formData);
    onClose();
    setFormData({ date: '', time: '', treatment: '', notes: '' });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Schedule New Appointment</DialogTitle>
      <DialogContent>
        <Box display="flex" flexDirection="column" gap={2} style={{ marginTop: '10px' }}>
          <TextField
            label="Preferred Date"
            type="date"
            variant="outlined"
            InputLabelProps={{ shrink: true }}
            fullWidth
            value={formData.date}
            onChange={(e) => setFormData({...formData, date: e.target.value})}
          />
          <TextField
            label="Preferred Time"
            type="time"
            variant="outlined"
            InputLabelProps={{ shrink: true }}
            fullWidth
            value={formData.time}
            onChange={(e) => setFormData({...formData, time: e.target.value})}
          />
          <TextField
            label="Treatment Type"
            select
            variant="outlined"
            fullWidth
            SelectProps={{ native: true }}
            value={formData.treatment}
            onChange={(e) => setFormData({...formData, treatment: e.target.value})}
          >
            <option value="">Select treatment</option>
            <option value="Routine Cleaning">Routine Cleaning</option>
            <option value="Regular Checkup">Regular Checkup</option>
            <option value="Dental Filling">Dental Filling</option>
            <option value="Teeth Whitening">Teeth Whitening</option>
            <option value="Emergency Visit">Emergency Visit</option>
            <option value="Root Canal">Root Canal</option>
            <option value="Tooth Extraction">Tooth Extraction</option>
          </TextField>
          <TextField
            label="Notes (Optional)"
            multiline
            rows={3}
            variant="outlined"
            placeholder="Any specific concerns or requests..."
            fullWidth
            value={formData.notes}
            onChange={(e) => setFormData({...formData, notes: e.target.value})}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Schedule Appointment
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const PatientDashboard = () => {
  const [currentPage, setCurrentPage] = useState('upcoming');
  const [appointmentDialogOpen, setAppointmentDialogOpen] = useState(false);
  const { user, logOut } = useAuth();
  const { getIncidentsByPatientId, getPatientById, addIncident, isLoading } = useData();

  // Get patient data and incidents
  const patient = user?.patientId ? getPatientById(user.patientId) : null;
  const allIncidents = user?.patientId ? getIncidentsByPatientId(user.patientId) : [];

  // Separate upcoming and completed appointments
  const { upcomingIncidents, completedIncidents } = useMemo(() => {
    const now = new Date();
    const upcoming = allIncidents.filter(incident => 
      incident.status === 'Scheduled' || incident.status === 'In Progress' || 
      new Date(incident.appointmentDate) > now
    ).sort((a, b) => new Date(a.appointmentDate).getTime() - new Date(b.appointmentDate).getTime());
    
    const completed = allIncidents.filter(incident => 
      incident.status === 'Completed'
    ).sort((a, b) => new Date(b.appointmentDate).getTime() - new Date(a.appointmentDate).getTime());
    
    return { upcomingIncidents: upcoming, completedIncidents: completed };
  }, [allIncidents]);

  const handleNavigation = (segment: string) => {
    if (segment === 'logout') {
      logOut();
      return;
    }
    setCurrentPage(segment);
  };

  const handleCreateAppointment = () => {
    setAppointmentDialogOpen(true);
  };

  const handleSubmitAppointment = (appointmentData: any) => {
    if (!user?.patientId) return;
    
    // Create appointment date string
    const appointmentDate = `${appointmentData.date}T${appointmentData.time}:00`;
    
    const newIncident = {
      id: '', // Will be auto-generated in addIncident
      patientId: user.patientId,
      title: appointmentData.treatment,
      description: appointmentData.notes || 'Patient scheduled appointment',
      comments: '',
      appointmentDate: appointmentDate,
      cost: 0, // Cost to be determined
      status: 'Scheduled',
      files: []
    };
    
    addIncident(newIncident);
  };

  const renderContent = () => {
    if (isLoading) {
      return <Typography>Loading...</Typography>;
    }

    switch (currentPage) {
      case 'upcoming':
        return <UpcomingAppointmentsContent 
          onCreateAppointment={handleCreateAppointment} 
          upcomingIncidents={upcomingIncidents}
        />;
      case 'history':
        return <AppointmentHistoryContent completedIncidents={completedIncidents} />;
      case 'profile':
        return <ProfileContent user={user} patient={patient} />;
      default:
        return <UpcomingAppointmentsContent 
          onCreateAppointment={handleCreateAppointment} 
          upcomingIncidents={upcomingIncidents}
        />;
    }
  };

  return (
    <AppProvider
      navigation={NAVIGATION}
      branding={{
        title: 'DentalFlow - Patient Portal',
        logo: <LocalHospitalRounded />,
      }}
      router={{
        pathname: `/${currentPage}`,
        searchParams: new URLSearchParams(),
        navigate: (path) => {
          const pathStr = typeof path === 'string' ? path : path.toString();
          const segment = pathStr.replace('/', '') || 'upcoming';
          handleNavigation(segment);
        },
      }}
    >
      <DashboardLayout>
        <div style={{ padding: '20px' }}>
          {renderContent()}
        </div>
      </DashboardLayout>
      
      <NewAppointmentDialog 
        open={appointmentDialogOpen} 
        onClose={() => setAppointmentDialogOpen(false)}
        onSubmit={handleSubmitAppointment}
      />
    </AppProvider>
  )
}

export default PatientDashboard
