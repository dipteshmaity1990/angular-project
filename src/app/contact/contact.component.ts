import { ViewChild } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FeedbackService } from '../services/feedback.service';
import { Feedback, ContactType } from '../shared/feedback';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { Inject } from '@angular/core';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
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
export class ContactComponent implements OnInit {

  constructor(private fb: FormBuilder,private feedbackService : FeedbackService) {
    this.createForm();
  }
  feedbackForm!: FormGroup;
  feedback!: Feedback;
  contactType = ContactType;
  feedbackErrMess !: string;
  feedbackcopy!: Feedback;
  loading = true;
  visibility = 'shown';

  @ViewChild('fform') feedbackFormDirective:any;

  // tslint:disable-next-line:member-ordering
  formErrors : {[key: string]: string} = {
    'firstname': '',
    'lastname': '',
    'telnum': '',
    'email': '',
  };

  validationMessages : {[key: string]: {[key: string]: string}}= {
    'firstname': {
      'required':      'First Name is required.',
      'minlength':     'First Name must be at least 2 characters long.',
      'maxlength':     'FirstName cannot be more than 25 characters long.'
    },
    'lastname': {
      'required':      'Last Name is required.',
      'minlength':     'Last Name must be at least 2 characters long.',
      'maxlength':     'Last Name cannot be more than 25 characters long.'
    },
    'telnum': {
      'required':      'Tel. number is required.',
      'pattern':       'Tel. number must contain only numbers.'
    },
    'email': {
      'required':      'Email is required.',
      'email':         'Email not in valid format.'
    },
  };

  ngOnInit(): void {
  }

  createForm() {
    this.feedbackForm = this.fb.group({
      firstname: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)] ],
      lastname: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)] ],
      telnum: ['', [Validators.required, Validators.pattern] ],
      email: ['', [Validators.required, Validators.email] ],
      agree: false,
      contacttype: 'None',
      message: ''
    });

    this.feedbackForm.valueChanges
      .subscribe(data => this.onValueChanged(data));

    this.onValueChanged(); // (re)set validation messages now
  }
  onSubmit() {
    this.feedback = this.feedbackForm.value;
    console.log(this.feedback);
    this.loading = false;
    this.visibility = 'hidden';
    this.feedbackService.submitFeedback(this.feedback)
    .subscribe(feedback => {
      console.log ("feedback==>",feedback);
      this.loading = true;
      this.visibility = 'shown';
      this.feedback = feedback; this.feedbackcopy = feedback;
      setTimeout(() => {
        this.visibility = 'hide';
      }, 500);
    },
    errmess => { this.feedback = <any>null; this.feedbackcopy = <any>null; this.feedbackErrMess = <any>errmess; });

    setInterval(() => {
      this.visibility = 'hide';
    }, 5000);

    this.feedbackForm.reset({
      firstname: '',
      lastname: '',
      telnum: '',
      email: '',
      agree: false,
      contacttype: 'None',
      message: ''
    });
    this.feedbackFormDirective.resetForm();
  }

  onValueChanged(data?: any) {


    if (!this.feedbackForm) { return; }
    const form = this.feedbackForm;
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
