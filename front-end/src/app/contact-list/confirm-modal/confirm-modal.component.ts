import { Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-confirm-modal',
  templateUrl: './confirm-modal.component.html',
  styleUrls: ['./confirm-modal.component.scss']
})
export class ConfirmModalComponent implements OnInit {

  constructor(
    private _modal: BsModalService,
    public modalRef: BsModalRef) { }

  ngOnInit(): void {
  }

  confirm() {
    this._modal.setDismissReason('confirm');
    this.modalRef.hide();
  }

  decline() {
    this._modal.setDismissReason('cancel');
    this.modalRef.hide();
  }
}
