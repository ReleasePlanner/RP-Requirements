import { IsString, IsNotEmpty, MaxLength, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMetricDto {
    @ApiProperty({
        description: 'The name of the metric',
        example: 'NPS',
    })
    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    name: string;

    @ApiProperty({
        description: 'The baseline value for the metric',
        example: '50',
        required: false
    })
    @IsString()
    @IsOptional()
    @MaxLength(255)
    baselineValue?: string;

    @ApiProperty({
        description: 'The target goal for the metric',
        example: '70',
        required: false
    })
    @IsString()
    @IsOptional()
    @MaxLength(255)
    targetGoal?: string;
}
