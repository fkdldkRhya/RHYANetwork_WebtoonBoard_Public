import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class NaverWebtoonAnalyzeRequestCheckQuery {
    @IsNotEmpty()
    @IsString()
    @MaxLength(300)
    @MinLength(1)
    readonly token :string;
}