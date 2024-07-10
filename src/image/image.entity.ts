import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Post } from '../post/post.entity';

@Entity()
export class Image {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  uri: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;

  // 하나의 포스트가 여러개의 이미지를 갖음.
  @ManyToOne(() => Post, (post) => post.images, {
    // 만약 게시글이 지워진다면, 이미지도 지워지게 설정.
    onDelete: 'CASCADE',
  })
  post: Post;
}
