import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { TripService } from '../../services/trip.service';
import { ToastService } from '../../services/toast.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-passport-inquiry',
  templateUrl: './passport-inquiry.component.html',
  styleUrls: ['./passport-inquiry.component.scss'],
})
export class PassportInquiryComponent implements OnInit {
  currentUser = JSON.parse(localStorage.getItem('currentUser'));
  categoryList = JSON.parse(localStorage.getItem('categoryList'));
  passportInquiryForm: FormGroup;
  submitted: Boolean = false;
  formUrl: any = [];
  selectedFormCategory = JSON.parse(localStorage.getItem('selectedFormCategory'));
  constructor(
    public _tripService: TripService,
    public route: Router,
    public _toastService: ToastService
  ) {
    this.passportInquiryForm = new FormGroup({
      passportInquiryType: new FormControl('New Passport'),
      // firstName: new FormControl('', [Validators.required]),
      // lastName: new FormControl('', [Validators.required]),
      // dob: new FormControl('', [Validators.required]),
      // address: new FormControl('', [Validators.required]),
      // city: new FormControl('', [Validators.required])
    })
  }

  ngOnInit() {
    this.formUrl = JSON.parse(localStorage.getItem('formId'));
    this.formUrl.splice(0, 1);
    console.log("form url", this.formUrl);

    localStorage.setItem('formId', JSON.stringify(this.formUrl));

    console.log("caegory list", this.categoryList);

  }

  get f() { return this.passportInquiryForm.controls }

  /**
  * get next form
  * @param {Object} data 
  */
  nextForm(data) {
    console.log("data in next forrm", data)
    this.submitted = true;

    // data.dob = data.dob.split("T");
    // const fd = data.dob[1].split('.')
    // data.dob = data.dob[0] + ' ' + fd[0];


    if (this.passportInquiryForm.invalid) {
      return
    }
    const obj = {
      email: this.currentUser.email,
      id: this.currentUser.id,
      form_data: JSON.stringify(data),
      form_category: this.selectedFormCategory.toString(),
    }
    console.log("object", obj)
    this._tripService.addPassportForm(obj).subscribe((res: any) => {
      console.log("passport res", res);
      this._toastService.presentToast(res.message, 'success')
      if (this.formUrl.length) {
        this.route.navigate(['/home/' + this.formUrl[0]])
      } else {
        this.route.navigate(['/home']);

      }
    }, err => {
      console.log("err", err);
      this._toastService.presentToast(err.error.message, 'danger')
    })
    // this.storeFormData(data);

  }

  // Store form data
  storeFormData(data) {
    console.log("data", data)
    const obj = {
      "passport-inquiry": data
    }
    this._tripService.storeFormData(obj);
  }
}
