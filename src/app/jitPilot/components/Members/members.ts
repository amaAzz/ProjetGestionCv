import { Component, ViewChild } from '@angular/core';
import Swal from 'sweetalert2';
import { animate, style, transition, trigger } from '@angular/animations';
import { ModalComponent } from 'angular-custom-modal';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserResponse } from '../../models/user-response';

import { ActivatedRoute, Router } from '@angular/router';

@Component({
    moduleId: module.id,
    templateUrl: './members.html',
    animations: [
        trigger('toggleAnimation', [
            transition(':enter', [
                style({
                    opacity: 0,
                    transform: 'scale(0.95)',
                }),
                animate(
                    '100ms ease-out',
                    style({
                        opacity: 1,
                        transform: 'scale(1)',
                    })
                ),
            ]),
            transition(':leave', [
                animate(
                    '75ms',
                    style({
                        opacity: 0,
                        transform: 'scale(0.95)',
                    })
                ),
            ]),
        ]),
    ],
})
export class MembersComponent {


}

