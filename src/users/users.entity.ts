import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn, Relation } from 'typeorm';
import { Task } from '../tasks/tasks.entity';

export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true })
  phoneNumber: string;

  @Column()
  password: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
  role: UserRole;

  @OneToMany(() => Task, (task) => task.user)
  tasks: Relation<Task>[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
