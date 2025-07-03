"use client"

import React, { createContext, useContext, useEffect, useState } from "react";
import { usersData } from "@/config/usersData";
import { hashPassword } from "../utils/hashPassword";
import { STORAGE_KEYS } from "@/config/constants";
import { patientsData } from "@/config/patientsData";
import { incidentData } from "@/config/incidentData";

type User = {
    id: string,
    name: string,
    hashedPassword: string,
    email: string,
    isAdmin: boolean
    patientId?: string
}

type Patient = {
    id: string;
    name: string;
    dob: string;
    contact: string;
    healthInfo: string;
}

type Incident = {
    id: string;
    patientId: string;
    title: string;
    description: string;
    comments: string;
    appointmentDate: string;
    cost: number;
    status: string;
    files: {name: string, url: string, type: string}[]
}

type DataContextType = {
    users: User[],
    patients: Patient[],
    incidents: Incident[],
    validateUser: (email: string, password: string) => User | undefined,
    addPatient: (patient: Patient) => void,
    updatePatient: (patientId: string,updatePatient: Patient) => void,
    deletePatient: (patientId: string) => void,
    addIncident: (incident: Incident) => void,
    updateIncident: (incidentId: string,updateIncident: Incident) => void,
    deleteIncident: (incidentId: string) => void,
    getIncidentsByPatientId: (patientId: string) => Incident[],
    getPatientById: (patientId: string) => Patient | null,
    reloadData: () => void,
    isLoading: boolean

}

const DataContext = createContext<DataContextType | undefined>(undefined)

export function DataProvider({children}: {children: React.ReactNode}){
    const [users, setUsers] = useState<User[]>([])
    const [patients, setPatients] = useState<Patient[]>([])
    const [incidents, setIncidents] = useState<Incident[]>([])
    const [isLoading, setIsLoading] = useState(true)

    //initialize data in local storage
    useEffect(() => {
        const isInitialized = localStorage.getItem(STORAGE_KEYS.INITIALIZED)

        if(!isInitialized){
            //set data in local storage
            localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(usersData))
            localStorage.setItem(STORAGE_KEYS.PATIENTS, JSON.stringify(patientsData))
            localStorage.setItem(STORAGE_KEYS.INCIDENTS, JSON.stringify(incidentData))
            localStorage.setItem(STORAGE_KEYS.INITIALIZED, "true")
        }

         // Load data from localStorage
    setUsers(JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]'));
    setPatients(JSON.parse(localStorage.getItem(STORAGE_KEYS.PATIENTS) || '[]'));
    setIncidents(JSON.parse(localStorage.getItem(STORAGE_KEYS.INCIDENTS) || '[]'));
    setIsLoading(false)
    },[])

    // Function to force reload data (useful for development)
    const reloadData = () => {
        localStorage.removeItem(STORAGE_KEYS.INITIALIZED);
        localStorage.removeItem(STORAGE_KEYS.USERS);
        localStorage.removeItem(STORAGE_KEYS.PATIENTS);
        localStorage.removeItem(STORAGE_KEYS.INCIDENTS);
        
        // Reinitialize with fresh data
        localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(usersData));
        localStorage.setItem(STORAGE_KEYS.PATIENTS, JSON.stringify(patientsData));
        localStorage.setItem(STORAGE_KEYS.INCIDENTS, JSON.stringify(incidentData));
        localStorage.setItem(STORAGE_KEYS.INITIALIZED, "true");
        
        // Reload state
        setUsers(JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]'));
        setPatients(JSON.parse(localStorage.getItem(STORAGE_KEYS.PATIENTS) || '[]'));
        setIncidents(JSON.parse(localStorage.getItem(STORAGE_KEYS.INCIDENTS) || '[]'));
    };

    const validateUser = (email:string,password:string): User | undefined => {
        const hashedPassword = hashPassword(password)

        return usersData.find(user => user.email === email && user.hashedPassword === hashedPassword)
    }

    // for adding, deleting,updating items, we follow the same pattern:

    // For adding:
    // Create a new object with the new item along with a unique id.
    // add it to the existing state.
    // then update the local storage with the new state.
   
    const addPatient = (patient: Patient) => {
        const newPatient = {
            ...patient,
            id: `p${patients.length + 1}`
        }
        const newPatientsList = [...patients,newPatient]
        setPatients(newPatientsList)
        localStorage.setItem(STORAGE_KEYS.PATIENTS,JSON.stringify(newPatientsList))
    }

     // for updating:
    // map through the state and update the item with the new data.
    // then update the local storage with the new state.
    const updatePatient = (patientId: string,updatePatient: Patient) => {
        const newPatientsList = patients.map((patient) => patient.id === patientId ? updatePatient : patient)
        setPatients(newPatientsList)
        localStorage.setItem(STORAGE_KEYS.PATIENTS,JSON.stringify(newPatientsList))
    }

      // for deleting:
    // filter out the item from the state.
    // then update the local storage with the new state.
    const deletePatient = (patientId: string) => {
        const newPatientsList = patients.filter((patient) => patient.id !== patientId)
        setPatients(newPatientsList)
        localStorage.setItem(STORAGE_KEYS.PATIENTS,JSON.stringify(newPatientsList))
    }

    const addIncident = (incident: Incident) => {
        const newIncident = {
            ...incident,
            id: `i${incidents.length + 1}`
        }
        const newIncidentsList = [...incidents,newIncident]
        setIncidents(newIncidentsList)
        localStorage.setItem(STORAGE_KEYS.INCIDENTS,JSON.stringify(newIncidentsList))
    }

    const updateIncident = (incidentId: string,updateIncident: Incident) => {
        const newIncidentsList = incidents.map((incident) => incident.id === incidentId ? updateIncident : incident)
        setIncidents(newIncidentsList)
        localStorage.setItem(STORAGE_KEYS.INCIDENTS,JSON.stringify(newIncidentsList))
    }

    const deleteIncident = (incidentId: string) => {
        const newIncidentsList = incidents.filter((incident) => incident.id !== incidentId)
        setIncidents(newIncidentsList)
        localStorage.setItem(STORAGE_KEYS.INCIDENTS,JSON.stringify(newIncidentsList))
    }
    
    const getIncidentsByPatientId = (patientId: string): Incident[] => {
        return incidents.filter(incident => incident.patientId === patientId)
    }

    const getPatientById = (patientId: string): Patient | null => {
        return patients.find(patient => patient.id === patientId) || null
    }

    const value = {
        users,
        patients,
        incidents,
        validateUser,
        addPatient,
        updatePatient,
        deletePatient,
        addIncident,
        updateIncident,
        deleteIncident,
        getIncidentsByPatientId,
        getPatientById,
        reloadData,
        isLoading
    }

    return <DataContext.Provider value={value} >
        {children}
    </DataContext.Provider>

}

export function useData(){
    const context = useContext(DataContext)
    if(!context){
        throw new Error("useData must be used within a DataProvider")
    }
    return context
}