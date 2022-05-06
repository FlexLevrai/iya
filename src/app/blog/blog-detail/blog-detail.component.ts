import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Blog } from './../../models/blog';
import { BlogService } from './../../services/blog.service';
import { environment } from './../../../environments/environment';
import { GalleryItem, ImageItem } from 'ng-gallery';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { ShareService } from './../../services/share.service';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-blog-detail',
  templateUrl: './blog-detail.component.html',
  styleUrls: ['./blog-detail.component.css']
})
export class BlogDetailComponent implements OnInit {
  imgUrl = environment.imgUrl;
  baseUrl = environment.baseUrl;
  email = localStorage.getItem('userMail');
  blog: Blog;
  images;
  close;
  closeResult = '';
  id;
  constructor(
    private blogService: BlogService,
    private route: ActivatedRoute,
    private router: Router,
    public meta: Meta, 
    public title: Title,
    private shareService:ShareService,
    private modalService: NgbModal,
  ) { 
    this.meta.updateTag({ name: 'description', content: "Iya article" }); 
  }

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];

    this.blogService.blogbyId(this.id).then((data:Blog) => {
      this.blog = data;
      this.blog.vues++;
      let description = this.blog.article.length>50? this.blog.article.slice(0,50) +'...':this.blog.article;
      let image = this.blog.images.split(",");
      this.meta.updateTag({ name: 'description', content: description }); 
      this.title.setTitle(this.blog.title);
      this.shareService.generateTags({
        title: this.blog.title,
        description:  description,
        image: `${this.imgUrl}${image[0]}`,
        url: `${this.baseUrl}${this.router.url}`,
      })
      // this.shareService.setFacebookTags(
      //   `${this.baseUrl}${this.router.url}`,
      //   this.blog.title,
      //   description,
      //   `${this.imgUrl}${image[0]}`);
      // console.log("tag",`${this.baseUrl}${this.router.url}`, description, `${this.imgUrl}${image[0]}`);
      this.blogService.updateBlog(this.blog).then((data) => {
      }).catch((error) =>{
      });
      this.images = [];
      const img = this.blog.images;
      if(img){
        const imgs = img.split(',');
        for (const imge of imgs) {
          this.images.push(new ImageItem({ src: `${this.imgUrl}${imge}`, thumb: `${this.imgUrl}${imge}` }))
        }
      }else{
        this.images = [
          new ImageItem({ src: 'assets/img/iyalogo1.png', thumb: 'assets/img/iyalogo1.png' })
        ];
      }
    }).catch((error) => {
      // console.log(error);
    });
  }

}
