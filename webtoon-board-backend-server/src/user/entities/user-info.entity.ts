import { Entity, Column, PrimaryGeneratedColumn } from "typeorm"

export enum UserRole {
    DEFAULT = "DEFAULT",
    ADMIN = "ADMIN",
    DISABLED = "DISABLED"
}

@Entity('user')
export class UserInfoEntity {
    @PrimaryGeneratedColumn({name : "id", type: "bigint"})
    id: number;

    @Column({name : "user_id"})
    userId: string

    @Column({name : "user_password"})
    userPassword: string

    @Column({name : "user_hash_salt"})
    userHashSalt: string

    @Column({name : "user_name"})
    userName: string

    @Column({name : "user_email"})
    userEmail: string

    @Column({name : "user_description"})
    userDescription: string
    
    @Column({name : "role", enum : UserRole, default: UserRole.DEFAULT})
    role: UserRole

    @Column({name : "email_auth"})
    isEmailAuth: number
}

export class UserInfoEncryptEntityForFrontEndLoginOnly {
    session: string

    id: string

    userId: string

    userPassword: string

    userHashSalt: string

    userName: string

    userEmail: string

    userDescription: string
    
    role: UserRole

    isEmailAuth: number
}