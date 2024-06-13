import { animate, style, transition, trigger } from '@angular/animations';
import { Component, Input } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { Board } from '../jitPilot/models/board';
import { workspace } from '../jitPilot/models/workspace';
import { BoardService } from '../jitPilot/services/board.service';
import { WorkspaceService } from '../jitPilot/services/workspace.service';
import { AppService } from '../service/app.service';
import { slideDownUp } from '../shared/animations';

@Component({
    moduleId: module.id,
    selector: 'sidebar',
    templateUrl: './sidebar.html',
    animations: [slideDownUp],
})
export class SidebarComponent {
    @Input() item = '';
    active = false;
    store: any;
    workspaceId!:any
    workspace!: workspace;
    activeDropdown: string[] = [];
    parentDropdown: string = '';
    userBoardList!:Board[];
    workspaceName!:String;
    constructor(
        public translate: TranslateService, 
        public storeData: Store<any>, 
        public router: Router,
        private route: ActivatedRoute,
        private workspaceService:WorkspaceService,
        private boardService:BoardService,
        private appService:AppService
        ) {
        this.initStore();
    }
    async initStore() {
        this.storeData
            .select((d) => d.index)
            .subscribe((d) => {
                this.store = d;
            });
    }
    isJitPilotWorkspacesRoute(): boolean {
        return this.router.url === '/';
      }

    ngOnInit() {
         this.route.params.subscribe(params => {
             this.workspaceId = params['workspaceId'];     
             console.log(params);
                    
           });
        this.setActiveDropdown();

            this.workspace=JSON.parse(sessionStorage.getItem("workspaceItem")!);
            console.log(this.workspace);
            console.log(this.workspace.name.slice(0,17));

            this.workspaceName = this.workspace.name.length <= 17? this.workspace.name : this.workspace.name.slice(0,17)+'...';
            


            this.getBoardsByWorkspaceAndUser();


        // this.appService.currentWorspace.subscribe(workspacef =>
        //     {
        //         this.workspace = workspacef
        //         console.log(this.workspace);
                
        //     }
        //     ); 

        
        
        
        
    }
    initWorkspace(){ 
        this.workspaceService.getWorkspaceById(this.workspaceId).subscribe((data) =>{
            this.workspace = data;
        });
    }
    getBoardsByWorkspaceAndUser(){
        this.boardService.getBoardsByWorkspaceAndUser(this.workspace.workspaceId, 1).subscribe(
            (response) => {
                this.userBoardList = response;
            },
            (error) => {
                console.error('Error fetching task:', error);
            }
        );
    }
    setActiveDropdown() {
        const selector = document.querySelector('.sidebar ul a[routerLink="' + window.location.pathname + '"]');
        if (selector) {
            selector.classList.add('active');
            const ul: any = selector.closest('ul.sub-menu');
            if (ul) {
                let ele: any = ul.closest('li.menu').querySelectorAll('.nav-link') || [];
                if (ele.length) {
                    ele = ele[0];
                    setTimeout(() => {
                        ele.click();
                    });
                }
            }
        }
    }

    toggleMobileMenu() {
        if (window.innerWidth < 1024) {
            this.storeData.dispatch({ type: 'toggleSidebar' });
        }
    }
    viewBoard(boardId:number){
        this.router.navigate([`/jitPilot/${boardId}`]);
    }

    toggleAccordion(name: string, parent?: string) {
        if (this.activeDropdown.includes(name)) {
            this.activeDropdown = this.activeDropdown.filter((d) => d !== name);
        } else {
            this.activeDropdown.push(name);
        }
    }
}
