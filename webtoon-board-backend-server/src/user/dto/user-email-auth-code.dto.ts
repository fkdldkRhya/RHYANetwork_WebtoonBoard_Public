import { IsEnum, IsNotEmpty, IsNumber, IsString, Max, MaxLength, Min, MinLength } from "class-validator"
import { EmailAuthType } from "src/util/email/entities/mail-auth.entities"

export class UserEmailAuthCodeQuery {
    @IsNotEmpty()
    @IsNumber()
    @Min(0)
    readonly id: number

    @IsNotEmpty()
    @IsString()
    @MaxLength(128)
    @MinLength(128)
    readonly requestCode: string

    @IsNotEmpty()
    @IsNumber()
    @Min(100000)
    @Max(999999)
    readonly code: number

    @IsNotEmpty()
    @IsEnum(EmailAuthType)
    readonly type: EmailAuthType
}