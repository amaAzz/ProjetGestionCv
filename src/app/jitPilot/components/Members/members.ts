import { Component, ViewChild } from '@angular/core';
import Swal from 'sweetalert2';
import { animate, style, transition, trigger } from '@angular/animations';
import { ModalComponent } from 'angular-custom-modal';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserResponse } from '../../models/user-response';
import { UserService } from '../../services/user.service';
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
    constructor(public fb: FormBuilder, private userService: UserService, private router: Router, private route: ActivatedRoute) {}

    displayType = 'grid';
    @ViewChild('addContactModal') addContactModal!: ModalComponent;
    @ViewChild('isDeleteMemeberModal') isDeleteMemeberModal!: ModalComponent;
    params!: FormGroup;
    paramsInvite!: FormGroup;
    filteredMembersList: UserResponse[] = [];
    memberList: UserResponse[] = [];
    searchUser = '';
    workspaceId!: number;
    deletedMember: any = null;
    invetUser: UserResponse = {userId: 0, email:"", path:"",role:"",lastName:"",firstName:"",createdAt:new Date()};

    buildFormInvite(){
        this.paramsInvite = this.fb.group({
            email: ['', Validators.required]
        });
    }
    inviteMember(){
        if (this.paramsInvite.valid) {
            this.invetUser.email = this.paramsInvite.getRawValue().email;
        }
        this.userService.invitUserToWorkspace(this.workspaceId, this.invetUser).subscribe(
            (res) =>{
                console.log('User invited successfully:' , res);
                this.invetUser = JSON.parse(JSON.stringify(res));
                this.memberList.push(this.invetUser);
                this.addContactModal.close();
                this.showMessage('User invited successfully!.');
            },
            (error) => {
                console.error('Error inviting user:', error);
            }
        )
    }
    initForm() {
        this.params = this.fb.group({
            userId: [0],
            firstName: ['', Validators.required],
            lastName: ['', Validators.required],
            path: ['', Validators.required],
            email: ['', Validators.compose([Validators.required, Validators.email])],
            role: ['', Validators.required],
        });
    }

    ngOnInit() {
        this.route.params.subscribe((params) => {
            this.workspaceId = params['workspaceId'];

            console.log(this.workspaceId);
        });
        this.searchContacts();
        this.getUsers();
        this.buildFormInvite()
        console.log(this.memberList);

    }

    getUsers(): void {
        this.userService.getUserByWorkspace(this.workspaceId).subscribe((data: UserResponse[]) => {
            this.memberList = data;
            this.filteredMembersList = data;
            console.log(data);
        });
    }

    // removeUser(id: number) {
    //     console.log("remove user ")
    //     this.userService.removeUser(id, this.workspaceId).subscribe({
    //         next: () => {
    //             console.log('remove user after next');
    //             this.filteredMembersList = this.filteredMembersList.filter((member) => member.userId !== id);
    //             this.memberList = this.memberList.filter((member) => member.userId !== id);
    //             this.showMessage('User has been deleted successfully.');
    //             console.log('member deleted successfully');
    //         },
    //         error: (err) => {
    //             console.error('Error deleting member:', err);
    //         },
    //     });
    // }

    deleteMemberConfirm(member: any) {
        setTimeout(() => {
            this.deletedMember = member;
            this.isDeleteMemeberModal.open();
        }, 10);
    }

    deleteMember() {
        this.userService.removeUser(this.deletedMember.userId, this.workspaceId).subscribe({
            next: () => {
                console.log('member after next');
                this.filteredMembersList = this.filteredMembersList.filter((member) => member.userId !== this.deletedMember.userId);
                this.memberList = this.memberList.filter((member) => member.userId !== this.deletedMember.userId);
                this.getUsers();
                this.showMessage('member has been deleted successfully.');
                console.log('member deleted successfully:');
                this.isDeleteMemeberModal.close();
            },
            error: (err) => {
                console.error('Error deleting member:', err);
            },
        });
    }

    //--------------------------------------------------------
    searchContacts() {
        this.filteredMembersList = this.memberList.filter(
            (member: UserResponse) =>
                member.firstName.toLowerCase().includes(this.searchUser.toLowerCase()) || member.lastName.toLowerCase().includes(this.searchUser.toLowerCase())
        );
    }

    deleteUser(user: any = null) {
        this.memberList = this.memberList.filter((d) => d.userId != user.userId);
        this.searchContacts();
        this.showMessage('User has been removed from workspace.');
    }

    editUser(user: any = null) {
        this.addContactModal.open();
        this.initForm();
        if (user) {
            this.params.setValue({
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                path: user.path,
                email: user.email,
                role: user.role,
            });
        }
    }



    saveUser() {
        if (this.params.controls['email'].errors) {
            this.showMessage('Email is required.', 'error');
            return;
        }
        if (this.params.value.userId) {
            //update user
            let user: any = this.memberList.find((d) => d.userId === this.params.value.userId);
            user.firstName = this.params.value.firstName;
            user.lastName = this.params.value.lastName;
            user.path = this.params.value.path;
            user.email = this.params.value.email;
            user.role = this.params.value.role;
        } else {
            //add user
            let maxUserId = this.memberList.length
                ? this.memberList.reduce((max: number, character: UserResponse) => (character.userId > max ? character.userId : max), this.memberList[0].userId)
                : 0;

            let user: UserResponse = {
                userId: maxUserId + 1,
                firstName: this.params.value.firstName,
                lastName: this.params.value.lastName,
                path: this.params.value.path,
                email: this.params.value.email,
                role: this.params.value.role,
                createdAt: new Date(),
            };
            this.memberList.splice(0, 0, user);
            this.searchContacts();
        }

        this.showMessage('User has been saved successfully.');
        this.addContactModal.close();
    }



    showMessage(msg = '', type = 'success') {
        const toast: any = Swal.mixin({
            toast: true,
            position: 'top',
            showConfirmButton: false,
            timer: 3000,
            customClass: {
                container: 'toast',
            },
        });
        toast.fire({
            icon: type,
            title: msg,
            padding: '10px 20px',
        });
    }

}

