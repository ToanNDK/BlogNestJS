import { BadRequestException, Body, Controller, Delete, Get, Param, Post, Put, Query, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { AuthGuard } from 'src/auth/auth.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { filterUserDto } from './dto/filter-user.dto';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { storageConfig } from 'helpers/config';
import { extname } from 'path';

@ApiBearerAuth()
@ApiTags('Users')
@Controller('users')
export class UserController {
    constructor(private userService:UserService){}

    @UseGuards(AuthGuard)
    @ApiQuery({name:'page'})
    @ApiQuery({name:'items_per_page'})
    @ApiQuery({name:'search'})
    @Get()
    findAll(@Query() query:filterUserDto):Promise<User[]>{
        console.log(query);
        return this.userService.findAll(query); 
    }

    @UseGuards(AuthGuard)
    @Get(':id')
    findOne(@Param('id') id: string): Promise<User | null>{
        return this.userService.findOne(Number(id));
    }

    @UseGuards(AuthGuard)
    @Post()
    create(@Body() createUserDto:CreateUserDto):Promise<User>{
        return this.userService.create(createUserDto);
    }

    @UseGuards(AuthGuard)
    @Put(':id')
    update(@Param('id') id:string, @Body() UpdateUserDto:UpdateUserDto ){
        return this.userService.update(Number(id) , UpdateUserDto);
    }
    
    @UseGuards(AuthGuard)
    @Delete(':id')
    delete(@Param("id") id:string){
        return this.userService.delete(Number(id));
    }

    @Post('upload-avatar')
    @UseGuards(AuthGuard)
    @UseInterceptors(FileInterceptor('avatar', {
        storage:storageConfig('avatar'),
        fileFilter:(req,file,cb) =>{
            const ext = extname(file.originalname);
            const allowedExtArr = ['.jpg','.png','.jpeg'];
            if(!allowedExtArr.includes(ext)){
                req.fileValidationError = `Wrong extension type. Accepted file ext are: ${allowedExtArr.toString()}`
                cb(null,false);
            }else{
                const fileSize = parseInt(req.headers['content-length']);
                if (fileSize > 1024 * 1024 * 5){
                    req.fileValidationError = 'File over size. File size must be less than 5MB';
                    cb(null,false);
                }else{
                    cb(null,true);
                }
            }
        }
    }))
    uploadAvatar(@Req() req:any, @UploadedFile() file:Express.Multer.File){
        console.log("upload avatar");
        console.log('user data', req.user_data);
        console.log(file);

        if(req.fileValidationError){
            throw new BadRequestException(req.fileValidationError);
        }
        if(!file){
            throw new BadRequestException('File is required')
        }
        this.userService.updateAvatar(req.user_data.id,file.destination + '/' + file.filename);
    }
}

