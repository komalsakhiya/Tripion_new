import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
import { AppComponent } from '../app.component';
declare const $: any;
class Port {
  public id: number;
  public name: string;
}

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit {
  ports: Port[];
  port: Port;
  signUpForm: FormGroup;
  submitted: boolean = false;
  isDisable: Boolean = false;
  loading: Boolean = false;
  counries: any = [];
  selectedCountry: any;
  passwordType: string = 'password';
  passwordIcon: string = 'eye-off';

  constructor(
    public _userService: UserService,
    public router: Router,
    public appComponent: AppComponent,
  ) {
    this.signUpForm = new FormGroup({
      first_name: new FormControl('', [Validators.required]),
      last_name: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      phone_number: new FormControl('', [Validators.required, Validators.pattern(/^(\+\d{1,3}[- ]?)?\d{10}$/)]),
      password: new FormControl('', [Validators.required]),
      username: new FormControl('', [Validators.required]),
      // dob: new FormControl('', [Validators.required]),
      // home_town: new FormControl('', [Validators.required])
    });
  }

  ngOnInit() {
    $(document).ready(function () {
      $('#myselection').select2({
        placeholder: "Select Timezone",
      });
    });

    $('#myselection').on('select2:select', (e) => {
      console.log(e.params.data.id)
      this.signUpForm.controls.home_town.setValue(e.params.data.id);
      console.log("data", this.signUpForm.value);
    });
  }

  get f() { return this.signUpForm.controls; }

   /**
   * Show hide password
   */
  showHide() {
    this.passwordType = this.passwordType === 'text' ? 'password' : 'text';
    this.passwordIcon = this.passwordIcon === 'eye-off' ? 'eye' : 'eye-off';
  }


  /**
   * Register User
   * @param {Object} data 
   */
  signUpUser(data) {
    this.submitted = true;

    console.log(data);
    if (this.signUpForm.invalid) {
      return;
    }

    console.log("data", data)
    this.isDisable = true;
    this.loading = true;
    this._userService.signUpUser(data).subscribe((res: any) => {
      console.log("register user", res);
      this.isDisable = false;
      this.loading = false;
      this._userService.sendDeviceToken().subscribe((response: any) => {
        console.log("res of devicedata in login", response);
      }, err => {
        console.log("errr", err);
      })
      this.appComponent.sucessAlert("Registration Completed")
      this.router.navigate(['/home']);
    }, (err) => {
      this.isDisable = false;
      this.loading = false;
      this.appComponent.errorAlert(err.error.message);
      console.log("err in register", err)
    })
  }

}
