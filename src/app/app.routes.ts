import { Routes } from '@angular/router';
import { TrainsComponent } from './components/trains/trains.component';
import { CustomerRegisterFormComponent } from './components/customer-register-form/customer-register-form.component';
import { CustomerLoginFormComponent } from './components/customer-login-form/customer-login-form.component';
import { HomepageComponent } from './components/homepage/homepage.component';
import { AdminLoginFormComponent } from './components/admin-login-form/admin-login-form.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { CustomerDashboardComponent } from './components/customer-dashboard/customer-dashboard.component';

export const routes: Routes = [
    {
        path: '',
        component: HomepageComponent
        // redirectTo: 'master',
        // pathMatch: 'full',
    },
    {
        path: 'trains',
        component: TrainsComponent,
    },  
    {
        path: 'user/register',
        component: CustomerRegisterFormComponent,
    },
    {
        path: 'user/login',
        component: CustomerLoginFormComponent,
    },
    {
        path: 'admin/login',
        component: AdminLoginFormComponent,
    },
    {
        path: 'admin/dashboard',
        component: AdminDashboardComponent,
    },
    {
        path: 'user/dashboard',
        component: CustomerDashboardComponent,
    },
];
