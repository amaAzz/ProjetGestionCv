//import { Component, OnInit } from '@angular/core';

import {
    Component,
    OnInit,
    ViewChild
} from '@angular/core';
import Swal from 'sweetalert2';
import {
    animate,
    style,
    transition,
    trigger
} from '@angular/animations';
import {
    ModalComponent
} from 'angular-custom-modal';
import {
    FormBuilder,
    FormGroup,
    Validators
} from '@angular/forms';
import {
    workspace
} from '../../models/workspace';
import {
    WorkspaceService
} from '../../services/workspace.service';
import {
    Router
} from '@angular/router';
import {
    AppService
} from 'src/app/service/app.service';


@Component({
    selector: 'app-workspace',
    templateUrl: './workspace.component.html',
    styleUrls: ['./workspace.component.css'],
    animations: [
        trigger('toggleAnimation', [
            transition(':enter', [style({
                opacity: 0,
                transform: 'scale(0.95)'
            }), animate('100ms ease-out', style({
                opacity: 1,
                transform: 'scale(1)'
            }))]),
            transition(':leave', [animate('75ms', style({
                opacity: 0,
                transform: 'scale(0.95)'
            }))]),
        ]),
    ],
})
export class WorkspaceComponent implements OnInit {
    workspaces!: workspace[];
    filtredWorkspaces: any = [];
    constructor(public fb: FormBuilder, private workspaceServie: WorkspaceService, private router: Router, private appService: AppService) {}

    paramms = {
        workspaceId: null,
        name: '',
        description: '',
    };

    @ViewChild('isAddWorkspaceModal') isAddWorkspaceModal!: ModalComponent;
    @ViewChild('isDeleteWorkspaceModal') isDeleteWorkspaceModal!: ModalComponent;
    //@ViewChild('isViewNoteModal') isViewNoteModal!: ModalComponent;
    isShowWorkspaceMenu = false;
    deletedWorkspace: any = null;
    selectedWorkspace!: workspace;

    selectedTab: any = 'all';

    ngOnInit() {
        this.getAllWorkspace();
        this.appService.currentWorspace.subscribe((workspacef) => (this.selectedWorkspace = workspacef));
    }

    getAllWorkspace() {
        this.workspaceServie.getAllWorkspace().subscribe((data) => {
            this.workspaces = data;
            this.filtredWorkspaces = this.workspaces;
            console.log('data', data);
        });
    }

    addEditWorkspace(workspace: any = null) {
        setTimeout(() => {
            this.paramms = {
                workspaceId: null,
                name: '',
                description: '',
            };

            if (workspace) {
                this.paramms = JSON.parse(JSON.stringify(workspace));
            }
            this.isAddWorkspaceModal.open();
        });
    }

    saveWorkspace() {
        if (!this.paramms.name) {
            this.showMessage('name is required.', 'error');
            return;
        }

        if (this.paramms.workspaceId) {
            const works: workspace = {
                workspaceId: this.paramms.workspaceId,
                name: this.paramms.name,
                description: this.paramms.description,
            };
            console.log(this.paramms.workspaceId, works);

            this.workspaceServie.update(this.paramms.workspaceId, works).subscribe(
                (res) => {
                    console.log('API Response:', res);
                    const idx = this.workspaces.findIndex((WORKS) => {
                        this.showMessage('workspace has been updated successfully.');
                        return WORKS.workspaceId == res.workspaceId;
                    });
                    this.workspaces[idx] = res;
                },
                (error) => {
                    console.error('Error updating workspace:', error);
                }
            );
        } else {
            //add project

            const newWorkspace: workspace = {
                workspaceId: 0, // Set a temporary value or handle it on the server
                name: this.paramms.name,
                description: this.paramms.description,
            };

            this.workspaceServie.create(1, newWorkspace).subscribe(
                (addedCategory) => {
                    this.workspaces.push(addedCategory);
                    this.showMessage('workspace has been saved successfully.');
                },
                (error) => {
                    console.error('Error adding workspace:', error);
                }
            );
        }

        //this.showMessage('workspace has been saved successfully.');
        this.isAddWorkspaceModal.close();
    }

    viewWorkspace(workspace: workspace) {
        setTimeout(() => {
            this.selectedWorkspace = workspace;
            sessionStorage.setItem('workspaceItem', JSON.stringify(this.selectedWorkspace));
            this.appService.selectWorkspace(this.selectedWorkspace);
            this.router.navigate([`/jitPilot/board/${workspace.workspaceId}/boards`]);
        });
    }

    deleteWorkspaceConfirm(workspace: any) {
        setTimeout(() => {
            this.deletedWorkspace = workspace;
            this.isDeleteWorkspaceModal.open();
        });
    }

    deleteWorkspace() {
        this.workspaceServie.deleteWorkspace(this.deletedWorkspace.workspaceId).subscribe({
            next: () => {
                this.filtredWorkspaces = this.filtredWorkspaces.filter((w: any) => w.workspaceId !== this.deletedWorkspace.workspaceId);
                this.showMessage('Workspace has been deleted  successfully.');
                this.isDeleteWorkspaceModal.close();
            },
        });
    }

    showMessage(msg = '', type = 'success') {
        const toast: any = Swal.mixin({
            toast: true,
            position: 'top',
            showConfirmButton: false,
            timer: 3000,
            customClass: {
                container: 'toast'
            },
        });
        toast.fire({
            icon: type,
            title: msg,
            padding: '10px 20px',
        });
    }
}
