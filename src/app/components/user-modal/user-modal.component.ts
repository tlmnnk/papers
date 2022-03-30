import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { User, UserUpdate } from 'src/app/models/user';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-user-modal',
  templateUrl: './user-modal.component.html',
  styleUrls: ['./user-modal.component.scss']
})
export class UserModalComponent implements OnInit {
  userForm = new FormGroup({
    name: new FormControl(null),
    fname: new FormControl(null),
    mname: new FormControl(null),
    status: new FormControl(null)
  });

  constructor(
    private dialogRef: MatDialogRef<UserModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: User,
    private api: ApiService
    ) { }

  ngOnInit(): void {
    this.userForm.setValue({
      name: this.data.name,
      fname: this.data.fname,
      mname: this.data.mname,
      status: this.data.status,
    })
  }

  save(): void {
    const updatedFormValues: UserUpdate = {};
    for (const control in this.userForm.controls) {
      const formControl = this.userForm.get(control);
      if (formControl?.dirty) {
        updatedFormValues[control as keyof UserUpdate] = formControl.value;
      }
    }

    this.api.editUser(this.data.id, updatedFormValues)
      .subscribe(() => this.dialogRef.close());
  }

  close(): void {
    this.dialogRef.close();
  }
}
