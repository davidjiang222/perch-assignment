import { Injectable } from '@angular/core';
import { CommonService } from './common.service';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  
  constructor(private _common: CommonService) { }
  
  getAll() {
    return this._common.getWithoutToken('contacts');
  }

  get(id: number) {
    return this._common.getWithoutToken(`contacts/${id}`);
  }

  add(data: any) {
    return this._common.postWithoutToken('contacts', data);
  }

  update(data: any, id: number) {
    return this._common.putWithoutToken(`contacts/${id}`, data);
  }

  delete(id: number) {
    return this._common.deleteWithoutToken(`contacts/${id}`);
  }
}
