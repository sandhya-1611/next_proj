import { useNavigate } from "react-router-dom";
import { createContext, useContext, useEffect, useState } from "react";

type User = {
    email: string,
    isAdmin: boolean
    patientId?: string
    id: string
    name: string
} | null

type AuthContextType = {
    user: User,
    logIn: (userData: User) => void,
    logOut: () => void
}

const Authcontext = createContext<AuthContextType | undefined>(undefined) 

export function AuthProvider({children}: {children: React.ReactNode}){
 
    const [user, setUser] = useState<User>(null)
    const navigate = useNavigate()

    useEffect(() => {
        // check localStorage for loggedInUser
        const loggedInUser = localStorage.getItem("loggedInUser")

        if(loggedInUser){
            const userData = JSON.parse(loggedInUser)
            setUser(userData)
            // navigate them to the respective dashboard using the parsed data directly
            if(userData && userData.isAdmin){
                navigate("/admin/dashboard")
            }else{
                navigate("/patient/dashboard")
            }
        }
        else{
            // if no user is loggen in, redirect them to the login page
            navigate("/")
        }
    },[navigate])

    const logIn = (userData: User) => {
        setUser(userData)
        localStorage.setItem("loggedInUser",JSON.stringify(userData))
        if(userData && userData.isAdmin){
            navigate("/admin/dashboard")
        }else{
            navigate("/patient/dashboard")
        }
    }

    const logOut = () => {
        setUser(null)
        localStorage.removeItem("loggedInUser")
        navigate("/")
    }

    return <Authcontext.Provider value={{user, logIn, logOut}}>{children}</Authcontext.Provider>
}

export function useAuth(){
    const context = useContext(Authcontext)
    if(!context){
        throw new Error("useAuth must be used within an AuthProvider")
    }
    return context
}