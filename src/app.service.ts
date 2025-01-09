import { Injectable } from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {TaskEntity} from "./entities/task.entity";
import {Repository} from "typeorm";

@Injectable()
export class AppService {
  constructor(@InjectRepository(TaskEntity) private readonly taskRepository: Repository<TaskEntity>) {
  }
  async getAll() {
    return this.taskRepository.find();
  }
  async getById(id: number) {
    return this.taskRepository.findOneBy({id});
  }
  async create(name: string) {
    const todo = this.taskRepository.create({name});
    await this.taskRepository.save(todo);
    return this.getAll();
  }
  async update(id: number, type: string, name: string) {
    if (type === 'complete') {
      const task = await this.getById(id);
      if (!task) return null;

      task.isCompleted = true;
      await this.taskRepository.save(task);
      return this.getAll();
    }
    if (type === 'edit') {
      const task = await this.getById(id);
      if (!task) return null;

      task.name = name;
      await this.taskRepository.save(task);
      return this.getAll();
    }
  }
  async delete(id: number) {
    const task = await this.getById(id);
    if (!task) return null;
    await this.taskRepository.delete({ id });
    return this.getAll();
  }
}
