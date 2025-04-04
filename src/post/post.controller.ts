import { Body, Post, Controller, Req, UseInterceptors, UploadedFile, UseGuards, BadRequestException, Query, Get, Param, Put, Delete, UsePipes, ValidationPipe } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { extname } from 'path';
import { storageConfig } from 'helpers/config';
import { AuthGuard } from 'src/auth/auth.guard';
import { Public } from 'src/auth/decorator/public.decorator';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { FilterPostDto } from './dto/filter-post.dto';
import { Post as PostEntity } from './entities/post.entity';

@Controller('posts')
export class PostController {
    constructor(private postService: PostService) {}

    @UseGuards(AuthGuard)
    @UsePipes(ValidationPipe)
    @Post()
    @UseInterceptors(FileInterceptor('thumbnail', {
        storage: storageConfig('post'),
        fileFilter: (req, file, cb) => {
            const ext = extname(file.originalname);
            const allowedExtArr = ['.jpg', '.png', '.jpeg'];
            if (!allowedExtArr.includes(ext)) {
                req.fileValidationError = `Wrong extension type. Accepted file ext are: ${allowedExtArr.toString()}`;
                cb(null, false);
            } else if (file.size > 1024 * 1024 * 5) { // Fix kiểm tra dung lượng file
                req.fileValidationError = 'File over size. File size must be less than 5MB';
                cb(null, false);
            } else {
                cb(null, true);
            }
        }
    }))
    create(@Req() req: any, @Body() createPostDto: CreatePostDto, @UploadedFile() file?: Express.Multer.File) {
        console.log(req['user_data']);
        console.log(createPostDto);
        console.log(file);

        if (req.fileValidationError) {
            throw new BadRequestException(req.fileValidationError);
        }

        if (!file) {
            throw new BadRequestException('File is required');
        }

        return this.postService.create(req['user_data'].id, {
            ...createPostDto,
            thumbnail: file.destination + '/' + file.filename
        });
    }

    @Public() 
    @Get()
    findAll(@Query() query: FilterPostDto): Promise<any> {
        return this.postService.findAll(query);
    }

    @Public()
    @UseGuards(AuthGuard)
    @Get(':id')
    findDetail(@Param('id') id: string): Promise<PostEntity | null> {
        return this.postService.findDetail(Number(id));
    }

    @UseGuards(AuthGuard)
@Put(':id')
@UseInterceptors(FileInterceptor('thumbnail', {
    storage: storageConfig('post'),
    fileFilter: (req, file, cb) => {
        const ext = extname(file.originalname);
        const allowedExtArr = ['.jpg', '.png', '.jpeg'];
        if (!allowedExtArr.includes(ext)) {
            req.fileValidationError = `Wrong extension type. Accepted file ext are: ${allowedExtArr.toString()}`;
            cb(null, false);
        } else if (file.size > 1024 * 1024 * 5) {
            req.fileValidationError = 'File over size. File size must be less than 5MB';
            cb(null, false);
        } else {
            cb(null, true);
        }
    }
}))
update(
    @Param('id') id: string,
    @Req() req: any,
    @Body() updatePostDto: UpdatePostDto,
    @UploadedFile() file?: Express.Multer.File
) {
    if (req.fileValidationError) {
        throw new BadRequestException(req.fileValidationError);
    }

    // Nếu có file mới, cập nhật thumbnail
    if (file) {
        updatePostDto.thumbnail = file.destination + '/' + file.filename;
    }

    // Debug log để kiểm tra dữ liệu thực sự gửi xuống
    console.log('UpdatePostDto:', updatePostDto);

    return this.postService.update(Number(id), updatePostDto);
}

    @UseGuards(AuthGuard)
    @Delete(':id')
    delete(@Param('id') id: string) {
        return this.postService.delete(Number(id));
    }


   
    @Post('cke-upload')
    @UseInterceptors(FileInterceptor('upload', {
        storage: storageConfig('ckeditor'),
        fileFilter: (req, file, cb) => {
            const ext = extname(file.originalname);
            const allowedExtArr = ['.jpg', '.png', '.jpeg'];
            if (!allowedExtArr.includes(ext)) {
                req.fileValidationError = `Wrong extension type. Accepted file ext are: ${allowedExtArr.toString()}`;
                cb(null, false);
            } else if (file.size > 1024 * 1024 * 5) { // Fix kiểm tra dung lượng file
                req.fileValidationError = 'File over size. File size must be less than 5MB';
                cb(null, false);
            } else {
                cb(null, true);
            }
        }
    }))
    ckeUpload(@Body() data:any, @UploadedFile() file?: Express.Multer.File) {
        console.log("data=>",data);
        console.log(file);

        return {
            'url' : `uploads/ckeditor/${file?.filename}`
        }

       
    }
}
