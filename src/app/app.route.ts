import { Routes } from '@angular/router';

// dashboard

// layouts


// pages
import { AppLayout } from './layouts/app-layout';
import { WorkspaceComponent } from './jitPilot/components/workspace/workspace.component';

export const routes: Routes = [
    {
        path: '',
        component: AppLayout,
        children: [
            // dashboard
            { path: '', component: WorkspaceComponent, title: 'JITECHPILOT - PROJECT MANAGER' },


            //apps
            { path: '', loadChildren: () => import('./jitPilot/jitPilot.module').then((d) => d.JitPilotModule) },

            // widgets

            // components

            // users
            { path: '', loadChildren: () => import('./users/user.module').then((d) => d.UsersModule) },

            // tables


            // pages
        ],
    },


];
