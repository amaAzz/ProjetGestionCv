import { Component } from '@angular/core';
import { User } from '../../../models/modelsCv/user';
import { Router } from '@angular/router';

@Component({
  selector: 'app-read-user-component',
  templateUrl: './read-user-component.component.html',
  styleUrls: ['./read-user-component.component.css']
})
export class ReadUserComponentComponent {
    users: User[] = [];





}
