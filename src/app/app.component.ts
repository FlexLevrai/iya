import { Component} from '@angular/core';
import { environment } from '../environments/environment';
import { MessagingService } from './services/messaging.service';
// import { FacebookService, InitParams } from "ngx-facebook";
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'iyafrontend';
  public phone = "+228 7051 1542"
  public titre = "Iyatg";
  message;
  constructor(private messagingService: MessagingService) { }


  ngOnInit(): void {
    this.messagingService.requestPermission()
    this.messagingService.receiveMessage()
    this.message = this.messagingService.currentMessage
    let cc = window as any;
       cc.cookieconsent.initialise({
         palette: {
           popup: {
             background: '#000'
           },
           button: {
             background: "#fa6400",
             text: "#fff"
           }
         },
         theme: "classic",
         content: {
           message: "Notre site utilise des cookies afin d'améliorer votre expérience utilisateur",
           dismiss: "Ok",
           link: "",
           href:  environment.cookieDomain + "/dataprivacy" 
         }
       });
  }
  // private initFacebookService(): void {
  //   const initParams: InitParams = { xfbml:true, version:"v3.2"};
  //   this.facebookService.init(initParams);
  // }

}
