import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";

import { Post } from "../post.model";
import { PostService } from "../posts.service";

@Component({
    selector: 'app-post-list',
    templateUrl: './post-list.component.html',
    styleUrls: ['./post-list.component.css']
})

export class PostListComponent implements OnInit, OnDestroy {
  
    panelOpenState:any; 
    // posts:any = [
    //     {title: 'Post 1', content: 'This is post 1 content'},
    //     {title: 'Post 2', content: 'This is post 2 content'},
    //     {title: 'Post 3', content: 'This is post 3 content'}
    // ]
    posts:Post[] = [];
    private postSubscription!:Subscription;

    constructor(public postsService: PostService
    ){

    }

    ngOnInit(): void {
        this.postsService.getPosts();
        this.postSubscription = this.postsService.getPostUpdateListener().subscribe((posts:Post[])=>{
            this.posts =posts;
       })
    }

    ngOnDestroy(): void {
        this.postSubscription.unsubscribe()
    }

    nextStep(){

    }
}