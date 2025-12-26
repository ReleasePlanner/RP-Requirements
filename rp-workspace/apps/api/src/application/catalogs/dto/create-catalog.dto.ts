import { IsString, IsNotEmpty, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCatalogDto {
  @ApiProperty({
    description: 'The name of the catalog item',
    example: 'High',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;
}
