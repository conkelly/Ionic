import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app-routing/app-routing.module';
import { AppComponent } from './app.component';
import { EmployeeComponent } from './employee/employee.component';
import { SignUpComponent } from './user/sign-up/sign-up.component';
import { UserComponent } from './user/user.component';
import { SignInComponent } from './user/sign-in/sign-in.component';
import { UserService } from './shared/user.service'
import {AuthGuard} from '../../helpers/auth.guard';
import { EditinfoComponent } from './user/editinfo/editinfo.component';
import { ResetinfoComponent } from './user/resetinfo/resetinfo.component';
import { AuthInterceptor } from './shared/auth.interceptor';

@NgModule({
  declarations: [
    AppComponent,
    EmployeeComponent,
    SignUpComponent,
    UserComponent,
    SignInComponent,
    EditinfoComponent,
    ResetinfoComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    RouterModule, 
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [ { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
    AuthGuard, UserService],
  bootstrap: [AppComponent]
})
export class AppModule { }
