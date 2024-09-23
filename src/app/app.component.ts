import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{

  startTime: string = ''; 
  endTime: string = '';
  breakTime: string = '';
  differenceTime: string = '';
  
  hoursSinceStartTime: number | null = null;
  hoursBetweenStartEnd: number | null = null;

  emptyHours: string = '- - : - -';
  defaultTitle: string = 'Work Hours'

  private intervalId: any;

  ngOnInit(): void {
    this.differenceTime = this.emptyHours;
    this.intervalId = setInterval(() => this.calculateDifference(), 5000);
  }

  ngOnDestroy() {
    clearInterval(this.intervalId);
  }

  // Berechnet die Differenz zwischen Startzeit und der aktuellen Zeit
  calculateDifference() {
    if (this.startTime) {
      let end = new Date();
      
      // Setze die Endzeit auf die eingegebene Zeit oder auf jetzt, falls nicht eingegeben
      if (this.endTime) {
        end = this.parseTime(this.endTime);
      }
      
      const start = this.parseTime(this.startTime);
      
      // Berechne die Differenz in Millisekunden
      let diffInMilliseconds = end.getTime() - start.getTime();
      
      // Wenn eine Pausenzeit eingegeben wurde, ziehe sie ab
      if (this.breakTime) {
        const breakDuration = this.parseBreakTime(this.breakTime); // Berechne die Pausendauer in Millisekunden
        diffInMilliseconds -= breakDuration; // Pausendauer abziehen
      }
      
      const diffInHours = diffInMilliseconds / (1000 * 60 * 60);
      this.differenceTime = this.formatDifference(diffInHours);

      document.title = this.differenceTime;
    }
  }

  // Hilfsfunktion zum Parsen von Uhrzeit-Strings in Date-Objekte
  parseTime(time: string): Date {
    const now = new Date();
    const [hours, minutes] = time.split(':').map(Number);
    const parsedTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes);
    return parsedTime;
  }

  // Hilfsfunktion zum Formatieren der Zeitdifferenz in Stunden und Minuten
  formatDifference(diffInHours: number): string {
    const hours = Math.floor(Math.abs(diffInHours));  // Ganze Stunden
    const minutes = Math.floor((Math.abs(diffInHours) - hours) * 60);  // Minuten aus dem Restteil
    // Führende Nullen hinzufügen
    const formattedHours = hours.toString().padStart(2, '0');
    const formattedMinutes = minutes.toString().padStart(2, '0');
    
    return `${formattedHours}:${formattedMinutes}`;
    //return `${hours} : ${minutes} `;
  }

  // Hilfsmethode zum Parsen der Pausenzeit
  parseBreakTime(breakTime: string): number {
    const [hours, minutes] = breakTime.split(':').map(Number);
    return (hours * 60 + minutes) * 60 * 1000; // Umrechnung in Millisekunden
  }

  clearStartTime() {
    this.startTime = '';
    this.differenceTime = this.emptyHours;  // Lösche auch die Zeitdifferenz
    document.title = this.defaultTitle;
  }

  // Methode zum Zurücksetzen der Endzeit
  clearEndTime() {
    this.endTime = '';
    this.differenceTime = this.emptyHours;  // Lösche auch die Zeitdifferenz
    this.calculateDifference();
  }

  clearBreakTime() {
    this.breakTime = '';
    this.differenceTime = this.emptyHours;  // Lösche auch die Zeitdifferenz
    this.calculateDifference();
  }
}