import { ViewChild } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../api.service';
import { Todo } from '../models';
import { SubformComponent } from './sub/subform.component';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {
  @ViewChild('form')
  formRef: SubformComponent;

  constructor(private activeRoute:ActivatedRoute, private apiSvc:ApiService) { }

  ngOnInit(): void {
    const id = this.activeRoute.snapshot.params['id'];
    if (id) {
      this.apiSvc.apiGetForm(id)
      .then (results => {
        console.info(results)
        this.formRef.todo = results
      }).catch(err => {
        // Log error and redirect
        console.info(`Error id:"${id}" not found: `, err )
        this.apiSvc.redirectError()
      })
    }
  }
}
