import { Component } from '@angular/core';
import { AstronautsComponent } from './astronauts.component';

@Component({
  selector: 'app-root',
   standalone: true,
  imports: [ AstronautsComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',

})
export class AppComponent {
  title = 'peopleInSpace-app';
}
