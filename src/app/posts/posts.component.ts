import { Component, OnInit, ElementRef } from '@angular/core';
import { PostService } from '../post.service';
import { Post} from '../post';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.scss']
})

export class PostsComponent implements OnInit {
  posts: Post[];
  singlePost: Post;
  private limit:number;
  private addPostNumber:number;
  private hideButton:boolean;
  private settings: {
    limit: string,
    showMore: string
  }

  constructor(
    private postService: PostService,
    private elRef:ElementRef
    ) { }

  ngOnInit() {
    this.getPosts();
    this.settings = this.elRef.nativeElement.querySelector('div.post-display-settings').dataset;
    this.limit = parseFloat(this.settings.limit);
    this.addPostNumber = parseFloat(this.settings.showMore);
    this.hideButton = false;
  }

  private getPosts(): void {
    this.postService.getPosts()
    .subscribe(posts => this.posts = posts);
  }

  public showMore(): void {
    this.limit += this.addPostNumber;

    if (this.limit >= this.posts.length) {
      this.hideButton = true;
    }
  }
}
