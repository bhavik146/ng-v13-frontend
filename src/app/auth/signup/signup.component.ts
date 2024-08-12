import { Component, OnDestroy, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Subscription } from "rxjs";

import { AuthService } from "../auth.service";

@Component({
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.css']
})

export class SignupComponent implements OnInit, OnDestroy{
    
    isLoading = false;
    private authStatusSub:Subscription;
    constructor(private authService:AuthService){}

    ngOnInit(): void {
        this.authStatusSub = this.authService
          .getAuthStatusListener()
          .subscribe((authSatus) => {
            this.isLoading = false;
          });
    }

    onSignup(form:NgForm){
        if (form.invalid){
            return;
        }
        this.isLoading = true;
        this.authService.createUser(form.value.email, form.value.password);
    }

    ngOnDestroy(): void {
        //Called once, before the instance is destroyed.
        //Add 'implements OnDestroy' to the class.
        this.authStatusSub.unsubscribe();
    }
}