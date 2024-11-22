import { Component, OnInit } from '@angular/core';
import { CalchoursComponent } from "./calchours/calchours.component";
import { TimerComponent } from "./timer/timer.component";


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CalchoursComponent, TimerComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {

}