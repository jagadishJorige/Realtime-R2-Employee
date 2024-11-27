import { Component, Signal, signal, WritableSignal, Inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatDividerModule} from '@angular/material/divider';
import {MatToolbarModule} from '@angular/material/toolbar';
import { HammerModule } from '@angular/platform-browser';

import { NavbarComponent } from './shared/navbar/navbar.component';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatDividerModule,
    MatToolbarModule,
    NavbarComponent,
    HammerModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'firebaseWebApp';
  encryptionString: string = 'U2FsdGVkX19+vM6NH9UV8IYoA9gU9y3cYcx7H5W3Kdo=';
  welcomeToken: WritableSignal<string | null> = signal('');

  constructor() {
    if(localStorage.getItem('token')) {
      const getToken = localStorage.getItem('token');
      this.welcomeToken.set(getToken);
    }
  }

  public continue(): void {
    localStorage.clear();
    this.welcomeToken.set(this.encryptionString);
    localStorage.setItem('token', this.encryptionString);
  }
}
