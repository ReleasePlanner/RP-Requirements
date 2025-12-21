import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength, IsOptional, IsBoolean } from 'class-validator';

export class CreateSponsorDto {
    @ApiProperty({ example: 'Sponsor Name' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ example: 'sponsor@example.com' })
    @IsEmail()
    email: string;

    @ApiProperty({ example: 'Password123!' })
    @IsString()
    @MinLength(6)
    password: string;

    @ApiProperty({ example: 'Sponsor', required: false })
    @IsString()
    @IsOptional()
    role?: string;

    @ApiProperty({ example: true, required: false })
    @IsBoolean()
    @IsOptional()
    isActive?: boolean;

    @ApiProperty({ description: 'Text Status', required: false })
    @IsString()
    @IsOptional()
    status?: string;
}
