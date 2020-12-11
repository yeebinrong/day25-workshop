import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Todo, TodoSummary } from './models';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http:HttpClient) { }

  // SAVES ONE FORM TO MYSQL
  apiSaveData(formData:Todo) {
    console.info(formData)
    let fd:FormData = new FormData()
    console.info(JSON.stringify(formData))
    fd.append('data', JSON.stringify(formData))
    this.http.post('http://localhost:3000/api/upload', fd).toPromise()
  }

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
}
