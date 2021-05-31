import { LeaderService } from './../services/leader.service';
import { Component, OnInit } from '@angular/core';
import { Dish } from '../shared/dish';
import { DishService } from '../services/dish.service';
import { Promotion } from '../shared/promotion';
import { PromotionService } from '../services/promotion.service';
import { Leader } from '../shared/leader';
import { Inject } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {


  dish: Dish|undefined;
  promotion: Promotion|undefined;
  leader: Leader|undefined;
  diserrMess!: string;
  promoerrMess!: string;
  leadererrMess!: string;
  baseURL2 = '';

  constructor(private dishservice: DishService,
    private promotionservice: PromotionService,
    private leaderService: LeaderService,
    @Inject('BaseURL') private baseURL:any) {
      this.baseURL2 = baseURL;
      console.log("baseURL2=",this.baseURL2);
    }

  ngOnInit() {
    this.dishservice.getFeaturedDish().subscribe(dish => this.dish = dish ,
      errmess => this.diserrMess = <any>errmess);
    this.promotionservice.getFeaturedPromotion().subscribe(promotion => this.promotion = promotion,
      errmess => this.promoerrMess = <any>errmess);
    this.leaderService.getFeaturedLeader().subscribe(leader => this.leader = leader,
        errmess => this.leadererrMess = <any>errmess);

  }

}
