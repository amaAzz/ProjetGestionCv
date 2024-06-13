import { Component } from '@angular/core';
import { User } from '../../../models/modelsCv/user';
import { UserService } from '../../../services/userservice/userservice.service';
import {  Router } from '@angular/router';
import { Role } from '../../../models/modelsCv/Role';

@Component({
  selector: 'app-create-user-component',
  templateUrl: './create-user-component.component.html',
  styleUrls: ['./create-user-component.component.css']
})
export class CreateUserComponentComponent {

    user:User ={
        id: '',
        nom: '',
        prenom: '',
        email: '',
        motDePasse: '',

    };
    submitted = false;

    roles = Object.values(Role);

    constructor(private userService: UserService, private router: Router) {}

    onSubmit(): void {
        this.userService.create(this.user).subscribe(() => {
           /* this.router.navigate(['/users']);*/

        });
    }








    saveUser(): void {
        const data = {
            nom: this.user.nom,
            prenom: this.user.prenom,
            email: this.user.email,
            motDePasse: this.user.motDePasse,

        };

        this.userService.create(data)
            .subscribe({
                next: (res) => {
                    console.log(res);
                    this.submitted = true;
                },
                error: (e) => console.error(e)
            });
    }

    newUser(): void {
        this.submitted = false;
        this.user = {
            id: '',
            nom: '',
            prenom: '',
            email: '',
            motDePasse: '',

        };
    }



}
