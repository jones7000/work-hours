import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterOutlet, ActivatedRoute } from '@angular/router';


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

  calendarWeek: number | null = null;

  emptyHours: string = '- - : - -';
  defaultTitle: string = 'Work Hours'

  private intervalId: any;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.differenceTime = this.emptyHours;
    this.intervalId = setInterval(() => this.calculateDifference(), 5000);
    this.route.queryParams.subscribe(params => {
      this.breakTime = params['break'] ? params['break'] : '';
      this.endTime = params['end'] ? params['end'] : '';
      if (params['start']) {
        this.startTime = params['start']
        this.calculateDifference();
      }
      else {
        this.startTime = '';
      }

    });
    this.calendarWeek = this.getWeekNumber(new Date());
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

  getWeekNumber(d: Date) {
    // Copy date so don't modify original
    d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    // Set to nearest Thursday: current date + 4 - current day number
    // Make Sunday's day number 7
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay()||7));
    // Get first day of year
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1));
    // Calculate full weeks to nearest Thursday
    var weekNo = Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
    // Return array of year and week number
    return weekNo;
}

}