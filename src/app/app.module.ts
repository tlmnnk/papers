import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthComponent } from './pages/auth/auth.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthFormComponent } from './components/auth-form/auth-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { UsersComponent } from './pages/users/users.component';
import { MatTabsModule } from '@angular/material/tabs';
import { UserListItemComponent } from './components/user-list-item/user-list-item.component';
import { MatMenuModule } from '@angular/material/menu';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenHttpInterceptor } from './services/token.interceptor';
import { MatDialogModule } from '@angular/material/dialog';
import { UserModalComponent } from './components/user-modal/user-modal.component';
import { MatSelectModule } from '@angular/material/select';
import { ToastComponent } from './components/toast/toast.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BalancePipe } from './pipes/balance.pipe';
import { TimeAgoPipe } from './pipes/time-ago.pipe';
import { LoaderComponent } from './components/loader/loader.component';

@NgModule({
  declarations: [
    AppComponent,
    AuthComponent,
    AuthFormComponent,
    UsersComponent,
    UserListItemComponent,
    UserModalComponent,
    ToastComponent,
    BalancePipe,
    TimeAgoPipe,
    LoaderComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatTabsModule,
    MatMenuModule,
    HttpClientModule,
    MatDialogModule,
    MatSelectModule,
    MatSnackBarModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenHttpInterceptor,
      multi: true
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
