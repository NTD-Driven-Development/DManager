export default class CreateUserDto {
    public readonly sid?: string
    public readonly email!: string
    public readonly name!: string
    public readonly role_ids!: number[]
}