import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { AnnouncementService } from './announcement.service';
import { AnnouncementPathParamDto } from './dto/announcement-path-param.dto';
import { AnnouncementQueryDto } from './dto/announcement-query.dto';
import { CreateAnnouncementDto } from './dto/create-announcement.dto';
import { GetAnnouncementDto } from './dto/get-announcement.dto';
import { GetAnnouncementListDto } from './dto/get-announcement-list.dto';
import { UpdateAnnouncementDto } from './dto/update-announcement.dto';
import { RestApiResponseObject } from 'src/common/decorators/api-response-object.decorator';

@Controller({
  version: '1',
  path: 'announcements',
})
export class AnnouncementController {
  constructor(private readonly announcementService: AnnouncementService) {}

  @RestApiResponseObject(
    GetAnnouncementListDto,
    'List announcements',
    'Announcements have been fetched successfully',
    'Returns one page of announcements together with the total number of matches. Sorted by last update descending by default, which is the order the announcements table renders. The optional text search matches the title and the body, and the optional category filter keeps announcements carrying at least one of the given categories — filtered announcements still return their full category list.',
    'Announcement',
  )
  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(
    @Query() query: AnnouncementQueryDto,
  ): Promise<GetAnnouncementListDto> {
    return this.announcementService.findAll(query);
  }

  @RestApiResponseObject(
    GetAnnouncementDto,
    'Get an announcement',
    'Announcement has been fetched successfully',
    'Gets one announcement by its numeric id, including its categories. This is what the edit form loads to prefill its fields.',
    'Announcement',
  )
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(
    @Param() params: AnnouncementPathParamDto,
  ): Promise<GetAnnouncementDto> {
    return this.announcementService.findOne(params.id);
  }

  @RestApiResponseObject(
    GetAnnouncementDto,
    'Create an announcement',
    'Announcement has been created successfully',
    'Creates an announcement. Title, body, publication date and at least one existing category are all required. On success every websocket client subscribed to the announcements namespace receives an announcementCreated message carrying the new announcement.',
    'Announcement',
  )
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createAnnouncementDto: CreateAnnouncementDto,
  ): Promise<GetAnnouncementDto> {
    return this.announcementService.create(createAnnouncementDto);
  }

  @RestApiResponseObject(
    GetAnnouncementDto,
    'Update an announcement',
    'Announcement has been updated successfully',
    'Updates an announcement. Every field is optional and only the supplied ones change, but categoryIds replaces the whole category set rather than merging into it. Any successful update moves the last-update timestamp forward, including one that only changes the categories.',
    'Announcement',
  )
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param() params: AnnouncementPathParamDto,
    @Body() updateAnnouncementDto: UpdateAnnouncementDto,
  ): Promise<GetAnnouncementDto> {
    return this.announcementService.update(params.id, updateAnnouncementDto);
  }

  @RestApiResponseObject(
    null,
    'Delete an announcement',
    'Announcement has been deleted successfully',
    'Deletes an announcement and its category links. Returns no content.',
    'Announcement',
  )
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param() params: AnnouncementPathParamDto): Promise<void> {
    return this.announcementService.remove(params.id);
  }
}
