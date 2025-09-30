import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { LeaveApplyComponent } from './pages/leave-apply/leave-apply';
import { Login } from './pages/login/login';
import { DashboardComponent } from './pages/dashboard/dashboard';

export const routes: Routes = [
    
    { path: '', component: Home },
    { path: 'LeaveApply', component: LeaveApplyComponent },
    { path: 'Login', component: Login },
    { path: 'dashboard', component: DashboardComponent }


    
    
    
    
  //  { path: 'about', component: AboutComponent }
  // 
  
];
