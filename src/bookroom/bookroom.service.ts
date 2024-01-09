import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { Booking } from "./dto/bookroom.dto";

@Injectable()
export class BookroomService {
    constructor(private prismaService: PrismaService) { }

    async getAllBookroom(): Promise<Booking[]> {
        try {
            const getAllComment = await this.prismaService.booking.findMany();
            return getAllComment;
        } catch (error) {
            throw new BadRequestException();
        }
    }

    async postBookroom(bookroomDto: Booking): Promise<Booking> {
        try {
            const createBookroom = await this.prismaService.booking.create({
                data: {
                    room_id: bookroomDto.room_id,
                    depart_date: new Date(bookroomDto.depart_date),
                    arrival_date: new Date(bookroomDto.arrival_date),
                    customer_quantity: bookroomDto.customer_quantity,
                    user_id: bookroomDto.user_id,
                },
            });
            return createBookroom;
        } catch (error) {
            const { code } = error;
            if (code == 'P2003') {
                throw new NotFoundException('Not Found ' + error.meta.field_name);
            }
            throw new BadRequestException();
        }
    }

    async getBookroomById(id: number): Promise<Booking> {
        try {
            const bookroom = await this.prismaService.booking.findUnique({
                where: {
                    id: id,
                },
            });
            return bookroom;
        } catch (error) {
            const { code } = error;
            if (code == 'P2003') {
                throw new NotFoundException('Not Found ' + error.meta.field_name);
            }
            throw new BadRequestException();
        }
    }

    async updateBookroomById(bookroomDto: Booking, id: number): Promise<Booking> {
        try {
            const updateBookroom = await this.prismaService.booking.update({
                where: {
                    id: id,
                },
                data: {
                    room_id: bookroomDto.room_id,
                    depart_date: new Date(bookroomDto.depart_date),
                    arrival_date: new Date(bookroomDto.arrival_date),
                    customer_quantity: bookroomDto.customer_quantity,
                    user_id: bookroomDto.user_id,
                },
            });
            return updateBookroom;
        } catch (error) {
            const { code } = error;
            if (code == 'P2003') {
                throw new NotFoundException('Not Found ' + error.meta.field_name);
            }
            throw new BadRequestException();
        }
    }

    async deleteBookroom(id: number): Promise<Booking> {
        try {
            const deleteBookroom = await this.prismaService.booking.delete({
                where: {
                    id: id,
                },
            });
            return deleteBookroom;
        } catch (error) {
            const { code } = error;
            if (code === 'P2025') {
                throw new NotFoundException(error.meta.cause);
            }
            throw new BadRequestException();
        }
    }

    async getBookroomByUserId(id: number): Promise<Booking[]> {
        try {
            const getBookroomByUserId = await this.prismaService.booking.findMany({
                where: {
                    user_id: id,
                },
            });
            return getBookroomByUserId;
        } catch (error) {
            throw new BadRequestException();
        }
    }
}