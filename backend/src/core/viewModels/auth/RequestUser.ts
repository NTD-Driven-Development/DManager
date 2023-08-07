import UserModel from "../../../models/User"

interface Role {
    id: number
    name: string
}
interface Permission {
    id: number
    path: string
    method: string
}
export default interface RequestUser {
    id: number
    name: string
    is_admin: boolean
    is_active: boolean
    roles: Role[] 
    permissions: Permission[]
}