import { Comment } from '../shared/comment';
import { DishService } from '../services/dish.service';
import { Dish } from '../shared/dish';
import { Component, Input, OnInit } from '@angular/core';
import {Location} from '@angular/common';
import { ActivatedRoute} from '@angular/router';
import {Params} from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { Inject } from '@angular/core';

@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss'],
  animations: [
    trigger('visibility', [
        state('shown', style({
            transform: 'scale(1.0)',
            opacity: 1
        })),
        state('hidden', style({
            transform: 'scale(0.5)',
            opacity: 0
        })),
        transition('* => *', animate('0.5s ease-in-out'))
    ])
  ]
})
export class DishdetailComponent implements OnInit {

  dishcopy!: Dish;
  dish!: Dish;
  dishIds!: string[];
  prev!: string;
  next!: string;
  commentForm!: FormGroup;
  comment!: Comment;
  dishErrMess !: string;

  visibility = 'shown';
  baseURL2 = '';

  @ViewChild('fform') commentFormDirective:any;

  formErrors : {[key: string]: string} = {
    'author': '',
    'rating': '',
    'comment': ''
  };

  validationMessages : {[key: string]: {[key: string]: string}}= {
    'author': {
      'required':      'author is required.',
      'minlength':     'author Name must be at least 2 characters long.',
      'maxlength':     'author Nmae cannot be more than 25 characters long.'
    },
    'rating': {
      'required':      'Rating is required.',
    },
    'comment': {
      'required':      'comment is required.',
    },
  };
  constructor(private dishService : DishService,
              private location:Location,
              private route:ActivatedRoute,
              private fb: FormBuilder,
              @Inject('BaseURL') private baseURL:any) {
                this.baseURL2 = baseURL;
                console.log("baseURL2=",this.baseURL2);
                this.createForm();
               }

              ngOnInit() {
                this.dishService.getDishIds().subscribe(dishIds => this.dishIds = dishIds ,
                  dishErrMess => this.dishErrMess = <any>dishErrMess);
                  // tslint:disable-next-line:align
                  this.route.params.pipe(switchMap((params: Params) => { this.visibility = 'hidden'; return this.dishService.getDish(params['id']); }))
                  .subscribe(dish => { this.dish = dish; this.dishcopy = dish; this.setPrevNext(<string>dish.id); this.visibility = 'shown'; },
                    errmess => this.dishErrMess = <any>errmess);
              }

              setPrevNext(dishId: string) {
                const index = this.dishIds.indexOf(dishId);
                this.prev = this.dishIds[(this.dishIds.length + index - 1) % this.dishIds.length];
                this.next = this.dishIds[(this.dishIds.length + index + 1) % this.dishIds.length];
              }

  goBack(): void {
    this.location.back();
  }

  // tslint:disable-next-line:typedef
  createForm() {
    this.commentForm = this.fb.group({
      author: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)] ],
      rating: ['5', [Validators.required]],
      comment: ['', [Validators.required]] ,
      date: ['', '' ],
    });

    this.commentForm.valueChanges
      .subscribe(data => this.onValueChanged(data));

    this.onValueChanged(); // (re)set validation messages now
  }
  onSubmit() {

    let d : Date = new Date();
    let dateString : String = d.toISOString();
    this.commentForm.value.date = dateString ;
    this.comment = this.commentForm.value;
    console.log(this.comment);
    this.dish.comments?.push(this.comment);
    this.commentForm.reset({
      author: '',
      rating: '5',
      comment: '',
      date: ''
    });
    this.commentFormDirective.resetForm();

    this.dishcopy?.comments?.push(this.comment);
    this.dishService.putDish(this.dishcopy)
      .subscribe(dish => {
        this.dish = dish; this.dishcopy = dish;
      },
      errmess => { this.dish = <any>null; this.dishcopy = <any>null; this.dishErrMess = <any>errmess; });
  }

  onValueChanged(data?: any) {
    if (!this.commentForm) { return; }
    const form = this.commentForm;
    for (const field in this.formErrors) {
      if (this.formErrors.hasOwnProperty(field)) {


        this.formErrors[field]='';

        const control = form.get(field);
        if (control && control.dirty && !control.valid) {
          const messages  = this.validationMessages[field];
          for (const key in control.errors) {
            if (control.errors.hasOwnProperty(key)) {
              this.formErrors[field] += messages[key] + ' ';
            }
          }
        }
      }
    }
  }

}
