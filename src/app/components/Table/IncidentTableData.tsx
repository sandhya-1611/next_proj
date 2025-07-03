"use client"
import { TableBody, TableCell, TableRow } from '@mui/material'
import React from 'react'
import { formatAppointmentDateShort } from '@/app/utils/dateFormatter'
import { useAuth } from '@/app/context/AuthContext'
import { useData } from '@/app/context/DataContext'

const IncidentTableData = () => {

  const {getIncidentsByPatientId,isLoading,incidents} = useData()
  const {user} = useAuth()  // we are getting the logged in user

  const userIncidents = getIncidentsByPatientId(user?.patientId || "") // we are getting the incidents for the logged in user

  return (
    <TableBody>
    {isLoading ? (
      <TableRow>
        <TableCell colSpan={4} align="center">
          Loading...
        </TableCell>
      </TableRow>
    ) : userIncidents.map((incident) => (
      <TableRow
        key={incident.id}
        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
      >
        <TableCell component="th" scope="row">
          {incident.title}
        </TableCell>
        <TableCell align="right">{formatAppointmentDateShort(incident.appointmentDate)}</TableCell>
        <TableCell align="right">{incident.cost}</TableCell>
        <TableCell align="right">{incident.status}</TableCell>
      </TableRow>
    ))}
  </TableBody>
  )
}

export default IncidentTableData
