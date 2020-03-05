import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UserService } from '../shared/user.service';
import { EmployeeService } from '../shared/employee.service';
import { Employee } from '../shared/employee.model';
import { Router } from "@angular/router";

declare var M: any;

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css'],
  providers: [EmployeeService]
})

export class EmployeeComponent implements OnInit {  
serverErrorMessages: string;

emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
phoneRegex = /\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/;
websiteRegex = /^[a-zA-Z0-9\-\.]+\.(com|org|net|mil|edu|COM|ORG|NET|MIL|EDU)$/;
zipRegex = /^\d{5}$/;

  constructor(public employeeService: EmployeeService, public userService: UserService,  public router: Router) {
    console.log(localStorage.getItem('ID'));
    //this.employeeService.selectedEmployee.user = localStorage.getItem('ID'); 

   }

  onLogout(){
    this.userService.deleteToken();
    this.router.navigate(['/login']);
    localStorage.setItem('ID','');
  }

  ngOnInit() {
    this.resetForm();
    this.refreshEmployeeList();
   // console.log(localStorage.getItem('ID'));
  }

  resetForm(form?: NgForm) {
    this.employeeService.selectedEmployee = {
      _id: "",
      address: "",
      companyname: "",
      zipcode: "",
      email: "",
      phone: "",
      website: "",
      description: "",
      user: "", //localStorage.getItem('ID'),
    }
    if (form)
      form.reset();
    this.serverErrorMessages = '';
  }

  onSubmit(form: NgForm) {
    if (form.value._id == "" || form.value._id === null) {
      form.value.user = localStorage.getItem('ID');
      
      this.employeeService.postEmployee(form.value).subscribe(res => {
        this.resetForm(form);
        this.refreshEmployeeList();
        M.toast({ html: 'Saved successfully', classes: 'rounded' });
      
    },
    err => {
      if (err.status === 422){
        this.serverErrorMessages = err.error.join('<br/>');
      } else 
      this.serverErrorMessages = "Something went wrong. Please contact admin.";
    })} else {
      this.employeeService.putEmployee(form.value).subscribe((res) => {
        this.resetForm(form);
        this.refreshEmployeeList();
        M.toast({ html: 'Updated successfully', classes: 'rounded' });});}}

  refreshEmployeeList() {
    this.employeeService.getEmployeeList(localStorage.getItem('ID')).subscribe((res) => {
      this.employeeService.employees = res as Employee[];
      //console.log(res.find(user => user, user === localStorage.getItem('ID')))
    });}

  onEdit(emp: Employee) {
    this.employeeService.selectedEmployee = emp;
  }

  onDelete(_id: string, form: NgForm) {
    if (confirm('Are you sure to delete this record ?') == true) {
      this.employeeService.deleteEmployee(_id).subscribe((res) => {
        this.refreshEmployeeList();
        this.resetForm(form);
        M.toast({ html: 'Deleted successfully', classes: 'rounded' });});}}}