import { PartialType } from '@nestjs/mapped-types';
import { CreateProductOwnerDto } from './create-product-owner.dto';

export class UpdateProductOwnerDto extends PartialType(CreateProductOwnerDto) {}
