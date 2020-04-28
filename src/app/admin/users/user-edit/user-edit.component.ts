import {Component, Input, OnInit, OnDestroy} from '@angular/core';
import {User} from '../../../model/User';
import {DataService} from '../../../data.service';
import {Router} from '@angular/router';
import { FormResetService } from 'src/app/service/form-reset.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css']
})
export class UserEditComponent implements OnInit, OnDestroy {

  @Input()
  user: User;

  formUser: User;

  message: string;

  password: string;
  password2: string;

  nameIsValid = false;
  passwordsAreValid = false;
  passwordsMatch = false;

  userSubscription: Subscription;

  constructor(private dataService: DataService,
              private router: Router,
              private formResetService: FormResetService) { }

  ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
  }

  ngOnInit() {
    this.initializeEditComponent();

    this.userSubscription = this.formResetService.addUserEventEmitter.subscribe(
      (newUser: User) => {
        this.user = newUser;
        this.initializeEditComponent();
      }
    );

  }

  private initializeEditComponent() {
    this.formUser = Object.assign({}, this.user);
    this.checkIfNameIsValid();
    this.checkIfPasswordsAreValid();
  }

  onSubmit() {
    if (this.formUser.id == null) {
      this.dataService.addUser(this.formUser, this.password).subscribe(
        (user) => {
          this.router.navigate(['admin', 'users'], {queryParams: {action: 'view', id: user.id}});
        }
      );
    } else {
      this.dataService.updateUser(this.formUser).subscribe(
        (user) => {
          this.router.navigate(['admin', 'users'], {queryParams: {action: 'view', id: user.id}});
        }
      );
    }
  }

  checkIfNameIsValid() {
    if (this.formUser.name) {
      this.nameIsValid = this.formUser.name.trim().length > 0;
    } else {
      this.nameIsValid = false;
    }
  }

  checkIfPasswordsAreValid() {
    if (this.formUser.id != null) {
      this.passwordsAreValid = true;
      this.passwordsMatch = true;
    } else {
      this.passwordsMatch = this.password === this.password2;
      if (this.password) {
        this.passwordsAreValid = this.password.trim().length > 0;
      } else {
        this.passwordsAreValid = false;
      }
    }
  }

}
