import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { MarkerColor } from '../post/marker-color.enum';
import { Post } from '../post/post.entity';

@Entity()
// 사용자마다 이메일이 달라야 하므로.
@Unique(['email'])
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  loginType: 'email' | 'kakao' | 'apple';

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  nickname?: string;

  @Column({ nullable: true })
  imageUri?: string;

  @Column({ nullable: true })
  kakaoImageUri?: string;

  @Column({ nullable: true, default: '' })
  [MarkerColor.RED]: string;

  @Column({ nullable: true, default: '' })
  [MarkerColor.BLUE]: string;

  @Column({ nullable: true, default: '' })
  [MarkerColor.GREEN]: string;

  @Column({ nullable: true, default: '' })
  [MarkerColor.PURPLE]: string;

  @Column({ nullable: true, default: '' })
  [MarkerColor.YELLOW]: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;

  @Column({ nullable: true })
  hashedRefreshToken?: string;
  // eager 옵션은 관계되어 있는 데이터를 함께 가져올 수 있음.
  @OneToMany(() => Post, (post) => post.user, { eager: false })
  post: Post[];
}
