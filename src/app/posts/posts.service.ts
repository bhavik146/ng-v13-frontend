import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Post } from './post.model';
import { Subject, map } from 'rxjs';
import { title } from 'process';

@Injectable({ providedIn: 'root' })
export class PostService {
  private posts: Post[] = [];
  private postSub = new Subject<Post[]>();

  constructor(private http: HttpClient) {}

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
      });
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
