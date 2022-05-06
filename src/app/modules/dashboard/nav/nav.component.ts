import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, Inject} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import * as $ from 'jquery';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit, AfterViewInit {

  @ViewChild('myToogle') divView: ElementRef;
  role = localStorage.getItem('role');
  isAdmin = false;
  constructor(@Inject(DOCUMENT) private document: Document) {
    if(this.role == 'admin'){
      this.isAdmin = true;
    }
   }
  ngOnInit(): void {
  }
  ngAfterViewInit(){
    $("#sidebarToggle, #sidebarToggleTop").on('click', ()=>{
          $("body").toggleClass("sidebar-toggled");
          $(".sidebar").toggleClass("toggled");
          if ($(".sidebar").hasClass("toggled")) {
            $('.sidebar .collapse').collapse('hide');
          };
    }
    )
  }


}
