import { Repository } from 'typeorm';
import { Task } from './tasks.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TaskRepository extends Repository<Task> {}
