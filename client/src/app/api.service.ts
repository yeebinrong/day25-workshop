import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Todo } from './models';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http:HttpClient) { }
  apiSaveData(formData:Todo) {
    console.info(formData)
    let fd:FormData = new FormData()
    console.info(JSON.stringify(formData))
    fd.append('data', JSON.stringify(formData))
    console.info(fd)
    this.http.post('http://localhost:3000/api/upload', fd).toPromise()
  }
}
