import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Post } from "./post.model";
import { Subject } from "rxjs";

@Injectable({providedIn: 'root'})
export class PostService{

    private posts:Post[] =[];
    private postSub = new Subject<Post[]>();
    
    constructor(private http: HttpClient){}

    getPosts(){
        this.http.get<{message: string, posts: Post[]}>('http://localhost:3000/api/posts')
            .subscribe((postData)=>{
                this.posts = postData.posts;
                this.postSub.next([...postData.posts]);
            })
    }

    getPostUpdateListener(){
        return this.postSub.asObservable();
    }

    addPost(title:string,content:string){
        const newpost:Post = {title: title, content: content};
        console.log(newpost)
        this.http.post<{message: string}>('http://localhost:3000/api/posts', newpost).subscribe(
            (data) =>{
                console.log(data.message);
                this.posts.push(newpost);
                this.postSub.next([...this.posts]);
            }
        )
        
    }
}