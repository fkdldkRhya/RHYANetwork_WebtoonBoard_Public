import { IsNotEmpty, IsNotEmptyObject, IsObject, IsOptional, IsString } from "class-validator"
import { DefaultAuthInfoDTO } from "./auth-info-default.dto";
import { Type } from "class-transformer";

export class RuleBasedControllerLinkerQuery {
    @IsObject()
    @IsNotEmptyObject()
    @Type(() => DefaultAuthInfoDTO)
    defaultAuthInfoDTO: DefaultAuthInfoDTO;

    @IsNotEmpty()
    @IsString()
    path: string;

    @IsOptional()
    @IsString()
    parm: string = null;

    @IsOptional()
    body: any = null;
}