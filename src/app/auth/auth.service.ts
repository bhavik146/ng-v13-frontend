import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';


import { AuthData } from './auth-data.model';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private isAuthenticated = false;
  private token:any;
  private tokenTimer:NodeJS.Timer;
  private userId:string | null;

  private authStatusListener = new Subject<boolean>();

  constructor(private http: HttpClient, private router:Router) {}

  getToken(){
    return this.token;
  }

  getAuth(){
    return this.isAuthenticated;
  }

  getUserId(){
    return this.userId;
  }

  getAuthStatusListener(){
    return this.authStatusListener.asObservable();
  }

  createUser(email: string, password: string) {
    const authData: AuthData = {
      email: email,
      password: password,
    };
    this.http
      .post('http://localhost:3000/api/user/signup', authData)
      .subscribe((response) => {
        console.log(response);
      });
  }

  login(email: string, password: string) {
    const authData: AuthData = {
        email: email,
        password: password,
      };
    this.http.post<{token: string, expiresIn:number, userId:string}>('http://localhost:3000/api/user/login', authData)
      .subscribe(response => {
        // console.log("response: ", response);
        const token = response.token;
        this.token = token;
        if(token){
          const expiresInDuration = response.expiresIn;
          this.setAuthTimer(expiresInDuration);
          this.isAuthenticated = true;
          this.userId = response.userId;
          this.authStatusListener.next(true);
          const now = new Date();
          const expirationData = new Date(now.getTime() + expiresInDuration * 1000);
          console.log("expirationData: "+expirationData);
          this.saveAuthData(token, expirationData, this.userId);
          this.router.navigate(['/']);
        }
      })
  }

  autoAuthUser(){
    const authInformation = this.getAuthData();
    console.log("authInformation: "+ authInformation?.token);
    console.log("authInformation: "+ authInformation?.expirationData);

    const now = new Date();
    let expiresIn:any;
    if (authInformation?.expirationData){
      expiresIn = authInformation?.expirationData.getTime() - now.getTime();
    } else{
      return;
    }
    console.log("authInformation: "+authInformation);
    
    console.log("expiresIn: "+ expiresIn)
    if (expiresIn > 0 && authInformation?.token){
      this.token = authInformation.token;
      this.isAuthenticated = true;
      this.userId = authInformation.userId;
      this.setAuthTimer(expiresIn / 1000);
      this.authStatusListener.next(true);
      console.log("token present!!")
    }
    
  }

  setAuthTimer(duration:number){
    this.tokenTimer = setTimeout(()=>{
      this.logout();
    }, duration * 1000);
  }

  logout(){
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(this.isAuthenticated);
    this.userId = null;
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.router.navigate(['/']);
  }

  private saveAuthData(token:string, expirationData: Date, userId:string){
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationData.toISOString());
    if(this.userId){
      localStorage.setItem('userId', this.userId);
    }
  }

  private clearAuthData(){
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('userId');
  }

  private getAuthData(){
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    const userId = localStorage.getItem('userId');
    if(!token || !expirationDate){
      return;
    }
    return {
      token: token,
      expirationData: new Date(expirationDate),
      userId: userId
    }
  }
}
