import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateApproverDto {
  @ApiProperty({ example: 'Jane' })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ example: 'Smith' })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({ example: 'Sponsor' })
  @IsString()
  @IsNotEmpty()
  role: string;

  @ApiProperty({ example: 'Active', required: false })
  @IsString()
  @IsOptional()
  status?: string;
}

export class UpdateApproverDto extends PartialType(CreateApproverDto) {}
