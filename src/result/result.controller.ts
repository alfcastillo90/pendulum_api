import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { CreateResultDto, GetResultDto } from './result.dto';
import { Result } from '../schemas/result.schema';
import { ResultService } from './result.service';

@ApiTags('results')
@Controller('results')
export class ResultController {
  constructor(private readonly resultService: ResultService) {}

  @ApiOperation({ summary: 'Crear un nuevo resultado' })
  @ApiResponse({
    status: 201,
    description: 'El resultado ha sido creado con éxito.',
  })
  @ApiBody({ type: CreateResultDto })
  @Post()
  async create(@Body() createResultDto: CreateResultDto): Promise<Result> {
    return this.resultService.create(createResultDto);
  }

  @ApiOperation({ summary: 'Obtener todos los resultados' })
  @ApiResponse({
    status: 200,
    description: 'Recuperados con éxito todos los resultados.',
    type: [GetResultDto],
  })
  @Get()
  async findAll(): Promise<Result[]> {
    return this.resultService.findAll();
  }

  @ApiOperation({ summary: 'Obtener un resultado por ID' })
  @ApiResponse({
    status: 200,
    description: 'Recuperado con éxito el resultado.',
    type: GetResultDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Resultado no encontrado.',
  })
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Result> {
    return this.resultService.findById(id);
  }
}
