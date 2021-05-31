import { LeaderService } from './../services/leader.service';
import { LEADERS } from './../shared/leaders';
import { Component, OnInit } from '@angular/core';
import {Leader} from './../shared/leader';
import { Inject } from '@angular/core';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {
  leaders: Leader[]|undefined;
  leadererrMess!: string;
  baseURL2 = '';

  constructor(private leaderService:LeaderService,
    @Inject('BaseURL') private baseURL:any) {
      this.baseURL2 = baseURL;
      console.log("baseURL2=",this.baseURL2);
    }

  ngOnInit(): void {
    this.leaderService.getLeaders().subscribe(leaders => this.leaders = leaders,
      errmess => this.leadererrMess = <any>errmess);
  }

}
