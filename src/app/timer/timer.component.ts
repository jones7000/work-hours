import { Component,ChangeDetectorRef,OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-timer',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './timer.component.html',
  styleUrl: './timer.component.css'
})
export class TimerComponent implements OnInit {
  timeInput: string = '00:25:00';  // 'HH:mm:ss'
  oldTimeInput : string = this.timeInput;
  timeInSeconds: number = this.timeInputToSeconds(this.timeInput); 
  intervalId: any;
  running: boolean = false; 

  constructor(private datePipe: DatePipe, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.checkNotificationPermission();
    this.updateTimeInput();
  }

  // Setzt den Timer basierend auf der Eingabe und startet den Timer
  setTimer() {
    this.timeInSeconds = this.timeInputToSeconds(this.timeInput);  
    if (this.running) {
      this.stopTimer();
      this.startTimer();
    }
  }

  // Startet den Timer
  startTimer() {
    if (!this.running) {
      this.oldTimeInput = this.timeInput;
      this.running = true;
      this.intervalId = setInterval(() => {
        this.timeInSeconds--;  
        this.updateTimeInput();
        this.cdr.detectChanges();

        // Wenn der Timer abgelaufen ist, stoppe ihn und sende eine Benachrichtigung
        if (this.timeInSeconds <= 0) {
          clearInterval(this.intervalId);
          this.sendNotification();
        }
      }, 1000);
    }
  }

  // Stoppt den Timer
  stopTimer() {
    if (this.running) {
      clearInterval(this.intervalId);
      this.running = false;  // Timer gestoppt
    }
  }

  // Setzt den Timer auf den Startwert zurück
  resetTimer() {
    this.timeInput = this.oldTimeInput;
    this.setTimer();
    this.stopTimer();
  }

  // Hilfsfunktion zur Umwandlung von 'HH:mm:ss' in Sekunden
  timeInputToSeconds(timeInput: string): number {
    const [hours, minutes, seconds] = timeInput.split(':').map(num => parseInt(num, 10));
    return (hours * 3600) + (minutes * 60) + seconds;
  }

  // Aktualisiert das Input-Feld basierend auf der verbleibenden Zeit
  updateTimeInput() {
    const hours = Math.floor(this.timeInSeconds / 3600);
    const minutes = Math.floor((this.timeInSeconds % 3600) / 60);
    const seconds = this.timeInSeconds % 60;
    this.timeInput = `${this.padZero(hours)}:${this.padZero(minutes)}:${this.padZero(seconds)}`;
  }

  // Hilfsfunktion, um eine führende Null hinzuzufügen
  padZero(value: number): string {
    return value < 10 ? '0' + value : value.toString();
  }

  // Prüft, ob Benachrichtigungen aktiviert wurden
  checkNotificationPermission(): void {
    if (Notification.permission !== 'granted') {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          console.log('Benachrichtigungen sind jetzt aktiviert.');
        } else {
          alert(`Für volle Funktionalität Benachrichtigungen aktivieren`);
        }
      });
    }
  }

  // Sendet eine Benachrichtigung, wenn der Timer abgelaufen ist
  sendNotification() {
    const hours = Math.floor(this.timeInSeconds / 3600);
    const minutes = Math.floor((this.timeInSeconds % 3600) / 60);
    const seconds = this.timeInSeconds % 60;
    alert(`Der Timer ist abgelaufen! (${this.padZero(hours)}:${this.padZero(minutes)}:${this.padZero(seconds)})`);
  }
}