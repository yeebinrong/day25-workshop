import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Todo, TodoSummary } from './models';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http:HttpClient, private router:Router) { }


  // ### PUT REQUEST ###

  // ### POST REQUEST ###
  // SAVES ONE FORM TO MYSQL
  apiSaveData(formData:Todo):Promise<any> {
    let fd:FormData = new FormData()
    fd.append('data', JSON.stringify(formData))
    return this.http.post('http://localhost:3000/api/upload', fd).toPromise()
  }



  // ### GET REQUEST ###
  // RETURNS ONE FORM FROM MYSQL
  apiGetForm(id):Promise<Todo> {
    console.info("getting form id")
    return this.http.get<Todo>('http://localhost:3000/api/todo/' + id).toPromise()
  }

  // RETURNS ALL THE TODO SUMMARY FOR MAIN PAGE FROM MYSQL
  async apiGetTodo() {
    console.info("getting to do")
    return await this.http.get<TodoSummary[]>('http://localhost:3000/api/todo/all').toPromise()
  }



  // ### DELETE REQUEST ###
  // DELETES ONE FORM FROM MYSQL
  async apiDeleteForm(id):Promise<any> {
    return this.http.delete<any>('http://localhost:3000/api/todo/' + id).toPromise()
  }



  // ### OTHERS ###
  // REDIRECTS TO ERROR PAGE
  redirectError () {
    this.router.navigate(['/error'])
  }
}
