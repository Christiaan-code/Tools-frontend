import { Injectable, Signal, WritableSignal, signal } from '@angular/core'
import { switchMap, takeUntil, tap, timer } from 'rxjs'
import { AppStatus } from 'src/models'
import { TimerService } from './timer.service'

@Injectable({
  providedIn: 'root',
})
export class StateService {
  private appStateInternal: WritableSignal<AppStatus> = signal('sleeping')
  appState: Signal<AppStatus> = this.appStateInternal.asReadonly()

  constructor(private timerService: TimerService) {}

  startApp(): void {
    this.appStateInternal.update(() => 'startingUp')
    this.timerService.timer$
      .pipe(
        switchMap(() => timer(300000)),
        tap((res) => this.goToSleep()),
        takeUntil(this.timerService.stopTimer$),
      )
      .subscribe()
  }

  goToSleep() {
    this.appStateInternal.update(() => 'sleeping')
    this.timerService.stopTimer()
  }

  setError() {
    this.appStateInternal.update(() => 'error')
  }

  setReady(): void {
    this.appStateInternal.update(() => 'ready')
  }
}
