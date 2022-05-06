import { Component, OnInit } from '@angular/core';
import { Blog } from './../models/blog';
import { BlogService} from './../services/blog.service';
import { Router } from '@angular/router';
import { environment } from './../../environments/environment';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css']
})
export class BlogComponent implements OnInit {

  email = localStorage.getItem('userMail');
  p: number = 1;
  imgUrl = environment.imgUrl;
  blogs: Blog[];
  images;
  close;
  closeResult = '';
  constructor(
    private router: Router,
    private blogService: BlogService,
  ) { }

  ngOnInit(): void {
    this.blogService.blogList().then((data:Blog[]) => {
      this.blogs  = data;
    }).catch((error) =>{
    });
  }
  onDetail(id:number, titre: string){
    let slug = this.string_to_slug(titre);
    this.router.navigate(['/blog',  id , slug]);
  }
  string_to_slug (str) {
    str = str.replace(/^\s+|\s+$/g, ''); // trim
    str = str.toLowerCase();
  
    // remove accents, swap ñ for n, etc
    var from = "àáäâèéëêìíïîòóöôùúüûñç·/_,:;";
    var to   = "aaaaeeeeiiiioooouuuunc------";
    for (var i=0, l=from.length ; i<l ; i++) {
        str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
    }

    str = str.replace(/[^a-z0-9 -]/g, '') // remove invalid chars
        .replace(/\s+/g, '-') // collapse whitespace and replace by -
        .replace(/-+/g, '-'); // collapse dashes

    return str;
}

}
