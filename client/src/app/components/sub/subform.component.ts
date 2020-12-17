import { Component, OnInit } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { ApiService } from 'src/app/api.service';
import { Todo } from 'src/app/models';

@Component({
  selector: 'app-subform',
  templateUrl: './subform.component.html',
  styleUrls: ['./subform.component.css']
})
export class SubformComponent implements OnInit {
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
    values.due = values.due.format("DD-MM-YYYY")
    console.info("values are is : ", values)
    this.apiSvc.apiSaveData(values)
    .then (() => {
      // // navigate to /
      this.router.navigate(['/']);
    })
  }

  // Allows parent component to set todo values
  set todo(f:Todo) {
    for (let i of f.tasks) {
      this.onAddTask()
    }
    this.form.patchValue({
      id: f.id,
      name: f.name,
      due:   moment(f.due, 'DD-MM-YYYY'),
      tasks: f.tasks
    })
  }

  // #### PRIVATE FUNCTIONS ####

  // creates the logic for the <form>
  private InitForm () {
    this.form = this.fb.group({
      id: this.fb.control(null),
      name: this.fb.control('', [Validators.required]),
      due: this.fb.control('', [Validators.required]),
      tasks: this.fb.array([])
    })
  }

  // creates a new task to be appended to the form
  private CreateTask() {
    return this.fb.group({
      task_id: this.fb.control(null),
      description: this.fb.control('', [Validators.required]),
      priority: this.fb.control("Low", [Validators.required]),
      image_file: this.fb.control('')
    })
  }
}
