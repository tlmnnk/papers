import { HttpResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { interval, merge, skip, Subject, Subscription, switchMap, takeUntil, tap } from 'rxjs';
import { ApiService, ResponseWithMessage } from 'src/app/services/api.service';
import { modalOpened$ } from 'src/app/store/auth.repository';
import {  trackUsersRequestsStatus, users$, usersStatus$ } from 'src/app/store/user.repository';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UsersComponent implements OnInit, OnDestroy {

  users$ = users$;
  usersStatus$ = usersStatus$;
  modalOpened$ = modalOpened$;
  statusFilter = '';

  private readonly tabStatuses = [
    '',
    '?status=2',
    '?status=0'
  ];

  private destroyed$ = new Subject();
  private getUsersInterval$ = interval(5000).pipe(
    switchMap(() => this.api.getUsers(this.statusFilter)),
    takeUntil(this.destroyed$),
    );
  private getUsersSubscription$: Subscription | null = null; 

  constructor(private api: ApiService) { }

  ngOnInit(): void {
    this.api.getUsersWithRetry()
      .pipe(
        tap((res) => ('message' in (res as ResponseWithMessage)) && this.api.openToast((res as ResponseWithMessage).message)),
        takeUntil(this.destroyed$))
      .subscribe(() => this.getUsersSubscription$ = this.getUsersInterval$.subscribe()
      );
    this.modalStateChanged();
  }

  ngOnDestroy(): void {
      this.destroyed$.next(null);
      this.destroyed$.complete();
  }

  tabChange(evt: MatTabChangeEvent): void {
    this.statusFilter = this.tabStatuses[evt.index];
    this.getUsersSubscription$?.unsubscribe();

    this.getUsersSubscription$ = merge(
      this.api.getUsers(this.statusFilter).pipe(
        tap((res) => ('message' in (res as ResponseWithMessage)) && this.api.openToast((res as ResponseWithMessage).message)),
        trackUsersRequestsStatus('users')),
      this.getUsersInterval$
    ).subscribe();
  }

  modalStateChanged(): void {
    this.modalOpened$
      .pipe(skip(1), takeUntil(this.destroyed$))
      .subscribe((modalOpened) => {
        if (modalOpened) {
          this.getUsersSubscription$?.unsubscribe();
        } else {
          this.getUsersSubscription$ = merge(
            this.api.getUsers(this.statusFilter).pipe(trackUsersRequestsStatus('users')),
            this.getUsersInterval$
          ).subscribe();
        }
      });
  }
}
