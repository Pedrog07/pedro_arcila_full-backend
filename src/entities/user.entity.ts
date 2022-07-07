import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  BeforeInsert,
  BeforeUpdate,
  OneToMany,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import File from './file.entity';
import PasswordResetRequest from './password-reset-request.entity';
import { generateUniqueKey } from 'utils';

@Entity({ name: 'users' })
export default class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', name: 'first_name', length: 255 })
  firstName: string;

  @Column({ type: 'varchar', name: 'last_name', length: 255 })
  lastName: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  password: string;

  @Column({ type: 'boolean', name: 'verified_email', default: false })
  verifiedEmail: boolean;

  @Column({ type: 'varchar', name: 'verification_code', length: 255 })
  verificationCode: string;

  @OneToMany(() => File, (file) => file.user)
  file: File;

  @OneToMany(
    () => PasswordResetRequest,
    (passwordResetRequest) => passwordResetRequest.user,
  )
  passwordResetRequest: PasswordResetRequest;

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

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
  }

  @BeforeInsert()
  async generateVerificationCode() {
    this.verificationCode = generateUniqueKey();
  }
}
