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
              id: post._id,
              imagePath: post.imagePath
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
    return this.http.get<{_id: string, title: string, content:string, imagePath: string}>('http://localhost:3000/api/posts/'+ id);
  }

  addPost(title: string, content: string, image: File) {
    // const newpost: Post = {id:null,  title: title, content: content };
    const postData = new FormData();
    postData.append("title", title);
    postData.append("content", content);
    postData.append("image", image, title);
    console.log(postData);
    this.http
      .post<{ message: string, post: Post }>('http://localhost:3000/api/posts', postData)
      .subscribe((data) => {
        console.log(data.message);
        const post:Post = { id: data.post.id, title: title, content: content, imagePath: data.post.imagePath };

        // postData.id = data.postId;
        this.posts.push(post);        
        this.postSub.next([...this.posts]);
        this.router.navigate(["/"]);
      });
  }

  updatePost(id:string | null, title:string, content: string, image: File | string){
    // const post:Post = {id:id, title:title, content:content, imagePath: null}
    // let postData: Post | FormData ;
    let postData:any;
    if (typeof(image) === 'object'){
      postData = new FormData;
      postData.append('id', id)
      postData.append('title', title);
      postData.append('content', content);
      postData.append('image', image, title);
    } else{
      postData = {
        id: id,
        title: title,
        content: content,
        imagePath: image
      }
    }
    this.http.put('http://localhost:3000/api/posts/' + id, postData)
      .subscribe((response) => {
        const updatedPosts = [...this.posts];
        const oldPostIndex = updatedPosts.findIndex(p => p.id === id);
        const post:Post = {
          id: id,
          title: title,
          content: content,
          imagePath: ''
        }
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
