import { DishService } from './../services/dish.service';
import { Dish } from './../shared/dish';
import { Component, OnInit, Inject } from '@angular/core';



@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {
  dishes : Dish[]|undefined;
  baseURL2 = '';
  errMess!: string;

  constructor(private dishService: DishService,
              @Inject('BaseURL') private baseURL:any) {
     this.baseURL2 = baseURL;
     console.log("baseURL2=",this.baseURL2);
  }

  ngOnInit(): void {
    this.dishService.getDishes()
    .subscribe(dishes => this.dishes = dishes,
      errmess => this.errMess = <any>errmess);
  }


}
