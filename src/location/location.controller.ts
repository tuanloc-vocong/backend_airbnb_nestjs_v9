import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from "@nestjs/swagger";
import { LocationService } from "./location.service";
import { FileUploadDto, UpdateLocationDto } from "./dto/location.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";

@ApiTags('Location')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('location')
export class LocationController {
    constructor(private locationService: LocationService) { }

    @Get()
    getLocation() {
        return this.locationService.getLocation()
    }

    @Post()
    createLocation(@Body() updateLocationDto: UpdateLocationDto) {
        return this.locationService.createLocation(updateLocationDto)
    }

    @Get('paginationSearch')
    searchLocationByPage(
        @Query('pageIndex', ParseIntPipe) pageIndex: number,
        @Query('pageSize', ParseIntPipe) pageSize: number,
        @Query('keyword') keyword: string,
    ) {
        return this.locationService.searchUserByPage(pageIndex, pageSize, keyword)
    }

    @Get(':id')
    getLocationById(@Param('id', ParseIntPipe) id: number) {
        return this.locationService.getLocationById(id)
    }

    @Put(':id')
    putLocationById(@Param('id', ParseIntPipe) id: number, @Body() updateLocationDto: UpdateLocationDto) {
        return this.locationService.putLocationById(id, updateLocationDto)
    }

    @Delete(':id')
    deleteLocationById(@Param('id', ParseIntPipe) id: number) {
        return this.locationService.deleteLocationById(id)
    }

    @Post('upload/:id')
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        description: 'List of cats',
        type: FileUploadDto
    })
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
            destination: `${process.cwd()}/public/img`,
            filename: (req, file, cb) => {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
                const ext = file.originalname.split('.').pop()
                cb(null, file.fieldname + '-' + uniqueSuffix + '.' + ext)
            }
        })
    }))
    async uploadImage(@UploadedFile() file, @Param('id', ParseIntPipe) userId: number): Promise<any> {
        return await this.locationService.createImage(file, userId)
    }
}