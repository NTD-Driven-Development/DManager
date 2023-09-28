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
    email: string
    is_admin: boolean
    is_actived: boolean
    sid: string
    remark: string
    roles: Role[]
    permissions: Permission[]
}
