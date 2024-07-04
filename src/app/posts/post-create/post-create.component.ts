import { Component, EventEmitter, Output } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Post } from "./../post.model";
import { PostService } from "../posts.service";

@Component({
    selector: 'app-post-create',
    templateUrl: './post-create.component.html',
    styleUrls: ['./post-create.component.css']
})

export class PostCreateComponent {
    
    postService:PostService
    constructor(postService: PostService){
        this.postService =postService;
    }
    // @Output() postCreated = new EventEmitter<Post>();
    onAddPost(form:NgForm){
        if(form.invalid){
            return;
        }
        // const post:Post = {
        //     title: form.value.title,
        //     content: form.value.content
        // }
        this.postService.addPost(form.value.title, form.value.content);
        form.resetForm();
    }
}