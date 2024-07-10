import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Post } from '../post/post.entity';
import { User } from '../auth/user.entity';

@Entity()
export class Favorite extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  // 즐겨찾기한, 포스트 아이디와, 즐겨찾기를 누른 유저의 아이디를 기록
  @Column()
  postId: number;

  @Column()
  userId: number;

  // 유저와 포스트와 둘다 관계
  // 게시글이 사라지면, 즐겨찾기 데이터도 사라지게 CASCADE 속성 ON
  @ManyToOne(() => Post, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'postId' })
  post: Post;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;
}
