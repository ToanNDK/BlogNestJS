import { User } from "src/user/entities/user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";



@Entity()
export class Post{
    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    title:string;

    
    @Column()
    description:string;

    
    @Column()
    thumbnail:string;

    
    @Column({type:"int", default:1})
    status:number;

    
    @CreateDateColumn({ type: 'timestamp' })
    created_at:Date;

    
    @CreateDateColumn({ type: 'timestamp' })
    updated_at:Date

    @ManyToOne(()=>User,(user)=>user.posts)
    user:User
}