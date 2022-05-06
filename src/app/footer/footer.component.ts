import { Component, OnInit, ViewChild, ElementRef, NgZone, AfterViewInit, Inject, Injectable } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit, AfterViewInit{
  @ViewChild('myLoader') divView: ElementRef;
  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit(){
    const preloader =  this.divView.nativeElement;
    setTimeout(() => {
      preloader.remove();
    }, 800);

}
}
