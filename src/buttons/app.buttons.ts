import { Markup } from 'telegraf';

export function actionButtons() {
  return Markup.keyboard(
    [
      Markup.button.callback('📋 List of tasks', 'list'),
      Markup.button.callback('📝 Create task', 'create'),
      Markup.button.callback('✅ Complete', 'done'),
      Markup.button.callback('✏️ Edit', 'edit'),
      Markup.button.callback('❌ Delete', 'delete')
    ],
    {
      columns: 2
    }
  );
}