import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';

import { PageTitleStoreService } from '../services/page-title-store.service';
import { CommonStateService } from '../services/common-state.service';


@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {

  constructor(@Inject(PageTitleStoreService) public pageTitleService: PageTitleStoreService,
  @Inject(CommonStateService) private sharedStore: CommonStateService) {
    
  }

  onDeleteEmployee(): void {
    this.sharedStore.clickedOnDelete(true);
  }
}
