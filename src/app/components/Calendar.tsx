"use client"

import React, { useState, useMemo } from 'react';
import { 
  Box, 
  Button, 
  Typography, 
  Paper,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  Divider
} from '@mui/material';
import { 
  ChevronLeftRounded, 
  ChevronRightRounded,
  CloseRounded
} from '@mui/icons-material';

interface CalendarProps {
  appointments: Array<{
    id: string;
    patientId: string;
    title: string;
    appointmentDate: string;
    status: string;
  }>;
  patients: Array<{
    id: string;
    name: string;
  }>;
}

const Calendar: React.FC<CalendarProps> = ({ appointments, patients }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [dayDialogOpen, setDayDialogOpen] = useState(false);
  
  // Group appointments by date
  const appointmentsByDate = useMemo(() => {
    const grouped: { [key: string]: any[] } = {};
    appointments.forEach(appointment => {
      const date = new Date(appointment.appointmentDate).toDateString();
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(appointment);
    });
    return grouped;
  }, [appointments]);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const days = getDaysInMonth(selectedDate);
  const monthYear = selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const goToPreviousMonth = () => {
    setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 1));
  };

  const handleDayClick = (day: Date) => {
    setSelectedDay(day);
    setDayDialogOpen(true);
  };

  const handleCloseDayDialog = () => {
    setDayDialogOpen(false);
    setSelectedDay(null);
  };

  const selectedDayAppointments = selectedDay ? appointmentsByDate[selectedDay.toDateString()] || [] : [];

  return (
    <div>
      <Typography variant="h4" gutterBottom>Calendar View</Typography>
      
      <Box display="flex" justifyContent="space-between" alignItems="center" marginBottom="20px">
        <Button 
          startIcon={<ChevronLeftRounded />}
          onClick={goToPreviousMonth}
        >
          Previous Month
        </Button>
        <Typography variant="h5">{monthYear}</Typography>
        <Button 
          endIcon={<ChevronRightRounded />}
          onClick={goToNextMonth}
        >
          Next Month
        </Button>
      </Box>

      <Paper style={{ padding: '20px' }}>
        {/* Day Headers */}
        <Box display="flex" marginBottom="10px">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <Box 
              key={day} 
              flex={1} 
              textAlign="center" 
              fontWeight="bold" 
              padding="10px"
              style={{ borderBottom: '2px solid #e0e0e0' }}
            >
              {day}
            </Box>
          ))}
        </Box>
        
        {/* Calendar Grid */}
        <Box display="flex" flexWrap="wrap">
          {days.map((day, index) => {
            const dayAppointments = day ? appointmentsByDate[day.toDateString()] || [] : [];
            const isToday = day && day.toDateString() === new Date().toDateString();
            
            return (
                              <Box 
                  key={index} 
                  width="14.28%" 
                  minHeight="120px" 
                  border="1px solid #e0e0e0"
                  padding="5px"
                  onClick={() => day && handleDayClick(day)}
                  style={{ 
                    backgroundColor: isToday ? '#f0f8ff' : 'transparent',
                    borderColor: isToday ? '#2196f3' : '#e0e0e0',
                    cursor: day ? 'pointer' : 'default'
                  }}
                >
                {day && (
                  <>
                    <Typography 
                      variant="body2" 
                      style={{ 
                        fontWeight: isToday ? 'bold' : 'normal',
                        color: isToday ? '#2196f3' : 'inherit'
                      }}
                    >
                      {day.getDate()}
                    </Typography>
                    {dayAppointments.map(appointment => {
                      const patient = patients.find(p => p.id === appointment.patientId);
                      return (
                        <Card 
                          key={appointment.id} 
                          style={{ 
                            marginTop: '4px',
                            marginBottom: '2px',
                            backgroundColor: '#e3f2fd',
                            boxShadow: 'none'
                          }}
                        >
                          <CardContent style={{ padding: '4px 6px' }}>
                            <Typography variant="caption" display="block">
                              {new Date(appointment.appointmentDate).toLocaleTimeString('en-US', { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              })}
                            </Typography>
                            <Typography variant="caption" display="block" noWrap>
                              {patient?.name || 'Unknown'}
                            </Typography>
                            <Typography variant="caption" display="block" noWrap>
                              {appointment.title}
                            </Typography>
                            <Chip 
                              label={appointment.status} 
                              size="small"
                              style={{ 
                                fontSize: '10px', 
                                height: '16px',
                                marginTop: '2px'
                              }}
                              color={
                                appointment.status === 'Completed' ? 'success' : 
                                appointment.status === 'Scheduled' ? 'primary' : 'default'
                              }
                            />
                          </CardContent>
                        </Card>
                      );
                    })}
                  </>
                )}
              </Box>
            );
          })}
        </Box>
      </Paper>

      {/* Day Details Dialog */}
      <Dialog 
        open={dayDialogOpen} 
        onClose={handleCloseDayDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            Scheduled Treatments - {selectedDay?.toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
            <Button onClick={handleCloseDayDialog}>
              <CloseRounded />
            </Button>
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedDayAppointments.length > 0 ? (
            <List>
              {selectedDayAppointments.map((appointment, index) => {
                const patient = patients.find(p => p.id === appointment.patientId);
                return (
                  <React.Fragment key={appointment.id}>
                    <ListItem>
                      <ListItemText
                        primary={
                          <Box display="flex" justifyContent="space-between" alignItems="center">
                            <Typography variant="h6">
                              {new Date(appointment.appointmentDate).toLocaleTimeString('en-US', { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              })} - {appointment.title}
                            </Typography>
                            <Chip 
                              label={appointment.status} 
                              color={
                                appointment.status === 'Completed' ? 'success' : 
                                appointment.status === 'Scheduled' ? 'primary' : 'default'
                              }
                              size="small"
                            />
                          </Box>
                        }
                        secondary={
                          <Box marginTop="8px">
                            <Typography variant="body2">
                              <strong>Patient:</strong> {patient?.name || 'Unknown'}
                            </Typography>
                            {appointment.description && (
                              <Typography variant="body2">
                                <strong>Description:</strong> {appointment.description}
                              </Typography>
                            )}
                            {appointment.comments && (
                              <Typography variant="body2">
                                <strong>Comments:</strong> {appointment.comments}
                              </Typography>
                            )}
                            <Typography variant="body2">
                              <strong>Cost:</strong> ${appointment.cost}
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                    {index < selectedDayAppointments.length - 1 && <Divider />}
                  </React.Fragment>
                );
              })}
            </List>
          ) : (
            <Typography variant="body1" textAlign="center" padding="40px">
              No scheduled treatments for this day.
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDayDialog}>Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Calendar; 