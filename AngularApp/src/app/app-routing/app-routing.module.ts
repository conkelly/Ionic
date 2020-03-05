    import { NgModule } from '@angular/core';
    import { RouterModule, Routes } from '@angular/router';
    import { UserComponent } from '../user/user.component';
    import { SignUpComponent} from '../user/sign-up/sign-up.component';
    import { EmployeeComponent } from '../employee/employee.component';
    import { SignInComponent } from '../user/sign-in/sign-in.component';
    import{ AuthGuard } from '../../../helpers/auth.guard';
    import{ EditinfoComponent } from '../user/editinfo/editinfo.component';
    import{ ResetinfoComponent} from '../user/resetinfo/resetinfo.component'; 


    const routes: Routes = [
        {
            path: 'signup',
            component: UserComponent,
            children: [{path: '', component: SignUpComponent}]
        },
        {
            path: 'login',
            component: UserComponent,
            children: [{path: '', component: SignInComponent}]
        },
        {
            path: 'forgot',
            component: UserComponent,
            children: [{path: '', component: EditinfoComponent}]
        },
        {
            path: 'reset',
            component: ResetinfoComponent
        },
        {
            path: 'reset/:token',
            component: ResetinfoComponent
        },
        {
            path: '',redirectTo: 'login', pathMatch: 'full'
        },
        { 
          path: 'companies', 
          component: EmployeeComponent,
          canActivate: [AuthGuard] 
        },
       
    ];

    @NgModule({
        imports: [
            RouterModule.forRoot(routes)
        ],
        exports: [
            RouterModule
        ],
        declarations: []
    })
    export class AppRoutingModule { }
