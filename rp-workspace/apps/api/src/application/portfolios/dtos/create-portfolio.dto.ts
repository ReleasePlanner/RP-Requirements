import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';

export class CreatePortfolioDto {
    @ApiProperty({ description: 'The name of the portfolio' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ description: 'The user ID of the sponsor', required: false })
    @IsUUID()
    @IsOptional()
    sponsorId?: string;

    @ApiProperty({ description: 'The status of the portfolio', required: false })
    @IsString()
    @IsOptional()
    status?: string;
}
