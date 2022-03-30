import { HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, combineLatest, concatMap, delay, EMPTY, EmptyError, interval, merge, Observable, retryWhen, switchMap, takeWhile, tap, timeout, timer } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User, UserUpdate } from '../models/user';
import { setToken } from '../store/auth.repository';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ToastComponent } from '../components/toast/toast.component';
import { setUsers, trackUsersRequestsStatus } from '../store/user.repository';

export interface ResponseWithMessage {
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl= '';
  private headers: HttpHeaders = new HttpHeaders({
    'Content-Type': 'application/json'
  });


  constructor(private http: HttpClient, private snackBar: MatSnackBar) {
    this.baseUrl = environment.baseUrl;
  }

  auth(login: string, password: string): Observable<HttpResponse<unknown>> {
    return this.http.post<HttpResponse<unknown>>(`${this.baseUrl}/auth`, {
      login, password
    }, { observe: 'response' }).pipe(
      tap((res) => {
        const token = res.headers.get('Authorization');
        setToken(token);
      }),
      catchError((error: HttpErrorResponse) => {
        this.openToast(error.error.message);
        return EMPTY;
      })
    );
  }

  getUsers(status: string = ''): Observable<User[]|ResponseWithMessage> {
    return this.http.get<User[]|ResponseWithMessage>(`${this.baseUrl}/users${status}`, {
      headers: this.headers
    }).pipe(
      tap((res) => {
        if (res instanceof Array) {
          setUsers(res);
        }
      }),
    );
  }

  editUser(id: number, user: UserUpdate): Observable<HttpResponse<unknown>> {
    return this.http.patch<HttpResponse<unknown>>(`${this.baseUrl}/users/${id}`, {
      ...user
    }, {
      headers: this.headers
    }).pipe(
      catchError((error: HttpErrorResponse) => {
        this.openToast(error.message);
        return EMPTY;
      })
    );
  }

  getUsersWithRetry(): Observable<unknown> {
    return this.getUsers().pipe(
      trackUsersRequestsStatus('users'),
      timeout(5000),
      retryWhen((error) => {
        return error.pipe(
          takeWhile((error) => {
            if (error?.status) {
              this.openToast(error?.error?.message);
              return false;
            }
            this.openToast('Таймаут получения ползователя. Повторяю запрос...');
            return true;
        }),
        delay(5000)
      );
      })
    );
  }

  openToast(message: string): void {
    this.snackBar.openFromComponent(ToastComponent, {
      verticalPosition: 'top',
      horizontalPosition: 'right',
      duration: 3000,
      data: message
    });
  }
}
