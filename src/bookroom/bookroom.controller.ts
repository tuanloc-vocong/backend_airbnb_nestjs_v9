import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { BookroomService } from "./bookroom.service";
import { Booking } from "./dto/bookroom.dto";

@ApiTags('Bookroom')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('bookroom')
export class BookroomController {
    constructor(private bookroomService: BookroomService) { }
    @Get('')
    getBookrooms(): Promise<Booking[]> {
        return this.bookroomService.getAllBookroom();
    }

    @Post('')
    postBookrooms(@Body() bookroomDto: Booking): Promise<Booking> {
        return this.bookroomService.postBookroom(bookroomDto);
    }

    @Get(':id')
    getBookroomById(@Param('id', ParseIntPipe) id: number): Promise<Booking> {
        return this.bookroomService.getBookroomById(id);
    }

    @Put(':id')
    updateBookroom(@Body() bookroomDto: Booking, @Param('id', ParseIntPipe) id: number): Promise<Booking> {
        return this.bookroomService.updateBookroomById(bookroomDto, id);
    }

    @Delete(':id')
    deleteBookroom(@Param('id', ParseIntPipe) id: number): Promise<Booking> {
        return this.bookroomService.deleteBookroom(id);
    }

    @Get('user/:id')
    getBookroomByUserId(@Param('id', ParseIntPipe) id: number): Promise<Booking[]> {
        return this.bookroomService.getBookroomByUserId(id);
    }
}