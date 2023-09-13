export default class UpdateUserDto {
    public readonly id!: number
    // public readonly email?: string
    public readonly name?: string
    public readonly sid?: string
    public readonly role_ids?: number[]
}