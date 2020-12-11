import { ViewChild } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../api.service';
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
    // check if there was an id specified
    if (id) {
      this.apiSvc.apiGetForm(id)
      .then (results => {
        console.info(results)
        // if id is specified retrieve data from mysql and display on subform component
        this.formRef.todo = results
      }).catch(err => {
        // Log error and redirect
        console.info(`Error id:"${id}" not found: `)
        this.apiSvc.redirectError()
      })
    }
  }
}
