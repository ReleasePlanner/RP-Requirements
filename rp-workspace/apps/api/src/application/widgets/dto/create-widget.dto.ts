import { IsString, IsEnum, IsBoolean, IsOptional, IsInt, IsObject } from 'class-validator';
import { WidgetType } from '../../../domain/entities/widget.entity';

export class CreateWidgetDto {
    @IsString()
    title: string;

    @IsEnum(WidgetType)
    type: WidgetType;

    @IsOptional()
    @IsObject()
    config?: any;

    @IsOptional()
    @IsBoolean()
    isVisible?: boolean;

    @IsOptional()
    @IsInt()
    defaultOrder?: number;
}
