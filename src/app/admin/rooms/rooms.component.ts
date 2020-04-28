import { Component, OnInit } from '@angular/core';
import {DataService} from '../../data.service';
import {Room} from '../../model/Room';
import {ActivatedRoute, Router} from '@angular/router';
import { FormResetService } from 'src/app/service/form-reset.service';

@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.css']
})
export class RoomsComponent implements OnInit {

  rooms: Array<Room>;
  selectedRoom: Room;
  action: string;

  constructor(private dataService: DataService,
              private activatedRoute: ActivatedRoute,
              private router: Router,
              private formResetService: FormResetService) { }

  ngOnInit() {
    this.dataService.getRooms().subscribe(
      (next) => {
        this.rooms = next;
      }
    );

    this.activatedRoute.queryParams.subscribe(
      (params) => {
        const id = params['id'];
        if (id) {
          this.selectedRoom = this.rooms.find( room => room.id === +id);
          this.action = params['action'];
        }
        if (params['action'] === 'add') {
          this.selectedRoom = new Room();
          this.action = 'edit';
          this.formResetService.addRoomEventEmitter.emit(this.selectedRoom);
        }
        if (!params['action']) {
          this.action = null;
        }
      }
    );
  }

  setRoom(id: number) {
    this.router.navigate(['admin','rooms'], {queryParams : {id, action : 'view'} });
  }

  addRoom() {
    this.router.navigate(['admin','rooms'], {queryParams: {action : 'add'}});
  }

}
