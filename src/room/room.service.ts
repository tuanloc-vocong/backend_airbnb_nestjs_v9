import * as path from 'path'
import * as fs from 'fs/promises'
import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { RoomDto } from './dto/room.dto'

@Injectable()
export class RoomService {
    constructor(private prismaService: PrismaService) { }

    async getAllRooms(): Promise<RoomDto[]> {
        try {
            const getAllRoom = this.prismaService.room.findMany()
            return getAllRoom
        } catch (error) {
            throw new BadRequestException()
        }
    }

    async getRoomsByLocation(id: number): Promise<RoomDto[]> {
        try {
            const getAllRoomByLocation = this.prismaService.room.findMany({
                where: {
                    location_id: id
                }
            })
            return getAllRoomByLocation
        } catch (error) {
            throw new BadRequestException()
        }
    }

    async postRoom(roomDto: RoomDto): Promise<RoomDto> {
        try {
            const postRoom = await this.prismaService.room.create({
                data: roomDto
            })
            return postRoom
        } catch (error) {
            throw new BadRequestException()
        }
    }

    async updateRoom(id: number, roomDto: RoomDto): Promise<RoomDto> {
        try {
            const updateRoom = await this.prismaService.room.update({
                where: {
                    id: id
                },
                data: roomDto
            })
            return updateRoom
        } catch (error) {
            const { code } = error
            if (code === 'P2025') {
                throw new NotFoundException('Not Found Room ' + id)
            }
            throw new BadRequestException()
        }
    }

    async getPaginationSearch(limit: number, page: number, search: string): Promise<{ data: RoomDto[]; meta: object }> {
        const take = limit || 10
        const skip = (page - 1) * take || 0
        const searchs = search || ''

        try {
            const [data, total] = await Promise.all([
                this.prismaService.room.findMany({
                    where: {
                        room_name: {
                            contains: searchs
                        }
                    },
                    skip: skip,
                    take: take,
                    orderBy: {
                        room_name: 'asc'
                    }
                }),
                this.prismaService.room.count({
                    where: {
                        room_name: {
                            contains: searchs
                        }
                    }
                })
            ])

            const meta = { page, limit, total, totalPages: Math.ceil(total / limit) }
            return { data, meta }
        } catch (error) {
            throw new BadRequestException()
        }
    }

    async getRoomById(id: number): Promise<any> {
        try {
            const roomById = await this.prismaService.room.findUnique({
                where: {
                    id: id
                }
            })

            if (!roomById) {
                throw new NotFoundException()
            }

            return roomById
        } catch (error) {
            throw new BadRequestException()
        }
    }

    async deleteRoom(id: number): Promise<RoomDto> {
        try {
            const deleteRoom = await this.prismaService.room.delete({
                where: {
                    id: id
                }
            })
            return deleteRoom
        } catch (error) {
            const { code } = error
            if (code === 'P2025') {
                throw new NotFoundException('Not Found Room ' + id)
            }
            throw new BadRequestException()
        }
    }

    async createImage(file: any, roomId: number): Promise<any> {
        try {
            const { filename, minetype } = file
            const filePath = path.join(process.cwd(), 'public', 'img', filename)
            const data = await fs.readFile(filePath)

            const base64 = `data:${minetype};base64,${data.toString('base64')}`
            await fs.unlink(filePath)

            return await this.prismaService.room.update({
                where: {
                    id: roomId
                },
                data: {
                    image: base64
                }
            })
        } catch (error) {
            if (error.code === 'P2025') {
                throw new ForbiddenException('Room not found')
            }
            throw error
        }
    }
}