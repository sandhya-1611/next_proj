import { useAuth } from "@/app/context/AuthContext"
import { acceptableCredentials } from "@/app/utils/acceptableEmails"
import { checkIsAdmin } from "@/app/utils/checkIsAdmin"
import { Alert, AlertColor, Snackbar } from "@mui/material"
import { useState } from "react"
import { useData } from "../context/DataContext"

type LoginCredentials = {
    email: string,
    password: string
}

const Login = () => {
    const {logIn} = useAuth() // using the context provider.
    const {validateUser} = useData()
    const [loginCredentials, setLoginCredentials] = useState<LoginCredentials>({
        email: "",
        password: ""
    })

    const [openSnackbar, setOpenSnackbar] = useState({
        open: false,
        severity: "" //success, error
    })
    const [snackbarMessage, setSnackbarMessage] = useState("")

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        console.log(loginCredentials)

        const user = validateUser(loginCredentials.email,loginCredentials.password)
        if(!user){
            setSnackbarMessage("Invalid credentials")
            setOpenSnackbar({open: true, severity: "error"})
            return
        }
        
        // we are storing all info except the password for the logged in user.
        const loggedInUser = {
                email: user.email,
                isAdmin: user.isAdmin,
                ...(user.isAdmin ? {} : { patientId: user.patientId }),
                id: user.id,
                name: user.name
            }
        
        setSnackbarMessage("Login successful")
        setOpenSnackbar({open: true, severity: "success"})
        
        //sets the logged in user in the localStorage
        logIn(loggedInUser)
    }

  return (
    <section className="flex flex-col gap-4 items-center justify-center max-w-md w-full border border-gray-300 rounded-md p-4">
        <h2 className="text-2xl font-bold">Login</h2>
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
        <input type="text" placeholder="Email" className="w-full p-2 border border-gray-300 rounded-md"
        value={loginCredentials.email}
        onChange={(e) => setLoginCredentials((prev) => ({...prev,email: e.target.value}))}
        />
        <input type="password" placeholder="Password" className="w-full p-2 border border-gray-300 rounded-md"
        value={loginCredentials.password}
        onChange={(e) => setLoginCredentials((prev) => ({...prev,password: e.target.value}))}
        />
        <button type="submit" className="w-full cursor-pointer p-2 bg-blue-500 text-white rounded-md">Login</button>
</form>

<Snackbar
  open={openSnackbar.open}
  autoHideDuration={6000}
  onClose={() => setOpenSnackbar({open: false, severity: ""})}
>
<Alert
    onClose={() => setOpenSnackbar({open: false, severity: ""})}
    severity={openSnackbar.severity as AlertColor}
    variant="filled"
    sx={{ width: '100%' }}
  >
    {snackbarMessage}
  </Alert>
</Snackbar>
    </section>

    
  )
}

export default Login
