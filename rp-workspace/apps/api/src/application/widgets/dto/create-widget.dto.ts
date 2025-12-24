import { IsString, IsEnum, IsBoolean, IsOptional, IsInt, IsObject } from 'class-validator';
import { WidgetType } from '../../../domain/entities/widget.entity';
import { WidgetConfig } from '@shared/types/widget.types';

/**
 * DTO for creating a widget
 */
export class CreateWidgetDto {
    @IsString()
    title: string;

    @IsEnum(WidgetType)
    type: WidgetType;

    @IsOptional()
    @IsObject()
    config?: WidgetConfig;

    @IsOptional()
    @IsBoolean()
    isVisible?: boolean;

    @IsOptional()
    @IsInt()
    defaultOrder?: number;
}
