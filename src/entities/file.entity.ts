import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
} from 'typeorm';
import User from './user.entity';

@Entity({ name: 'files' })
export default class File {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', name: 'file_name', length: 255, default: null })
  fileName: string;

  @Column({ type: 'varchar', name: 'file_type', length: 255, default: null })
  fileType: string;

  @Column({ type: 'varchar', name: 'file_url', length: 255, default: null })
  fileUrl: string;

  @ManyToOne(() => User, (user) => user.file)
  user: User;

  @Column({
    type: 'timestamp',
    name: 'created_at',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @DeleteDateColumn({
    name: 'deleted_at',
    type: 'timestamp',
    default: null,
    nullable: true,
  })
  deletedAt: Date;
}
