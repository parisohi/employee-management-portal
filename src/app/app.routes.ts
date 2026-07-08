import { Routes } from '@angular/router';
import { Login } from './features/auth/login/login';
import { EmployeeList } from './features/employee/employee-list/employee-list';
import { EmployeeForm } from './features/employee/employee-form/employee-form';
import { MedicalDetails } from './features/medical/medical-details/medical-details';
import { Charts } from './features/charts/charts/charts';
import { Settings } from './features/settings/settings/settings';
import { MedicalForm } from './features/medical/medical-form/medical-form';
import { NotFound } from './features/not-found/not-found';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'employees',
        pathMatch: 'full'
    },
    {
        path: 'login',
        component: Login
    },
    {
        path: 'employees',
        component: EmployeeList
    },
    {
        path: 'add-employees',
        component: EmployeeForm
    },
    {
        path: 'medical',
        component: MedicalDetails
    },
    {
        path: 'charts',
        component: Charts
    },
    {
        path: 'edit-employee/:id',
        component: EmployeeForm
    },
    {
        path: 'settings',
        component: Settings
    },
    {
        path: 'add-medical',
        component: MedicalForm
    },
    {
        path: 'add-medical',
        component: MedicalForm
    },
    {
        path: 'edit-medical/:id',
        component: MedicalForm
    },
    {
        path: '**',
        component: NotFound
    }
];
