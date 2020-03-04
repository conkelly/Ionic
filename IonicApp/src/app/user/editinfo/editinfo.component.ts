import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import{ UserService } from '../../shared/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-editinfo',
  templateUrl: './editinfo.component.html',
  styleUrls: ['./editinfo.component.scss']
})

export class EditinfoComponent implements OnInit {
    EditinfoForm: FormGroup;
    forbiddenEmails: any;
    errorMessage: string;
    successMessage: string;
    IsvalidForm = true;

  constructor(public userservice: UserService, private router: Router) { }
  
    ngOnInit() {
      this.EditinfoForm = new FormGroup({
        'email': new FormControl(null, [Validators.required, Validators.email], this.forbiddenEmails),
      });
    }
  
    RequestResetUser(form) {
      console.log(form)
      if (form.valid) {
        this.IsvalidForm = true;
        this.userservice.requestReset(this.EditinfoForm.value).subscribe(
          data => {
            this.EditinfoForm.reset();
            this.successMessage = "Reset password link sent to email sucessfully.";
            setTimeout(() => {
              this.successMessage = null;
              this.router.navigate(['login']);
            }, 3000);
          },
          err => {
  
            if (err.error.message) {
              this.errorMessage = err.error.message;
            }
          }
        );
      } else {
        this.IsvalidForm = false;
      }
    }
  };