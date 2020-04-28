import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Room, Layout, LayoutCapacity } from 'src/app/model/Room';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DataService } from 'src/app/data.service';
import { Router } from '@angular/router';
import { FormResetService } from 'src/app/service/form-reset.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-room-edit',
  templateUrl: './room-edit.component.html',
  styleUrls: ['./room-edit.component.css']
})
export class RoomEditComponent implements OnInit, OnDestroy {

  @Input()
  room: Room;

  layouts = Object.keys(Layout);
  layoutEnum = Layout;

  // roomForm = new FormGroup(
  //   {
  //     roomName: new FormControl('roomName'),
  //     location: new FormControl('location')
  //   }
  // );

  roomForm: FormGroup;
  formResetServiceSubscription: Subscription;

  constructor(
    private formBuilder: FormBuilder,
    private dataService: DataService,
    private router: Router,
    private formResetService: FormResetService) { }

  ngOnDestroy(): void {
    this.formResetServiceSubscription.unsubscribe();
  }

  ngOnInit() {
    this.initialiseForm();
    this.formResetServiceSubscription = this.formResetService.addRoomEventEmitter.subscribe(
      (room) => {
        this.room = room;
        this.initialiseForm();
      }
    );
  }

  initialiseForm() {
    this.roomForm = this.formBuilder.group({
      roomName: [this.room.name, Validators.required],
      location: [this.room.location, [Validators.required, Validators.minLength(2)]]
    });

    for (const layout of this.layouts) {
      const layoutCapacity = this.room.capacities.find(
        lc => lc.layout === Layout[layout]
      );


      const initialCapacity = layoutCapacity == null ? 0 : layoutCapacity.capacity
      this.roomForm.addControl(`layout${layout}`, this.formBuilder.control(initialCapacity));
    }
    // this.roomForm.patchValue({
    //   roomName: this.room.name,
    //   location: this.room.location
    // })
    // for (const layout of this.layouts) {
    //   this.roomForm.addControl(`layout${layout}`, new FormControl(`layout${layout}`));
    // }
  }


  onSubmit() {
    this.room.name = this.roomForm.controls['roomName'].value;
    this.room.location = this.roomForm.value['location'];
    this.room.capacities = new Array<LayoutCapacity>();

    for (const layout of this.layouts) {
      const layoutCapacity = new LayoutCapacity();
      layoutCapacity.layout = Layout[layout];
      layoutCapacity.capacity = this.roomForm.controls[`layout${layout}`].value;
      this.room.capacities.push(layoutCapacity);
    }

    if (this.room.id == null) {
      this.dataService.addRoom(this.room).subscribe(
        (rm) => this.router.navigate(
          ['admin', 'rooms'],{queryParams: {id: rm.id, action: 'view'}}
        )
      );
    } else {
      this.dataService.updateRoom(this.room).subscribe(
        (room) => this.router.navigate(
          ['admin', 'rooms'],{queryParams: {id: room.id, action: 'view'}}
        )
      );
    }

  }

}
