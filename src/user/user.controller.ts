import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from "@nestjs/swagger";
import { UserService } from "./user.service";
import { FileUploadDto, UserDto } from "./dto/user.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('users')
export class UserController {
    constructor(private userService: UserService) { }

    @Get()
    getAllUsers() {
        return this.userService.getAllUsers()
    }

    @Get('pagination-search')
    searchUserByPage(
        @Query('pageIndex', ParseIntPipe) pageIndex: number,
        @Query('pageSize', ParseIntPipe) pageSize: number,
        @Query('keyword') keyword: string,
    ) {
        return this.userService.searchUserByPage(pageIndex, pageSize, keyword)
    }

    @Get(':id')
    getUserById(@Param('id', ParseIntPipe) userId: number) {
        return this.userService.getUserById(userId)
    }

    @Post()
    createUser(@Body() createUserDto: UserDto) {
        return this.userService.createUser(createUserDto)
    }

    @Delete()
    deleteUserById(@Query('id', ParseIntPipe) userId: number) {
        return this.userService.deleteUser(userId)
    }

    @Put(':id')
    putUserById(@Param('id', ParseIntPipe) userId: number, @Body() updateUserDto: UserDto) {
        return this.userService.putUserById(userId, updateUserDto)
    }

    @Get('search/:userName')
    searchUser(@Param('userName') userName: string) {
        return this.userService.searchUser(userName)
    }

    @Post('upload/:id')
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        description: 'List of cats',
        type: FileUploadDto
    })
    @UseInterceptors(
        FileInterceptor('file', {
            storage: diskStorage({
                destination: `${process.cwd()}/public/img`,
                filename: (req, file, cb) => {
                    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
                    const ext = file.originalname.split('.').pop()
                    cb(null, file.filename + '-' + uniqueSuffix + '.' + ext)
                }
            })
        })
    )
    async uploadImage(@UploadedFile() file, @Param('id', ParseIntPipe) userId: number): Promise<any> {
        return await this.userService.createImage(file, userId)
    }
}