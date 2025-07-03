export function checkIsAdmin(email:string):boolean{
    if(email.includes("admin")){
        return true
    }
    return false
}