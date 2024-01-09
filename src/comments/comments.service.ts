import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CommentDto } from "./dto/comment.dto";

@Injectable()
export class CommentService {
    constructor(private prismaService: PrismaService) { }

    async getAllComment(): Promise<CommentDto[]> {
        try {
            const getAllComment = await this.prismaService.comment.findMany();
            return getAllComment;
        } catch (error) {
            throw new BadRequestException()
        }
    }

    async postComment(commentDto: CommentDto): Promise<CommentDto> {
        try {
            const createComment = await this.prismaService.comment.create({
                data: {
                    user_id: commentDto?.user_id,
                    room_id: commentDto.room_id,
                    date_comment: new Date(),
                    content: commentDto.content,
                    rate: commentDto.rate
                }
            })
            return createComment;
        } catch (error) {
            const { code } = error
            if (code === 'P2003') {
                throw new NotFoundException('Not Found ' + error.meta.field_name)
            }
            throw new BadRequestException()
        }
    }

    async updateCommentByUser(commentDto: CommentDto, id: number): Promise<any> {
        try {
            const updateComment = await this.prismaService.update({
                where: {
                    id: id
                },
                data: {
                    date_moment: commentDto.date_comment,
                    content: commentDto.content,
                    rate: commentDto.rate
                }
            })
            return { message: 'Update comment success', updateComment }
        } catch (error) {
            const { code } = error
            if (code === 'P2003') {
                throw new NotFoundException('Not Found ' + error.meta.field_name)
            }
            throw new BadRequestException()
        }
    }

    async deleteComment(id: number): Promise<CommentDto> {
        try {
            const deleteComment = await this.prismaService.comment.delete({
                where: {
                    id: id
                }
            })
            return deleteComment
        } catch (error) {
            const { code } = error;
            if (code === 'P2025') {
                throw new NotFoundException(error.meta.cause)
            }
            throw new BadRequestException()
        }
    }

    async getCommentsByRoomId(roomId: number): Promise<CommentDto[]> {
        try {
            const getCommentsByRoom = await this.prismaService.comment.findMany({
                where: {
                    room_id: roomId
                }
            })
            return getCommentsByRoom
        } catch (error) {
            throw new BadRequestException()
        }
    }
}