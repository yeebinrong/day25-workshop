import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../api.service';
import { Todo } from '../models';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {
  minDate:Date = new Date()
  form:FormGroup
  tasks:FormArray

  constructor(private fb:FormBuilder, private apiSvc:ApiService, private router:Router) { }

  ngOnInit(): void {
    this.InitForm()
    this.tasks = this.form.get('tasks') as FormArray;
  }

  onAddTask() {
    const task = this.CreateTask()
    this.tasks.push(task)
  }

  onDeleteTask(index:number) {
    this.tasks.removeAt(index)
  }

  onSaveForm () {
    // get the new todo from the form
    const values = Object.assign({},this.form.value)
    values.due = values.due._d.toDateString()
    // save this to the database
    this.apiSvc.apiSaveData(values);
    // // navigate to /
    // this.router.navigate(['/']);
  }

  // creates the logic for the <form>
  private InitForm () {
    this.form = this.fb.group({
      name: this.fb.control('', [Validators.required]),
      due: this.fb.control('', [Validators.required]),
      tasks: this.fb.array([])
    })
  }

  private CreateTask() {
    return this.fb.group({
      description: this.fb.control('', [Validators.required]),
      priority: this.fb.control("Low", [Validators.required])
    })
  }
}
