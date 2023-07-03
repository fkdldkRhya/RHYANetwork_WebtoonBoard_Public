import { IsEmail, IsEnum, IsNotEmpty, IsNumber, IsString, Min } from "class-validator";
import { EmailAuthType } from "../entities/mail-auth.entities";

export class EmailSendData {
    @IsNotEmpty()
    @IsNumber()
    @Min(0)
    id: number

    @IsEmail()
    @IsString()
    @IsNotEmpty()
    target: string

    @IsString()
    @IsNotEmpty()
    userId: string

    @IsEnum(EmailAuthType)
    @IsNotEmpty()
    authType: EmailAuthType
}