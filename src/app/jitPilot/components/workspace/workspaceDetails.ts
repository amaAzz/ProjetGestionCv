import { Component, ViewChild } from '@angular/core';
import Swal from 'sweetalert2';
import { animate, style, transition, trigger } from '@angular/animations';
import { ModalComponent } from 'angular-custom-modal';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Board } from '../../models/board';
import { BoardPage } from '../../models/board-page';
import { BoardService } from '../../services/board.service';
import { AccessLevel } from '../../models/access-level';
import { ActivatedRoute, Router } from '@angular/router';
import { WorkspaceService } from '../../services/workspace.service';


@Component({
    moduleId: module.id,
    templateUrl: './WorkspaceDetails.html',
    animations: [
        trigger('toggleAnimation', [
            transition(':enter', [style({ opacity: 0, transform: 'scale(0.95)' }), animate('100ms ease-out', style({ opacity: 1, transform: 'scale(1)' }))]),
            transition(':leave', [animate('75ms', style({ opacity: 0, transform: 'scale(0.95)' }))]),
        ]),
    ],
})
export class WorkspaceDetailsComponent {
    constructor(private route: ActivatedRoute,public fb: FormBuilder , private boardService:BoardService ,private router: Router,private workspaceService:WorkspaceService) {}
    defaultParams = {
        boardId: null,
        boardName: '',
        description: '',
        fav: false,
        accessLevel: AccessLevel.PRIVATE,
    };
    @ViewChild('isAddBoardModal') isAddBoardModal!: ModalComponent;
    @ViewChild('isDeleteBoardModal') isDeleteBoardModal!: ModalComponent;
    @ViewChild('isViewBoardModal') isViewBoardModal!: ModalComponent;
    workspaceId:number=0;
    params!: FormGroup;
    isShowNoteMenu = false;
    filterdBoardsList: Board[] = [];
    selectedTab: any = 'all';
    deletedBoard: any = null;

    selectedNote: any = {
        id: null,
        title: '',
        description: '',
        tag: '',
        user: '',
        thumb: '',
    };
    selectedBoard: any;

    boardList:Board[] = [];
    boardPage:BoardPage | undefined 

    ngOnInit() {
        this.route.params.subscribe(params => {
            this.workspaceId = params['workspaceId'];            
          });
        this.getAllBoards();
    }

    getAllBoards(){
        this.workspaceService.getBoardByWorkspaceId(this.workspaceId).subscribe((data) => {
            console.log("id",this.workspaceId);
            console.log("id",data);
            this.boardList=data;

            // this.boardPage = data;
            // this.boardList = this.boardPage.content;
            
            switch(this.selectedTab) {
                case 'all':
                  this.filterdBoardsList = this.boardList;
                  break;
                case 'fav':
                  this.filterdBoardsList = this.boardList.filter(board => board.fav === true);
                  break;
                case 'PRIVATE':
                  this.filterdBoardsList = this.boardList.filter(board => board.accessLevel === AccessLevel.PRIVATE);
                  break;
                case 'PUBLIC':
                    this.filterdBoardsList = this.boardList.filter(board => board.accessLevel === AccessLevel.PUBLIC);
                    break;
                default:
                  console.log('Unknown option');
              }
            console.log(`${this.boardList} fetched succesfully`);
        });
    }


    initForm() {
        this.params = this.fb.group({
            boardId: [0],
            boardName: ['', Validators.required],
            description: [''],
            fav: [false],
            accessLevel: [AccessLevel.PRIVATE],
        });

    }


    saveBoard() {
        if (this.params.controls['boardName'].errors) {
            this.showMessage('board Name is required.', 'error');
            return;
        }
        if (this.params.value.boardId) {
            //update task
            const boardToUpdate: any ={
                boardId: this.params.value.boardId,
                boardName: this.params.value.boardName,
                description: this.params.value.description,
                fav: this.params.value.fav,
                accessLevel: this.params.value.accessLevel,
            }
            this.boardService.updateBoard(
                this.params.value.boardId,
                boardToUpdate
                )
            .subscribe(
                response => {
                    console.log('Board updated successfully:', response);
                    this.getAllBoards();
                },
                error => {console.error('Error updating board:', error);}
                
            );
        } else {
            console.log(this.params.value);
            //add board
            const newBoard: any = {
                boardId: null,
                boardName: this.params.value.boardName,
                description: this.params.value.description,
                accessLevel: this.params.value.accessLevel,
              };
            this.boardService.newBoard(
                1,
                this.workspaceId,
                newBoard
                )
            .subscribe(
                response => {
                    console.log('Board added successfully:', response);
                    this.getAllBoards();
                },
                error => {console.error('Error adding board:', error);}
                
            );
            
        }

        this.showMessage('Note has been saved successfully.');
        this.isAddBoardModal.close();
    }

    tabChanged(type: string) {
        this.selectedTab = type;
        this.getAllBoards();
        this.isShowNoteMenu = false;
    }

    setFav(board: Board) {
        board.fav = !board.fav;
        this.boardService.updateBoard(
            board.boardId,
            board
            )
        .subscribe(
            response => {
                console.log('Board updated successfully:', response);
                this.getAllBoards();
            },
            error => {console.error('Error updating board:', error);}
        );
    }

    setAccessLevel(board: Board, accessLevel: string) {
        board.accessLevel = this.stringToAccessLevel(accessLevel);
        this.boardService.updateBoard(
            board.boardId,
            board
            )
        .subscribe(
            response => {
                console.log('Board updated successfully:', response);
                this.getAllBoards();
            },
            error => {console.error('Error updating board:', error);}
        );
    }

    deleteBoardConfirm(board: any) {
        setTimeout(() => {
            this.deletedBoard = board;
            this.isDeleteBoardModal.open();
        });
    }

    viewBoard(board: any) {
        setTimeout(() => {
            this.selectedBoard = board;
            if (this.selectedBoard.accessLevel !== AccessLevel.PRIVATE) {
                this.router.navigate([`/jitPilot/scrumboard/${this.selectedBoard.boardId}`]);
            } else {
                this.isViewBoardModal.open();  
            }
  
        });
    }

    editBoard(board: any = null) {
        this.isShowNoteMenu = false;
        this.isAddBoardModal.open();
        this.initForm();
        if (board) {
            this.params.setValue({
                boardId: board.boardId,
                boardName: board.boardName,
                description: board.description,
                fav: board.fav,
                accessLevel: board.accessLevel
            });
        }
    }

    deleteBoard() {
        this.boardService.deleteBoard(this.deletedBoard.boardId).subscribe({
            next: () => {
                console.log('Board user after next');
                this.filterdBoardsList = this.filterdBoardsList.filter((b) => b.boardId !== this.deletedBoard.boardId);
                this.showMessage('Board has been deleted successfully.');
                console.log('Board deleted successfully:');
                this.isDeleteBoardModal.close();
            },
            error: (err) => {
                console.error('Error deleting member:', err);
            },
        });
    }

    showMessage(msg = '', type = 'success') {
        const toast: any = Swal.mixin({
            toast: true,
            position: 'top',
            showConfirmButton: false,
            timer: 3000,
            customClass: { container: 'toast' },
        });
        toast.fire({
            icon: type,
            title: msg,
            padding: '10px 20px',
        });
    }

    stringToAccessLevel(value: string): AccessLevel {
        switch (value.toUpperCase()) {
          case 'PRIVATE':
            return AccessLevel.PRIVATE;
          case 'PUBLIC':
            return AccessLevel.PUBLIC;
          default:
            throw new Error(`Invalid access level: ${value}`);
        }
      }
}
