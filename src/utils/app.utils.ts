export function displayTasks(todos) {
  return `Ваш список задач: \n\n${todos
    .map(
      todo => (todo.isCompleted ? '✅' : '⭕') + ' ' + todo.name + '\n\n'
    )
    .join('')}`
}