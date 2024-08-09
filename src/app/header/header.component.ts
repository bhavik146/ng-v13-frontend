import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { AuthService } from '../auth/auth.service';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css']
})

export class HeaderComponent implements OnInit, OnDestroy {

    isUserAuthenticated = false;
    authListenerSub:Subscription;

    constructor(private authService:AuthService){}

    ngOnInit(): void {
        this.isUserAuthenticated = this.authService.getAuth();
        this.authListenerSub = this.authService.getAuthStatusListener().subscribe((authListenerStatus)=>{
            this.isUserAuthenticated = authListenerStatus;
        });
    }

    onLogout(){
        this.authService.logout();
    }

    ngOnDestroy(): void {
        this.authListenerSub.unsubscribe();
    }
}