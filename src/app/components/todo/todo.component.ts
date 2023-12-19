import { Component, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { FilterType, TodoModel } from '../../models/todo';

@Component({
  selector: 'app-todo',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './todo.component.html',
  styleUrl: './todo.component.scss'
})
export class TodoComponent {
  todolist = signal<TodoModel[]>([
    {
      id: 1,
      title: 'Estudar Signals',
      completed: false,
      editing: false
    },
    {
      id: 2,
      title: 'Estudar Next',
      completed: false,
      editing: false
    },
    {
      id: 3,
      title: 'Academia',
      completed: false,
      editing: false
    },
  ])

  filter = signal<FilterType>('all')

  newTodo = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.minLength(3)]
  })

  changeFilter(filterString: FilterType) {
    this.filter.set(filterString)
  }

  addTodo() {
    if(this.newTodo.invalid || this.newTodo.value.trim() === '') return;

    const newTodo: TodoModel = {
      id: this.todolist().length + 1,
      title: this.newTodo.value,
      completed: false,
      editing: false,
    }

    this.todolist.set([ newTodo, ...this.todolist()])
    this.newTodo.reset()
  }

  editTodo(holdTodo: TodoModel) {
    this.todolist.update(currentValue => {
      return currentValue.map(todo => todo.id === holdTodo.id ? {...todo, editing: true} : todo)
    })
  }
}
