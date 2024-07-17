import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject, map } from 'rxjs';
import { Router } from '@angular/router';

import { Post } from './post.model';


@Injectable({ providedIn: 'root' })
export class PostService {
  private posts: Post[] = [];
  private postSub = new Subject<Post[]>();

  constructor(private http: HttpClient, private router:Router) {}

  getPosts() {
    this.http
      .get<{ message: string; posts: any }>(
        'http://localhost:3000/api/posts'
      )
      .pipe(
        map((postData) => {
          return postData.posts.map((post:any)=> {
            return {
              title: post.title,
              content: post.content,
              id: post._id
            }
          });
        })
      )
      .subscribe((transformedPostData) => {
        this.posts = transformedPostData;
        console.log('transformedPostData: ', transformedPostData);
        
        this.postSub.next([...transformedPostData]);
      });
  }

  getPostUpdateListener() {
    return this.postSub.asObservable();
  }

  getPost(id:string | null){
    return this.http.get<any>('http://localhost:3000/api/posts/'+ id);
  }

  addPost(title: string, content: string) {
    const newpost: Post = {id:null,  title: title, content: content };
    console.log(newpost);
    this.http
      .post<{ message: string, postId: string }>('http://localhost:3000/api/posts', newpost)
      .subscribe((data) => {
        console.log(data.message);
        newpost.id = data.postId;
        this.posts.push(newpost);        
        this.postSub.next([...this.posts]);
        this.router.navigate(["/"]);
      });
  }

  updatePost(id:string | null, title:string, content: string){
    const post:Post = {id:id, title:title, content:content}
    this.http.put('http://localhost:3000/api/posts/' + post.id, post)
      .subscribe((response) => {
        const updatedPosts = [...this.posts];
        const oldPostIndex = updatedPosts.findIndex(p => p.id === id);
        updatedPosts[oldPostIndex] = post;
        this.posts = updatedPosts;
        this.postSub.next([...this.posts]);
        this.router.navigate(["/"]);
      })
  }

  deletePost(postId:string){
    this.http.delete('http://localhost:3000/api/posts/'+ postId)
      .subscribe(()=>{
        const updatedPosts = this.posts.filter((post) => post.id !== postId);
        this.posts = updatedPosts;
        this.postSub.next([...this.posts]);
        
      })
  }
}
