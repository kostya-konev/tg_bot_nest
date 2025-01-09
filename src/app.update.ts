import { AppService } from './app.service';
import {Ctx, Hears, InjectBot, Message, On, Start, Update} from "nestjs-telegraf";
import {Telegraf} from "telegraf";
import {actionButtons} from "./buttons/app.buttons";
import {Context} from "./types/context.interface";
import {displayTasks} from "./utils/app.utils";

@Update()
export class AppUpdate {
  constructor(
    @InjectBot() private readonly bot: Telegraf<Context>,
    private readonly appService: AppService
  ) {}

  @Start()
  async startCommand(ctx: Context) {
    await ctx.reply('Hi, friend 👋');
    await ctx.reply('What do you want to do?', actionButtons());
  }

  @Hears('📋 List of tasks')
  async getTasks(ctx: Context) {
    const todos = await this.appService.getAll();
    await ctx.reply(displayTasks(todos));
  }

  @Hears('📝 Create task')
  async createTask(ctx: Context) {
    await ctx.reply('Enter task:');
    ctx.session.type = 'create';
  }

  @Hears('✅ Complete')
  async completeTask(ctx: Context) {
    await ctx.reply('Enter task ID: ');
    ctx.session.type = 'done';
  }

  @Hears('✏️ Edit')
  async editTask(ctx: Context) {
    await ctx.deleteMessage();
    await ctx.replyWithHTML('Write task ID and new task name \n'
      + 'formatted like - <b>1 | New name</b>'
    );
    ctx.session.type = 'edit';
  }

  @Hears('❌ Delete')
  async removeTask(ctx: Context) {
    await ctx.reply('Enter task ID: ');
    ctx.session.type = 'remove';
  }

  @On('text')
  async getMessage(@Message('text') message: string, @Ctx() ctx: Context) {
    if (!ctx.session.type) return;

    if (ctx.session.type === 'done') {
      const todos = await this.appService.update(Number(message), 'complete', null);

      if (!todos) {
        await ctx.deleteMessage();
        await ctx.reply('Task with this ID not found');
        return;
      }
      await ctx.reply(displayTasks(todos));
    }
    if (ctx.session.type === 'create') {
      const todos = await this.appService.create(message);
      await ctx.reply(displayTasks(todos));
    }

    if (ctx.session.type === 'edit') {
      const [taskId, taskName] = message.split(' | ');
      const todos = await this.appService.update(Number(taskId), 'edit', taskName);

      if (!todos) {
        await ctx.deleteMessage();
        await ctx.reply('Task with this ID not found');
        return;
      }
      await ctx.reply(displayTasks(todos));
    }
    if (ctx.session.type === 'remove') {
      const todos = await this.appService.delete(Number(message));

      if (!todos) {
        await ctx.deleteMessage();
        await ctx.reply('Task with this ID not found');
        return;
      }
      await ctx.reply(displayTasks(todos));
    }
  }
}
