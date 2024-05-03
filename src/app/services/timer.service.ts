import { Injectable } from "@angular/core";
import { Subject, Observable } from "rxjs";

@Injectable({
  providedIn: 'root',
})
export class TimerService {
  private stopTimerSubject: Subject<void> = new Subject()
  stopTimer$: Observable<void> = this.stopTimerSubject.asObservable()
  private timerSubject: Subject<void> = new Subject()
  timer$: Observable<void> = this.timerSubject.asObservable()

  apiCallSent(): void {
    this.timerSubject.next()
  }

  stopTimer() {
    this.stopTimerSubject.next()
  }
}