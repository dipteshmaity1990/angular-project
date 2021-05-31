import { LoginComponent } from './../login/login.component';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor(public matDialog:MatDialog) { }

  ngOnInit(): void {
  }
  openLoginForm(){
   this.matDialog.open(LoginComponent, {width:'500px', height:'600px'});
  }
}
