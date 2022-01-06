import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { faEdit, faTrash, faPlus } from '@fortawesome/free-solid-svg-icons';
import { ContactService } from '../services/contact.service';
import { ApiCallResponse } from '../types/common';
import { Customer } from '../types/customer';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ContactModalComponent } from './contact-modal/contact-modal.component';
import { NotifierService } from 'angular-notifier';
import { ConfirmModalComponent } from './confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-contact-list',
  templateUrl: './contact-list.component.html',
  styleUrls: ['./contact-list.component.scss'],
})
export class ContactListComponent implements OnInit {
  private _unsubscribeAll: Subject<any>;
  customers: Customer[] = [];
  faEdit = faEdit;
  faTrash = faTrash;
  faPlus = faPlus;
  modalRef?: BsModalRef;
  searchTerm: string = '';

  constructor(
    private _contact: ContactService, 
    private _modal: BsModalService,
    private _notifier: NotifierService,) {
    this._unsubscribeAll = new Subject();
  }

  ngOnInit(): void {
    this.getAllContacts();
  }

  openEditModal(data: Customer) {
    const initialState = {
      isEditing: true,
      id: data.id
    }
    this.modalRef = this._modal.show(ContactModalComponent, { initialState });
    this.modalRef.onHidden.subscribe((reason: string) => {
      const { firstName, lastName, dob, address, city, state, phone } = this.modalRef?.content?.form.getRawValue();
      // call endpoint only when user clicks on submit button
      if (reason === 'submit') {
        const payload = {
          customer: {
            firstName,
            lastName,
            dob
          },
          contact: {
            id: data.contact?.id,
            address,
            city,
            state,
            phone
          }
        }
        this._contact.update(payload, data.id)
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe({
          next: (data: ApiCallResponse) => {
            if (data.success) {
              this._notifier.notify('success', data.message);
              this.getAllContacts();
            } else {
              this._notifier.notify('error', data.message);
            }
          },
          error: (err) => {
            console.log(err);
            this._notifier.notify('error', err.message);
          }
        })
      }
    })
  }

  openAddModal() {
    const initialState = {
      isEditing: false,
      id: -1
    }
    this.modalRef = this._modal.show(ContactModalComponent, { initialState });
    this.modalRef.onHidden.subscribe((reason: string) => {
      // call endpoint only when user clicks on submit button
      if (reason === 'submit') {
        console.log(this.modalRef?.content);
        const { firstName, lastName, dob, address, city, state, phone } = this.modalRef?.content?.form.getRawValue();
        this._contact.add({ firstName, lastName, dob, address, city, state, phone })
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe({
          next: (res: ApiCallResponse) => {
            if (res.success) {
              this._notifier.notify('success', res.message);
              this.getAllContacts();
            } else {
              this._notifier.notify('error', res.message);
            }
          },
          error: (err) => {
            this._notifier.notify('error', err.message);
          }
        })
      }
    })
  }

  openConfirmModal(data: Customer) {
    this.modalRef = this._modal.show(ConfirmModalComponent);
    this.modalRef.onHidden.subscribe((reason: string) => {
      if (reason === 'confirm') {
        this._contact.delete(data.id)
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe({
          next: (res: ApiCallResponse) => {
            if (res.success) {
              this._notifier.notify('success', res.message);
              this.getAllContacts();
            } else {
              this._notifier.notify('error', res.message);
            }
          },
          error: (err) => {
            this._notifier.notify('error', err.message);
          }
        })
      }
    })

  }

  ngOnDestroy(): void
  {
      // Unsubscribe from all subscriptions
      this._unsubscribeAll.next(null);
      this._unsubscribeAll.complete();
  }

  getAllContacts() {
    this._contact.getAll()
    .pipe(takeUntil(this._unsubscribeAll))
    .subscribe({
      next: (data: ApiCallResponse) => {
        this.customers = data.data || []
      },
      error: (err) => {
        this.customers = [];
      }
    }
    )
  }

  filterData() {
    return this.customers.filter(c => c.firstName.includes(this.searchTerm) || c.lastName.includes(this.searchTerm));
  }
}


