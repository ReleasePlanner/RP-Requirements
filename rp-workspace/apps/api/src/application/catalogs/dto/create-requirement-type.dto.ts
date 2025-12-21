import { IsString, IsNotEmpty, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRequirementTypeDto {
    @ApiProperty({
        description: 'The name of the requirement type',
        example: 'Functional',
    })
    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    name: string;
}
