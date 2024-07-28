import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { PageEvent } from "@angular/material/paginator";

import { Post } from "../post.model";
import { PostService } from "../posts.service";
import { Subscription } from "rxjs";


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
    isLoading = false;
    totalPosts = 0;
    postPerPage = 2;
    currentPage = 1;
    pageSizeOptions = [1,2,5,10]
    private postSubscription!:Subscription;

    constructor(public postsService: PostService, private router:Router
    ){

    }

    ngOnInit(): void {
        this.isLoading = true;
        this.postsService.getPosts(this.postPerPage, this.currentPage);
        this.postSubscription = this.postsService.getPostUpdateListener().subscribe((postData:{posts: Post[], postCount: number})=>{
            this.isLoading = false;
            this.totalPosts = postData.postCount;
            this.posts =postData.posts;
       })
    }

    onChangedPage(pageData: PageEvent){
        this.isLoading = false;
        this.currentPage = pageData.pageIndex + 1;
        this.postPerPage = pageData.pageSize;
        this.postsService.getPosts(this.postPerPage, this.currentPage);
    }

    onDelete(postId:any ){
        // console.log("this.posts", this.posts);
        // console.log("postId",postId );
        if (postId){
            this.postsService.deletePost(postId).subscribe(() => {
                this.postsService.getPosts(this.postPerPage, this.currentPage)
            });

        } else{
            console.log("Unable to delete post without id!");
        }        
    }

    
    ngOnDestroy(): void {
        this.postSubscription.unsubscribe()
    }

}