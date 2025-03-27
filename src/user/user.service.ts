import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { DeleteResult, Like, Repository, UpdateResult } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/update-user.dto';
import { filterUserDto } from './dto/filter-user.dto';
@Injectable()
export class UserService {
    constructor(@InjectRepository(User) private userRespository:Repository<User>){}
    async findAll(query:filterUserDto):Promise<any>{
        const items_per_page = Number(query.items_per_page) || 10;
        const page = Number(query.page) || 1;
        const skip = (page - 1)*items_per_page;
        const keyword = query.search || '';
        const[res,total] =  await this.userRespository.findAndCount({
            where:[
              {first_name:Like('%' + keyword + '%')},
              {last_name: Like('%' + keyword + '%')},
              {email: Like('%' + keyword + '%')},
            ],
            order:{created_at: "DESC"},
            take: items_per_page,
            skip: skip,
            select:['id','first_name','last_name','email','status','created_at','updated_at']
        })
        const lastPage = Math.ceil(total/items_per_page);
        const nextPage = page + 1 > lastPage ? null : page + 1;
        const prevPage = page - 1 < 1 ? null : page - 1;

        return {
            data: res,
            total,
            currentPage: page,
            nextPage,
            prevPage,
            lastPage
        }
    }

    async findOne(id:number): Promise<User | null>{
        return await this.userRespository.findOneBy({id});
    }

    async create(createUserDto:CreateUserDto):Promise<User>{
        const hashPassword = await bcrypt.hash(createUserDto.password,10);
        return await this.userRespository.save(createUserDto);
    }

    async update(id:number , UpdateUserDto:UpdateUserDto): Promise<UpdateResult>{
        return await this.userRespository.update(id,UpdateUserDto);
    }
    async delete(id:number):Promise<DeleteResult>{
        return await this.userRespository.delete(id);
    }

    async updateAvatar(id:number , avatar:string):Promise<UpdateResult>{
        return await this.userRespository.update(id,{avatar});
    }
}
