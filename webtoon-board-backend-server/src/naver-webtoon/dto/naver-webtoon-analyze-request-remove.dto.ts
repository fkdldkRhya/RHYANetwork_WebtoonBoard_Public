import { IsNotEmpty, IsNumber, IsString, MaxLength, Min, MinLength } from "class-validator";

export class NaverWebtoonAnalyzeRequestRemoveQuery {
    @IsNotEmpty()
    @IsString()
    @MaxLength(300)
    @MinLength(1)
    readonly token :string;
}

export class NaverWebtoonAnalyzeRequestRemoveForAdminQuery {
    @IsNotEmpty()
    @IsNumber()
    @Min(1)
    readonly id : number;
}