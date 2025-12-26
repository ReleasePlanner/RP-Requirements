import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Widget } from '../../domain/entities/widget.entity';
import { CreateWidgetDto } from './dto/create-widget.dto';
import { UpdateWidgetDto } from './dto/update-widget.dto';

@Injectable()
export class WidgetsService {
  constructor(
    @InjectRepository(Widget)
    private widgetRepository: Repository<Widget>,
  ) {}

  async create(createWidgetDto: CreateWidgetDto): Promise<Widget> {
    const widget = this.widgetRepository.create(createWidgetDto);
    return await this.widgetRepository.save(widget);
  }

  async findAll(): Promise<Widget[]> {
    return await this.widgetRepository.find({
      order: {
        defaultOrder: 'ASC',
      },
    });
  }

  async findOne(id: string): Promise<Widget | null> {
    return await this.widgetRepository.findOne({ where: { widgetId: id } });
  }

  async update(id: string, updateWidgetDto: UpdateWidgetDto): Promise<Widget | null> {
    const updateData: Record<string, unknown> = {};
    if (updateWidgetDto.title !== undefined) {
      updateData.title = updateWidgetDto.title;
    }
    if (updateWidgetDto.type !== undefined) {
      updateData.type = updateWidgetDto.type;
    }
    if (updateWidgetDto.config !== undefined) {
      updateData.config = updateWidgetDto.config;
    }
    if (updateWidgetDto.isVisible !== undefined) {
      updateData.isVisible = updateWidgetDto.isVisible;
    }
    if (updateWidgetDto.defaultOrder !== undefined) {
      updateData.defaultOrder = updateWidgetDto.defaultOrder;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await this.widgetRepository.update(id, updateData as any);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.widgetRepository.delete(id);
  }
}
