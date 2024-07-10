import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { MarkerColor } from './marker-color.enum';
import { ColumnNumericTransformer } from '../@common/transformers/numeric.transformer';
import { User } from '../auth/user.entity';
import { Image } from '../image/image.entity';
import { Favorite } from '../favorite/favorite.entity';

@Entity()
export class Post extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  // 소수점이어도 문제 없게 transformer 설정.
  @Column({ type: 'decimal', transformer: new ColumnNumericTransformer() })
  latitude: number;

  @Column({ type: 'decimal', transformer: new ColumnNumericTransformer() })
  longitude: number;

  @Column()
  color: MarkerColor;

  @Column()
  address: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column({
    type: 'timestamp with time zone',
    default: () => 'CURRENT_TIMESTAMP',
  })
  date: Date;

  @Column()
  score: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;

  // 반대로 여러개의 포스트가 한명의 유저에게 귀속되있음.
  @ManyToOne(() => User, (user) => user.post, { eager: false })
  user: User;

  @OneToMany(() => Image, (image) => image.post)
  images: Image[];

  @OneToMany(() => Favorite, (favorite) => favorite.post)
  favorites: Favorite[];
}
