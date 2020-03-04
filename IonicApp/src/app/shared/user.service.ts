import { Injectable } from '@angular/core';
import { User } from './user.model';
import{ HttpClient, HttpHeaders, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import{ environment } from '../../environments/environment'; //localhost:3000/api
import { Observable } from 'rxjs';


@Injectable({ providedIn: 'root'})

export class UserService { selectedUser: User = { 
    fullName: '', email: '', password: '', role: ''};

  constructor(private http: HttpClient) { 
  
  } 

  noAuthHeader = { headers: new HttpHeaders({'NoAuth':'True'})};

  postUser(user: User): Observable<any> { 
    return this.http.post(environment.apiBaseUrl+'/register',user);
  }

  login(body): Observable<any>{
    return this.http.post(environment.apiBaseUrl + '/authenticate', body);
  }

  requestReset(body): Observable<any> {
    return this.http.post(environment.apiBaseUrl + '/req-reset-password', body);
  }

  newPassword(body): Observable<any> {
    return this.http.post(environment.apiBaseUrl +'/new-password', body);
  }

  ValidPasswordToken(body): Observable<any> {
    return this.http.post(environment.apiBaseUrl +'/valid-password-token', body);
  }


  setToken(token: string){
    localStorage.setItem('token', token);
  }  

  deleteToken(){ 
    localStorage.removeItem('token');
  }

  getToken(){ 
    return localStorage.getItem('token'); 
  }
  getUserPayload(){
    var token = localStorage.getItem('token');
    if (token){
      var userPayload = atob(token.split('.')[1]);
      return JSON.parse(userPayload);
    }
    else 
      return null;
  }

  isLoggedIn(){
    var userPayload = this.getUserPayload();
    if (userPayload)
      return userPayload.exp > Date.now()/1000;
  }

  
}

