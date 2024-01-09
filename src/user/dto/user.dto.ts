import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsEmail, IsIn, IsString } from "class-validator";

export class UserDto {
    @ApiProperty({ description: 'user_id', type: Number })
    user_id: number

    @IsString()
    @IsEmail()
    @ApiProperty({ description: 'email', type: String })
    email: string

    @ApiProperty({ description: 'name', type: String })
    @IsString()
    name: string

    @ApiProperty({ description: 'password', type: String })
    @IsString()
    password: string

    @ApiProperty({ description: 'birthday', type: Date })
    @IsDateString()
    birthday: Date

    @ApiProperty({ description: 'gender', type: String })
    @IsIn(['Male', 'Female', 'Other'])
    gender: string

    @ApiProperty({ description: 'phone', type: String })
    @IsString()
    phone: string

    @ApiProperty({ description: 'role', type: String })
    @IsIn(['Customer', 'Admin'])
    role: string
}

export class FileUploadDto {
    @ApiProperty({ type: 'string', format: 'binary' })
    file: any
}