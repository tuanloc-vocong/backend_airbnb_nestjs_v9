import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { CommentService } from "./comments.service";
import { CommentDto } from "./dto/comment.dto";

@ApiTags('Comment')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('comment')
export class CommentController {
    constructor(private commentService: CommentService) { }

    @Get('')
    getComments(): Promise<CommentDto[]> {
        return this.commentService.getAllComment();
    }

    @Post('')
    postComment(@Body() commentDto: CommentDto): Promise<CommentDto> {
        return this.commentService.postComment(commentDto)
    }

    @Put(':id')
    updateComment(@Body() commentDto: CommentDto, @Param('id', ParseIntPipe) id: number): Promise<CommentDto> {
        return this.commentService.updateCommentByUser(commentDto, id)
    }

    @Delete(':id')
    deleteComment(@Param('id', ParseIntPipe) id: number): Promise<CommentDto> {
        return this.commentService.deleteComment(id)
    }

    @Get(':roomId')
    getCommentByRoom(@Param('roomId', ParseIntPipe) roomId: number): Promise<CommentDto[]> {
        return this.commentService.getCommentsByRoomId(roomId)
    }
}