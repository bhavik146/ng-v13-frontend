import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';

import { PostService } from '../posts.service';
import { Post } from '../post.model';

import {mimeType} from './mime-type.validator';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css'],
})

export class PostCreateComponent implements OnInit {
  post: Post;
  isLoading: boolean = false;
  form: FormGroup;
  imagePreview:string;
  private mode: string = 'create';
  public postId: string | null;

  constructor(
    public postService: PostService,
    public route: ActivatedRoute,
    private router: Router
  ) {}
  // @Output() postCreated = new EventEmitter<Post>();
  ngOnInit(): void {
    this.form = new FormGroup({
      'title': new FormControl(null, {
        validators: [Validators.required, Validators.minLength(2)],
      }),
      'content': new FormControl(null, {
        validators: [Validators.required]
      }),
      'image': new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [mimeType]
      })
    });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        this.mode = 'edit';
        this.postId = paramMap.get('postId');
        this.isLoading = true;
        this.postService.getPost(this.postId).subscribe((postData) => {
          this.isLoading = false;
        //   console.log('postData from getPost() with id: ', postData);
          this.post = {
            'id' : postData._id,
            'title' : postData.title,
            'content': postData.content
          };
        //   console.log(this.post);
          this.form.setValue({'title': this.post.title, 'content': this.post.content});
        });
      } else {
        this.mode = 'create';
        this.postId = null;
      }
    });
  }

  onImagePicked(event:Event){

    const file = (event.target as HTMLInputElement).files?.item(0);
    console.log(this.form.get('image'));
    this.form.patchValue({'image': file});
    this.form.get('image')?.updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = (file) => {
      this.imagePreview = reader.result as string;
    }
    reader.readAsDataURL(file as Blob);
    
  }

  onAddPost() {
    console.log(this.form.get('file'));
    
    if (this.form.invalid) {
      return;
    }
    if (this.mode === 'create') {
      this.postService.addPost(this.form.value.title, this.form.value.content);
    } else if (this.mode === 'edit') {
      this.postService.updatePost(
        this.postId,
        this.form.value.title,
        this.form.value.content
      );
    }
    this.form.reset();
  }
}
