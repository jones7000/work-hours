import { Component, OnInit } from '@angular/core';
import { CalchoursComponent } from "./calchours/calchours.component";


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CalchoursComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {

}