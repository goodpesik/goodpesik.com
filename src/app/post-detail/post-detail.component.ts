import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl, SafeUrl} from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { PostService } from '../post.service';
import { Post} from '../post';

@Component({
  selector: 'app-post-detail',
  templateUrl: './post-detail.component.html',
  styleUrls: ['./post-detail.component.scss']
})
export class PostDetailComponent implements OnInit {
  post: Post;
  image: SafeResourceUrl;

  constructor(
    private route: ActivatedRoute,
    private postService: PostService,
    private location: Location,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit() :void {
    this.getPost();
    
  }

  getPost(): void{
    const id = +this.route.snapshot.paramMap.get('id');
    let sanitizer = this.sanitizer;
    let self = this;

    
    this.postService.getPost(id)
    .subscribe(function(post) {
      self.post = post[0];

      if (self.post.photo) {
        self.image = self.sanitizer.bypassSecurityTrustUrl(self.post.photo)
      }
    });
  }

  goBack(): void {
    this.location.back();
  }
}
