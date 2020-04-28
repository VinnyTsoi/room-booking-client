import { Injectable, EventEmitter } from '@angular/core';
import { Room } from '../model/Room';
import { User } from '../model/User';

@Injectable({
  providedIn: 'root'
})
export class FormResetService {

  addRoomEventEmitter = new EventEmitter<Room>();

  addUserEventEmitter = new EventEmitter<User>();

  constructor() { }

}
