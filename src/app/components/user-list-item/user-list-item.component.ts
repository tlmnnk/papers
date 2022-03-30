import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { User } from 'src/app/models/user';
import { setModal } from 'src/app/store/auth.repository';
import { environment } from 'src/environments/environment';
import { UserModalComponent } from '../user-modal/user-modal.component';

@Component({
  selector: 'app-user-list-item',
  templateUrl: './user-list-item.component.html',
  styleUrls: ['./user-list-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserListItemComponent implements OnInit {

  @Input() user: User | undefined = undefined;

  readonly SERVER_URL = environment.baseUrl;

  get imageUrl(): string {
    return this.SERVER_URL + this.user?.avatar;
  }

  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(UserModalComponent, {
      data: {
        ...this.user,
      },
      height: '100%',
      maxHeight: '573px'
    });

    setModal(true);

    dialogRef.afterClosed().subscribe(() => setModal(false));
  }
}
