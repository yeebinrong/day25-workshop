import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from '../api.service';
import { TodoSummary } from '../models';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  TodoSummary: TodoSummary[] = []
  constructor(private apiSvc:ApiService) { }

  ngOnInit(): void {
    // retrieve the all todo summary from mysql and display on main component
    this.apiSvc.apiGetTodo()
    .then (data => {
      console.info(data)
      this.TodoSummary = data
    }) 
  }

  // Delete todo todo form on main component
  onDeleteTodo(index) {
    if (window.confirm("Delete task?")) {
      this.apiSvc.apiDeleteForm(this.TodoSummary[index].id)
      this.TodoSummary.splice(index, 1)
    }
  }
}
