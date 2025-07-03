import { patientsData } from '@/config/patientsData'
import { TableBody, TableCell, TableRow } from '@mui/material'
import React from 'react'

const PatientTableData = () => {
  return (
    <TableBody>
    {patientsData.map((patient) => (
      <TableRow
        key={patient.id}
        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
      >
        <TableCell component="th" scope="row">
          {patient.name}
        </TableCell>
        <TableCell align="right">{patient.dob}</TableCell>
        <TableCell align="right">{patient.contact}</TableCell>
        <TableCell align="right">{patient.healthInfo}</TableCell>
      </TableRow>
    ))}
  </TableBody>
  )
}

export default PatientTableData
