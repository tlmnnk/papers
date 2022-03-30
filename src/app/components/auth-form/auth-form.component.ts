import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { authStore } from 'src/app/store/auth.repository';

@Component({
  selector: 'app-auth-form',
  templateUrl: './auth-form.component.html',
  styleUrls: ['./auth-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AuthFormComponent implements OnInit {
  hide = true;
  authForm = new FormGroup({
    login: new FormControl(null),
    password: new FormControl(null),
  });

  constructor(private api: ApiService, private router: Router) { }

  ngOnInit(): void {
  }

  onSubmit(e: Event): void {
    e.preventDefault();
    const { login, password } = this.authForm.getRawValue();
    this.api.auth(login, password)
      .subscribe(() => {
        const token = authStore.getValue().token;
        if (token) {
          this.router.navigate(['users']);
        }
    });
  }
}
