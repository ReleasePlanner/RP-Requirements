import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductOwnerDto {
  @ApiProperty({ example: 'John' })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({ example: 'Product Manager' })
  @IsString()
  @IsNotEmpty()
  role: string;

  @ApiProperty({ example: 'Active', required: false })
  @IsString()
  @IsOptional()
  status?: string;
}
