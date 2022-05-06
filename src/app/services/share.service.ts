import { Injectable } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import {Metatag} from '../models/metatag'

@Injectable({
  providedIn: 'root'
})
export class ShareService {

  private urlMeta: string = "og:url";
  private titleMeta: string = "og:title";
  private descriptionMeta: string = "og:description";
  private imageMeta: string = "og:image";
  private secureImageMeta: string = "og:image:secure_url";

  constructor(private meta: Meta) { } 

  public setFacebookTags(url: string, title: string, description: string, image: string): void {
    var imageUrl = `${image}`;
    var tags = [
      new Metatag(this.urlMeta, url),
      new Metatag(this.titleMeta, title),
      new Metatag(this.descriptionMeta, description),
      new Metatag(this.imageMeta, imageUrl),
      new Metatag(this.secureImageMeta, imageUrl)
    ];
    this.setTags(tags);
  }

  private setTags(tags: Metatag[]): void {
    tags.forEach(siteTag => {
      this.meta.updateTag({ property: siteTag.name, content: siteTag.value });
    });
  }
  generateTags(config) {
    // default values
    config = {
      title: 'IYATG',
      description: 'Iyatg: La plateforme des artisans',
      image: 'https://iyatg.com/assets/img/iyalogo.png',
      url: 'https://iyatg.com',
      ...config
    }
  
    this.meta.updateTag({ name: 'twitter:card', content: 'Iyatg' });
    this.meta.updateTag({ name: 'twitter:site', content: '@content' });
    this.meta.updateTag({ name: 'twitter:title', content: config.title });
    this.meta.updateTag({ name: 'twitter:description', content: config.description });
    this.meta.updateTag({ name: 'twitter:image', content: config.image });
    this.meta.updateTag({ property: 'og:type', content: 'article' });
    this.meta.updateTag({ property: 'og:site_name', content: 'content' });
    this.meta.updateTag({ property: 'og:title', content: config.title });
    this.meta.updateTag({ property: 'og:description', content: config.description });
    this.meta.updateTag({ property: 'og:image', content: config.image });
    this.meta.updateTag({ property: 'og:url', content: config.slug });
  }
}
