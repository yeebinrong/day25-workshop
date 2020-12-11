import { Component, OnInit, ViewChild } from '@angular/core';
import { Todo } from '../models';
import { FormComponent } from './form.component';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  TodoSummary: Todo[] = []
  constructor() { }

  ngOnInit(): void {
  }
}
