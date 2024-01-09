import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from "@nestjs/swagger";
import { RoomService } from "./room.service";
import { RoomDto } from "./dto/room.dto";
import { FileUploadDto } from "src/location/dto/location.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";

@ApiTags('Room')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('room')
export class RoomController {
    constructor(private roomService: RoomService) { }

    @Get()
    getRooms(): Promise<RoomDto[]> {
        return this.roomService.getAllRooms()
    }

    @Get('pagination')
    getPagination(
        @Query('limit', ParseIntPipe) limit: number,
        @Query('page', ParseIntPipe) page: number,
        @Query('search') search: string,
    ) {
        return this.roomService.getPaginationSearch(limit, page, search)
    }

    @Get('location')
    getRoomsByLocation(@Query('id', ParseIntPipe) id: number) {
        return this.roomService.getRoomsByLocation(id)
    }

    @Get(':id')
    getRoomById(@Param('id', ParseIntPipe) id: number) {
        return this.roomService.getRoomById(id)
    }

    @Post('')
    postRoom(@Body() room: RoomDto) {
        delete room?.id
        return this.roomService.postRoom(room)
    }

    @Put(':id')
    putRoom(@Body() room: RoomDto, @Param('id', ParseIntPipe) id: number) {
        delete room?.id
        return this.roomService.updateRoom(id, room)
    }

    @Delete(':id')
    deleteRoom(@Param('id', ParseIntPipe) id: number) {
        return this.roomService.deleteRoom(id)
    }

    @Post('upload/:id')
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        description: 'upload image',
        type: FileUploadDto
    })
    @UseInterceptors(
        FileInterceptor('image', {
            storage: diskStorage({
                destination: `${process.cwd()}/public/img`,
                filename: (req, file, cb) => {
                    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
                    const ext = file.originalname.split('.').pop()
                    cb(null, file.fieldname + '-' + uniqueSuffix + '.' + ext)
                }
            })
        })
    )
    async uploadImage(@UploadedFile() file, @Param('id', ParseIntPipe) roomId: number): Promise<any> {
        return await this.roomService.createImage(file, roomId)
    }
}