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
    this.apiSvc.apiGetTodo()
    .then (data => {
      this.TodoSummary = data
    }) 
  }
}
