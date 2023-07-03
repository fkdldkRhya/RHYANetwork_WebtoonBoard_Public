import { Max, Min } from "class-validator"
import { Entity, Column, PrimaryColumn, Timestamp } from "typeorm"

export enum EmailAuthType {
    SIGNUP = "SIGNUP"
}

@Entity('account_email_verify')
export class AccountEmailAuthEntity {
    @PrimaryColumn({name : "user_account_id"})
    id: number
    
    @Column({name : "type", enum : EmailAuthType, default: EmailAuthType.SIGNUP})
    authType: EmailAuthType

    @Column({name : "request_code"})
    requestCode: string

    @Column({name : "request_date", type : "timestamp"})
    requestDate: Timestamp

    @Column({name : "verify_code"})
    @Min(100000)
    @Max(999999)
    verifyCode: number
}