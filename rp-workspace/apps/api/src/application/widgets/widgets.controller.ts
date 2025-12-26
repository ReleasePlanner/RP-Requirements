import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
} from '@nestjs/common';
import { WidgetsService } from './widgets.service';
import { CreateWidgetDto } from './dto/create-widget.dto';
import { UpdateWidgetDto } from './dto/update-widget.dto';

@Controller('widgets')
export class WidgetsController {
  constructor(private readonly widgetsService: WidgetsService) {}

  @Post()
  create(@Body() createWidgetDto: CreateWidgetDto) {
    return this.widgetsService.create(createWidgetDto);
  }

  @Get()
  findAll() {
    return this.widgetsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const widget = await this.widgetsService.findOne(id);
    if (!widget) throw new NotFoundException('Widget not found');
    return widget;
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateWidgetDto: UpdateWidgetDto) {
    const widget = await this.widgetsService.update(id, updateWidgetDto);
    if (!widget) throw new NotFoundException('Widget not found');
    return widget;
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.widgetsService.remove(id);
  }
}
