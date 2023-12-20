import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, effect, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { FilterType, TodoModel } from '../../models/todo';

@Component({
  selector: 'app-todo',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './todo.component.html',
  styleUrl: './todo.component.scss'
})
export class TodoComponent implements OnInit {
  todolist = signal<TodoModel[]>([])

  filter = signal<FilterType>('all')

  todoListFiltered = computed<TodoModel[]>(() => {
    const filter = this.filter()
    const todos = this.todolist()
    const todoListFiltered = {
      active: todos.filter(t => !t.completed),
      completed: todos.filter(t => t.completed),
      all: todos
    }

    return todoListFiltered[filter]
  })

  newTodo = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.minLength(3)]
  })

  constructor() {
    effect(() => {
      localStorage.setItem('todos', JSON.stringify(this.todolist()))
    })
  }
  ngOnInit(): void {
    const storage = localStorage.getItem('todos')
    storage && this.todolist.set(JSON.parse(storage))
  }

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

    // this.todolist.set([ newTodo, ...this.todolist()])
    this.todolist.update(prevTodo => [newTodo, ...prevTodo])
    this.newTodo.reset()
  }

  updateTodoEditingMode(todoId: number) {
    this.todolist.update(prevTodo => {
      return prevTodo
        .map(todo => todo.id === todoId ? {...todo, editing: true} : {...todo, editing: false})
    })
  }

  saveTitleTodo(todoId: number, event: Event){
    const title = (event.target as HTMLInputElement).value
    this.todolist.update(prevTodo => prevTodo
      .map(t => t.id === todoId ? {...t, title, editing: false} : t))
  }

  toggleTodo(todoId: number) {
    this.todolist.update(prevTodo => {
      return prevTodo.map(t => t.id === todoId ? {...t, completed: !t.completed} : t)
    })
  }

  removeTodo(todoId: number) {
    this.todolist.update(prevTodo => {
      return prevTodo.filter(t => t.id !== todoId)
    })
  }
}
