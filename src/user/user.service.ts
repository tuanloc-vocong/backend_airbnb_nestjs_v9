import { BadRequestException, ForbiddenException, Injectable, InternalServerErrorException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { UserDto } from "./dto/user.dto";
import * as bcrypt from 'bcrypt'
import * as fs from 'fs/promises'
import * as path from 'path'

@Injectable()
export class UserService {
    constructor(private prismaService: PrismaService) { }

    async getAllUsers() {
        return await this.prismaService.user.findMany({})
    }

    async createUser(createUserDto: UserDto) {
        try {
            const hashedPassword = await bcrypt.hash(createUserDto.password, 10)
            const dataImport = await this.prismaService.user.create({
                data: {
                    name: createUserDto.name,
                    email: createUserDto.email,
                    password: hashedPassword,
                    gender: createUserDto.gender,
                    phone: createUserDto.phone,
                    birthday: new Date(createUserDto.birthday),
                    role: createUserDto.role
                },
                select: {
                    id: true,
                    email: true,
                    password: true,
                    gender: true
                }
            })
            return dataImport
        } catch (error) {
            if (error.code === 'P2002') {
                throw new ForbiddenException('Email is already registered')
            }
        }
    }

    async deleteUser(userId: number) {
        const user = await this.prismaService.user.findUnique({
            where: {
                id: userId
            }
        })

        if (!user) {
            throw new ForbiddenException('User does not exist')
        }

        const rowsDeleted = await this.prismaService.user.delete({
            where: {
                id: userId
            }
        })

        return { message: 'User deleted successfully', rowsDeleted }
    }

    async searchUserByPage(pageIndex: number, pageSize: number, keyword: string): Promise<any> {
        const skip = (pageIndex - 1) * pageSize
        const users = await this.prismaService.user.findMany({
            where: {
                name: {
                    contains: keyword
                }
            },
            take: pageSize,
            skip: skip
        })

        const total = await this.prismaService.user.count({
            where: {
                name: {
                    contains: keyword
                }
            }
        })

        const meta = {
            pageIndex,
            pageSize,
            total,
            totalPages: Math.ceil(total / pageSize)
        }

        return { users, meta }
    }

    async getUserById(userId: number) {
        const user = await this.prismaService.user.findUnique({
            where: {
                id: userId
            }
        })

        if (!user) {
            throw new ForbiddenException('User not found')
        }
        return user
    }

    async putUserById(userId: number, { email, name, phone, gender, role, birthday, password }: UserDto) {
        const hashedPassword = await bcrypt.hash(password, 10)
        try {
            const updatedUser = await this.prismaService.user.update({
                where: {
                    id: userId
                },
                data: {
                    email,
                    name,
                    phone,
                    gender,
                    role,
                    birthday: new Date(birthday),
                    password: hashedPassword
                }
            })

            if (!updatedUser) {
                throw new ForbiddenException('User not found')
            }

            return updatedUser
        } catch (error) {
            if (error.code === 'P2002') {
                throw new BadRequestException('Email is already in use')
            } else {
                throw new InternalServerErrorException('Failed to update user')
            }
        }
    }

    async searchUser(name: string) {
        return await this.prismaService.user.findMany({
            where: {
                name: {
                    contains: name
                }
            }
        })
    }

    async createImage(file: any, userId: number): Promise<any> {
        try {
            const { filename, mimetype } = file
            const filePath = path.join(process.cwd(), 'public', 'img', filename)
            const data = await fs.readFile(filePath)
            const base64 = `data:${mimetype};base64,${data.toString('base64')}`
            await fs.unlink(filePath)

            return await this.prismaService.user.update({
                where: {
                    id: userId
                },
                data: {
                    avatar: base64
                }
            })
        } catch (error) {
            if (error.code === 'P2025') {
                throw new ForbiddenException('User not found')
            }
            throw error
        }
    }
}