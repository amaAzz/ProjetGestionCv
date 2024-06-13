import { Component, OnInit, ViewChild } from '@angular/core';
import Swal from 'sweetalert2';
import { animate, style, transition, trigger } from '@angular/animations';
import { ModalComponent } from 'angular-custom-modal';
import { FlatpickrOptions } from 'ng2-flatpickr';
import { ActivatedRoute } from '@angular/router';
import { BoardService } from '../../services/board.service';
import { FormBuilder } from '@angular/forms';
import { Board } from '../../models/board';
import { Section } from '../../models/section';
import { SectionService } from '../../services/section.service';
import { TicketPriority } from '../../models/ticket-priority';
import { TicketStatus } from '../../models/ticket-status';
import { Ticket } from '../../models/ticket';
import { TicketService } from '../../services/ticket.service';
import { retry } from 'rxjs';
import { Task } from '../../models/task';
import { TaskService } from '../../services/task.service';
import { Sprint } from '../../models/sprint';
import { SprintService } from '../../services/sprint.service';
import { log } from 'console';
import { UserService } from '../../services/user.service';
import { UserResponse } from '../../models/user-response';

@Component({
    moduleId: module.id,
    templateUrl: './boardDetails.html',
    animations: [
        trigger('toggleAnimation', [
            transition(':enter', [style({ opacity: 0, transform: 'scale(0.95)' }), animate('100ms ease-out', style({ opacity: 1, transform: 'scale(1)' }))]),
            transition(':leave', [animate('75ms', style({ opacity: 0, transform: 'scale(0.95)' }))]),
        ]),
    ],
})
export class BoardDetailsComponent implements OnInit {
    constructor(
        private route: ActivatedRoute,
        public fb: FormBuilder,
        private boardService: BoardService,
        private sectionService: SectionService,
        private ticketService: TicketService,
        private taskService:TaskService,
        private sprintService:SprintService,
        private userService: UserService

    ) {}
    ngOnInit(): void {
        this.route.params.subscribe((params) => {
            this.boardId = params['boardId'];
        });
        this.getBoardById();
        this.getSprints();
        this.workspaceId = JSON.parse(sessionStorage.getItem('workspaceItem')!).workspaceId;
        console.log(this.workspaceId);
        this.getUsers();

    }    
    boardId: number = 0;
    currentBoard!: Board;
    boardName!: string;
    sectionList!: Section[];
    deletedSection!: Section;
    workspaceId!: number;
    currentSection!: Section;
    ticketToDelete!: Ticket;
    taskToDelete!: Task;
    sectionToClear!: Section;
    TasksList!:Task[];
    progress!:string;
    currentTicket!:Ticket

    sprint: Sprint = {
        sprintId: null,
        sprintNumber: null,
        startDate: new Date(),
        endDate: new Date(),
        achievedVelocity: null,
        targetVelocity: null
    }
    sprintParams = {
        sprintId: null,
        sprintNumber: null,
        startDate: new Date(),
        endDate: new Date(),
        achievedVelocity: null,
        targetVelocity: null
    };
    
    params = {
        sectionId: null,
        sectionTitle: '',
        tickets: [],
    };
    paramsTicket = {
        ticketId: null,
        title: '',
        description: '',
        descriptionContent: '',
        priority: TicketPriority.HIGH,
        status: TicketStatus.IN_PROGRESS,
        tasks:[],
        complexityPoints:null,
        users:[],
        endDate: ''

    };
    paramsTask = {
        taskId: null,
        title:'',
        done:false
        
    }
    editorOptions = {
        toolbar: [[{ header: [1, 2, false] }], ['bold', 'italic', 'underline', 'link'], [{ list: 'ordered' }, { list: 'bullet' }], ['clean']],
    };
    sprintsList: Sprint[] = [  ]
    selectedSprint!: any;


    @ViewChild('isAddSectionModal') isAddSectionModal!: ModalComponent;
    @ViewChild('isAddTicketModal') isAddTicketModal!: ModalComponent;
    @ViewChild('isDeleteModal') isDeleteModal!: ModalComponent;
    @ViewChild('isDeleteTaskModal') isDeleteTaskModal!: ModalComponent;
    @ViewChild('isDeleteSectionModal') isDeleteSelectionModal!: ModalComponent;
    @ViewChild('isClearAlllModal') isClearAlllModal!: ModalComponent;
    @ViewChild('isViewTicketModal') isViewTicketModal!: ModalComponent;
    @ViewChild('isAddTaskModal') isAddTaskModal!: ModalComponent;
    @ViewChild('isAddSprintModal') isAddSprintModal!: ModalComponent;

    selectedTab = '';

    getBoardById() {
        this.boardService.getBoardById(this.boardId).subscribe(
            (response) => {
                this.currentBoard = response;
                this.sectionList = this.currentBoard.sections;
                console.log("res=>>", this.currentBoard);
                console.log("Sections=>>", this.sectionList);
                
                this.boardName = this.currentBoard.boardName;
            },
            (error) => {
                console.error('Error geting board:', error);
            }
        );
    }

    getSprints(){
        this.sprintService.getSprintsByBoard(this.boardId).subscribe(
            (response) => {
                this.sprintsList = response;
                this.selectedSprint = this.sprintsList[0]
                console.log("helooooooooooooooooo Sprints =>>>>", this.sprintsList);
            },
            (error) => {
                console.error('Error geting Sprints:', error);
            }
        )
    }

    addEditSection(section: any = null) {
        setTimeout(() => {
            this.params = {
                sectionId: null,
                sectionTitle: '',
                tickets: [],
            };
            if (section) {
                this.params = JSON.parse(JSON.stringify(section));
            }
            this.isAddSectionModal.open();
        });
    }


    addSprint(){
        setTimeout(() => {
            this.sprintParams = {
                sprintId: null,
                sprintNumber: null,
                startDate: new Date(),
                endDate: new Date(),
                achievedVelocity: null,
                targetVelocity: null
            };
            this.isAddSprintModal.open();
        });
    }

    saveSection() {
        if (!this.params.sectionTitle) {
            this.showMessage('Title is required.', 'error');
            return;
        }

        if (this.params.sectionId) {
            //update section
            const sectionToUpdate: Section = {
                sectionId: this.params.sectionId,
                sectionTitle: this.params.sectionTitle,
                description: this.params.sectionTitle,
                tickets: this.params.tickets,
            };
            this.sectionService.updateSection(this.params.sectionId, sectionToUpdate).subscribe(
                (response) => {
                    console.log('section updated successfully:', response);
                    let section:any = this.sectionList.find((section: any) => section.sectionId === this.params.sectionId);
                    section.sectionTitle = sectionToUpdate.sectionTitle;
                },
                (error) => {
                    console.error('Error updating section:', error);
                }
            );
        } else {
            //add section
            const newSection: any = {
                sectionId: null,
                sectionTitle: this.params.sectionTitle,
                description: this.params.sectionTitle,
                tickets: [],
            };
            this.sectionService.newSection(this.boardId, newSection).subscribe(
                (response) => {
                    console.log('section added successfully:', response);
                    this.sectionList.push(response);
                },
                (error) => {
                    console.error('Error adding section:', error);
                }
            );
        }

        this.showMessage('section has been saved successfully.');
        this.isAddSectionModal.close();
    }

    saveSprint() {
        console.log("new Sprint Object Details =====>", this.sprintParams);
        // this.sprint.startDate = this.sprint.startDate?.toLocaleDateString
        // if(typeof this.sprint.startDate === 'string'){
        //     console.log("typeof startdate field before =====>", typeof this.sprint.startDate);
        //     this.sprint.startDate = new Date(this.sprint.startDate)
        //     console.log("typeof startdate field after =====>", typeof this.sprint.startDate);
        // }
        
        
        // this.sprint.startDate = this.sprint.startDate?.getDate;        
        const newSprint: any = {
            sprintId: null,
            sprintNumber: this.sprintParams.sprintNumber,
            startDate: new Date(this.sprintParams.startDate),
            endDate: new Date(this.sprintParams.endDate),
            targetVelocity: this.sprintParams.targetVelocity
        };

        this.sprintService.addSprint(this.boardId, newSprint).subscribe(
            (response) => {
                console.log("Sprint added successfully: ", response);
                console.log("new Sprint response Object ===>", response);
                this.isAddSprintModal.close();
                this.showMessage('Sprint has been added successfully.');
                this.sprintsList.push(response)
            },
            (error) => {
                console.error('Error adding sprint:', error);
            }
        )

    }

    deleteSectionConfirm(section: Section) {
        setTimeout(() => {
            this.currentSection = section;
            console.log("helooooooo==>", this.currentSection) 
            this.isDeleteSelectionModal.open();
        });
    }

    clearConfirmModal(section: any = null) {
        setTimeout(() => {
            this.sectionToClear = section;
            this.isClearAlllModal.open();
        }, 10);
    }
    tasks!:Task[]
    ViewTicketModal(ticket: Ticket , section:Section) {
        setTimeout(() => {
            this.currentSection = section;
            this.paramsTicket = JSON.parse(JSON.stringify(ticket));
            this.users= this.paramsTicket.users;
            this.filtredUsers=this.users;

            this.taskService.getTasksByTicket(ticket.ticketId).subscribe(
                (response) => {
                    console.log('tasks fetched successfully:', response);
                    this.TasksList = response;
                },
                (error) => {
                    console.error('Error gettig Tasks of ticket:'+ticket.ticketId, error);
                }
            );  
            this.isViewTicketModal.open();
            
        }, 10);
    }
    clearAllTicket() {
        this.ticketService.deleteAllTicket(this.sectionToClear.sectionId).subscribe({
            next: () => {
                this.sectionToClear.tickets = [];
                this.showMessage('all Ticket has been deleted successfully.');
                this.isClearAlllModal.close();
            },
            error: (err) => {
                console.error('Error deleting Ticket:', err);
            },
        });
    }


    deleteSection() {
        this.sectionService.deleteSection(this.currentSection.sectionId).subscribe({
            next: () => {
                console.log('Section after next');
                this.sectionList = this.sectionList.filter((section: any) => section.sectionId != this.currentSection.sectionId);
                this.showMessage('Section has been deleted successfully.');
                this.isDeleteSelectionModal.close();
            },
            error: (err) => {
                console.error('Error deleting Section:', err);
            },
        });
    }
    // task
    addEditTicket(ticket: any = null, section: Section) {
        this.paramsTicket = {
            ticketId: null,
            title: '',
            description: '',
            descriptionContent: '',
            priority: TicketPriority.HIGH,
            status: TicketStatus.IN_PROGRESS,
            tasks:[],
            users:[],
            endDate:'',
            complexityPoints:null
        };
        if (ticket) {
            this.paramsTicket = JSON.parse(JSON.stringify(ticket));

        }
        this.currentSection = section;
        this.isAddTicketModal.open();
    }

    saveTicket() {
        if (!this.paramsTicket.title) {
            this.showMessage('Title is required.', 'error');
            return;
        }

        if (this.paramsTicket.ticketId) {
            //update task            
            const ticketToUpdate: any = {
                ticketId: this.paramsTicket.ticketId,
                title: this.paramsTicket.title,
                description: this.paramsTicket.description,
                priority: this.paramsTicket.priority,
                status: this.paramsTicket.status,
                descriptionContent:this.paramsTicket.descriptionContent,
                endDate:this.paramsTicket.endDate

            };
            console.log(ticketToUpdate);
            
            this.ticketService.updateTicket(this.paramsTicket.ticketId, ticketToUpdate).subscribe(
                (response) => {
                    console.log('ticket updated successfully:', response);
                    const ticket:any = this.sectionList.find((section: any) => section.sectionId === this.currentSection.sectionId)
                                            ?.tickets.find((ticket:any) => ticket.ticketId === this.paramsTicket.ticketId);
                    ticket.title = ticketToUpdate.title;
                    ticket.description = ticketToUpdate.description;
                    ticket.descriptionContent = ticketToUpdate.descriptionContent;
                    ticket.priority = ticketToUpdate.priority;
                    ticket.status = ticketToUpdate.status;
                    

                },
                (error) => {
                    console.error('Error updating ticket:', error);
                }
            );
        } else {
            //add task
            const newTicket: any = {
                ticketId: null,
                title: this.paramsTicket.title,
                description: this.paramsTicket.description,
                priority: this.paramsTicket.priority,
                status: this.paramsTicket.status,
                descriptionContent:this.paramsTicket.description,
                endDate:this.paramsTicket.endDate,
                complexityPoints:this.paramsTicket.complexityPoints

            };
            this.ticketService.newTicket(this.currentSection.sectionId , this.selectedSprint.sprintId , newTicket).subscribe(
                (response) => {
                    console.log('Ticket added successfully:', response);
                    this.sectionList.find((section: any) => section.sectionId === this.currentSection.sectionId)?.tickets.push(response);
                },
                (error) => {
                    console.error('Error adding Ticket:', error);
                }
            );
        }

        this.showMessage('ticket has been saved successfully.');
        this.isAddTicketModal.close();
    }
    addEditTask(task: any = null, ticket: any = null) {
        this.paramsTask = {
            taskId: null,
            title:'',
            done:false
    
        }
        if (task) {
            this.paramsTask = JSON.parse(JSON.stringify(task));
        }
        this.currentTicket = ticket;
        this.isAddTaskModal.open();
    }
    saveTask() {
        console.log(this.paramsTask.title);
        
        if (!this.paramsTask.title) {
            this.showMessage('Title is required.', 'error');
            return;
        }

        if (this.paramsTask.taskId) {
            //update task
            const taskToUpdate: any = {
                taskId: this.paramsTask.taskId,
                title: this.paramsTask.title,
                done: this.paramsTask.done
            };
            this.taskService.updateTask(this.paramsTask.taskId, taskToUpdate).subscribe(
                (response) => {
                    console.log('task updated successfully:', response);
                    const task:any = this.TasksList.find((task:Task) => task.taskId === this.paramsTask.taskId);
                    task.title = this.paramsTask.title;
                },
                (error) => {
                    console.error('Error updating task:', error);
                }
            );
        } else {
            //add task
            const newTask: any = {
                taskId: null,
                title: this.paramsTask.title,
                done: this.paramsTask.done
            };
            this.taskService.newTask(this.currentTicket.ticketId, newTask).subscribe(
                (response) => {
                    console.log('task added successfully:', response);
                    this.TasksList.push(response);
                    const ticket:any = this.sectionList.find((section: any) => section.sectionId === this.currentSection.sectionId)
                    ?.tickets.find((ticket:any) => ticket.ticketId === this.paramsTicket.ticketId);
                    
                    ticket.progress = this.calculateProgress(this.TasksList);
                },
                (error) => {
                    console.error('Error adding task:', error);
                }
            );
        }

        this.showMessage('task has been saved successfully.');
        this.isAddTaskModal.close();
    }


    deleteConfirmModal(ticket: any = null) {
        setTimeout(() => {
            this.ticketToDelete = ticket;
            this.isDeleteModal.open();
        }, 10);
    }
    deleteTaskConfirmModal(task: any = null) {
        setTimeout(() => {
            this.taskToDelete = task;
            this.isDeleteTaskModal.open();
        }, 10);
    }
    deleteTicket() {
        this.ticketService.deleteTicket(this.ticketToDelete.ticketId).subscribe({
            next: () => {
                const sectionToUpdate:any = this.sectionList.find((section: any) => section.sectionId === this.currentSection.sectionId);
                const updatedTickets:Ticket[] = sectionToUpdate.tickets.filter((ticket: any) => ticket.ticketId !== this.ticketToDelete.ticketId);
                sectionToUpdate.tickets = updatedTickets;
                this.showMessage('Ticket has been deleted successfully.');
                this.isDeleteModal.close();
            },
            error: (err) => {
                console.error('Error deleting Ticket:', err);
            },
        });
    }
    deleteTask() {
        this.taskService.deleteTask(this.taskToDelete.taskId).subscribe({
            next: () => {
                this.TasksList=this.TasksList.filter((task:Task) => task.taskId !== this.taskToDelete.taskId);
                const ticket:any = this.sectionList.find((section: any) => section.sectionId === this.currentSection.sectionId)
                ?.tickets.find((ticket:any) => ticket.ticketId === this.paramsTicket.ticketId);
                
                ticket.progress = this.calculateProgress(this.TasksList);
                this.showMessage('Task has been deleted successfully.');
                this.isDeleteTaskModal.close();
            },
            error: (err) => {
                console.error('Error deleting Task:', err);
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
    filteredTasks: any = [];
    calculateProgress(tasks:Task[]){
        if (tasks.length === 0) {
            return 0;
        }
        const doneTasksCount = tasks.filter(task => task.done).length;
        const progressPercentage = (doneTasksCount / tasks.length) * 100;
        return progressPercentage;

    }
    taskComplete(task: Task) {
        if (task) {
            task.done = !task.done;
            this.taskService.updateTask(task.taskId, task).subscribe(
                (response) => {
                    console.log('task updated successfully:', response);
                    let EditedTask:any = this.TasksList.find((task1:Task) => task1.taskId === task.taskId);
                    EditedTask.done = task.done;
                    const ticket:any = this.sectionList.find((section: any) => section.sectionId === this.currentSection.sectionId)
                    ?.tickets.find((ticket:any) => ticket.ticketId === this.paramsTicket.ticketId);
                    
                    ticket.progress = this.calculateProgress(this.TasksList);

                },
                (error) => {
                    console.error('Error updating task:', error);
                }
            );
        }
    }

      
    currentTicketToDrag!:any;
    
    onDragStart(ticketId: number){
        this.currentTicketToDrag=ticketId;
    }

    onDrop(event: any,sectionId:number){
        event.preventDefault();
        this.ticketService.updateTickectSection(this.currentTicketToDrag, sectionId)
          .subscribe({
            next: () => {
                this.getBoardById();
                this.showMessage('Ticket updated successfully.');
            },
            error: (err) => {
                console.error('Error draging Ticket:', err);
            },
        });
        this.currentTicketToDrag=null;
    }

    onDragOver(event: any){
        event.preventDefault();
    }

    setDiscriptionText(event: any) {
        this.paramsTicket.description = event.text;
        this.paramsTicket.descriptionContent = event.html;
        console.log(this.paramsTicket);
        
    }

    changeSelectedSprint(sprint: any){
        this.selectedSprint = sprint
    }

    usersList!:UserResponse[];

    getUsers(): void {
        this.userService.getUsers().subscribe((data: UserResponse[]) => {
            this.usersList = data;
            console.log(data);
        });
    }

    isDropdownOpen: boolean = false;

    closeDropdown() {
        this.isDropdownOpen = false;
    }



    users!:UserResponse[];
    filtredUsers: any = [];
    ticketPriorities = TicketPriority;


    selectUser(ticketId: any, userId: number,user:any){
        this.ticketService.addUserInTicket(ticketId, userId).subscribe(
            (response) => {
               this.filtredUsers.push(user);
               this.sectionList.find(s => s.sectionId === this.params.sectionId)?.tickets.find(t => t.ticketId === this.paramsTicket.ticketId)?.users.push(user);                
            },
            (error) => {
                console.error('Error selecting user:', error);
            }
        );
        this.closeDropdown();

       
    }

    userExistsInMembers(userId: any): boolean {
        return this.users.some(member => member.userId.toString() === userId.toString());

    }
    


   
    removeUserInTicket(ticketId: any, userId: any, user: any) {
        console.log(userId);
        this.ticketService.removeUserFromTicket(ticketId, userId).subscribe(
            (next) => {

                this.filtredUsers = this.filtredUsers.filter((filteredUser: UserResponse) => filteredUser.userId !== userId);
                console.log(this.filtredUsers);
                const ticket = this.sectionList.find(s => s.sectionId === this.params.sectionId)?.tickets.find(t => t.ticketId === this.paramsTicket.ticketId);
            if (ticket) {
                ticket.users = ticket.users.filter((u: any) => u.userId !== userId);
            }

            },
            (error) => {
                console.error('Error removing user from ticket:', error);
            }
        );
    }

    getEnumValues(enumObj: any): string[] {
        return Object.values(enumObj).filter(value => typeof value === 'string') as string[];
    }




}

