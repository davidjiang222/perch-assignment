import { Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Customer } from 'src/app/types/customer';
import { ContactService } from 'src/app/services/contact.service';
import { Subject, takeUntil } from 'rxjs';
import { ApiCallResponse } from 'src/app/types/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-contact-modal',
  templateUrl: './contact-modal.component.html',
  styleUrls: ['./contact-modal.component.scss']
})
export class ContactModalComponent implements OnInit {
  isEditing: boolean = false;
  id!: number;
  customer!: Customer;
  form!: FormGroup;
  private _unsubscribeAll: Subject<any>;
  
  constructor(
    public modalRef: BsModalRef, 
    private _contact: ContactService, 
    private _formBuilder: FormBuilder,
    private _modal: BsModalService) {
    this._unsubscribeAll = new Subject();
  }

  ngOnInit(): void {
    if (this.isEditing && this.id) {
      this.getContactDetail();
    } else {
      this.initialzeForm();
    }
  }

  ngOnDestroy(): void
  {
      // Unsubscribe from all subscriptions
      this._unsubscribeAll.next(null);
      this._unsubscribeAll.complete();
  }

  getContactDetail() {
    this._contact.get(this.id)
    .pipe(takeUntil(this._unsubscribeAll))
    .subscribe({
      next: (data: ApiCallResponse) => {
        if (data.success) {
          this.initialzeForm(data.data)
          this.customer = data.data;
        } else {
          this.initialzeForm();
        }
      },
      error: (err) => {
        console.log(err);
        this.initialzeForm();
      }
    })
  }

  initialzeForm(data?: Customer) {
    this.form = this._formBuilder.group({
      firstName: [data?.firstName || '', [Validators.required]],
      lastName: [data?.lastName || '', [Validators.required]],
      dob: [data?.dob || ''],
      address: [data?.contact?.address || ''],
      city: [data?.contact?.city || ''],
      state: [data?.contact?.state || ''],
      phone: [data?.contact?.phone || '', [Validators.required]],
    })
  }

  submit() {
    if (this.form.valid) {
      this._modal.setDismissReason('submit');
      this.modalRef.hide();
    }
  }
}
