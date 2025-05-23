import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Like, Repository, UpdateResult } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { Post } from './entities/post.entity';
import { FilterPostDto } from './dto/filter-post.dto';
import { title } from 'process';
import { UpdatePostDto } from './dto/update-post.dto';
import { BadRequestException } from '@nestjs/common';
@Injectable()
export class PostService {
    constructor (
        @InjectRepository(User) private userRepository:Repository<User>,
        @InjectRepository(Post) private postRepository:Repository<Post>
        ){}
    async create(userId:number, createPostDto:CreatePostDto):Promise<Post | null>{
        const user = await this.userRepository.findOneBy({id:userId});
        if (!user){
             throw new HttpException('User not found', HttpStatus.NOT_FOUND);

        }
        try {
            const res = await this.postRepository.save({
                ...createPostDto,user
            })

            return await this.postRepository.findOneBy({id: res.id});
        } catch (error) {
            console.error(error);
                throw new HttpException('Cant create Post',HttpStatus.BAD_REQUEST);
        }
    }
    async findAll(query: FilterPostDto): Promise<any> {
        const items_per_page = Number(query.items_per_page) || 10;
        const page = Number(query.page) || 1;
        const search = query.search || '';
    
        const category = Number(query.category) || null;
        const skip = (page - 1) * items_per_page;
    
        const whereCondition: any[] = [
            {
                title: Like('%' + search + '%'),
            },
            {
                description: Like('%' + search + '%'),
            },
        ];
    
        if (category !== null) {
            whereCondition.forEach(condition => {
                condition.category = { id: category };
            });
        }
    
        const [res, total] = await this.postRepository.findAndCount({
            where: whereCondition,
            order: { created_at: 'DESC' },
            take: items_per_page,
            skip: skip,
            relations: {
                user: true,
                category: true
            },
            select: {
                category: {
                    id: true,
                    name: true
                },
                user: {
                    id: true,
                    first_name: true,
                    last_name: true,
                    email: true,
                    avatar: true
                }
            }
        });
    
        const lastPage = Math.ceil(total / items_per_page);
        const nextPage = page + 1 > lastPage ? null : page + 1;
        const prevPage = page - 1 < 1 ? null : page - 1;
    
        return {
            data: res,
            total,
            currentPage: page,
            nextPage,
            prevPage,
            lastPage
        };
    }

    async findDetail(id:number):Promise<Post | null>{
        return await this.postRepository.findOne({
            where:{id},
            relations:['user','category'],
            select:{
                category:{
                    id:true,
                    name:true
                },
                user:{
                    id:true,
                    first_name:true,
                    last_name:true,
                    email:true,
                    avatar:true
                }
            }
        })
    }

    async update(id: number, updatePostDto: UpdatePostDto): Promise<UpdateResult> {
        if (!updatePostDto || Object.keys(updatePostDto).length === 0) {
            throw new BadRequestException('No update data provided.');
        }
    
        return await this.postRepository.update(id, updatePostDto);
    }

    async delete(id:number):Promise<DeleteResult>{
        return await this.postRepository.delete(id);
    }
}
