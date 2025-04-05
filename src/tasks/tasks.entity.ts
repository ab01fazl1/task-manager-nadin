import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, JoinColumn, Relation } from 'typeorm';
import { User } from '../users/users.entity';

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ nullable: true })
  attachment: string;

  @ManyToOne(() => User, (user) => user.tasks, { onDelete: 'CASCADE' }) 
  @JoinColumn({ name: 'userId' })
  user: Relation<User>;

  @Column({ name: 'userId' })
  userId: number; // Foreign key column
  
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
  