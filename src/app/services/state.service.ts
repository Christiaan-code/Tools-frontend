import { Injectable, Signal, WritableSignal, signal } from '@angular/core'
import { switchMap, timer, tap, takeUntil } from 'rxjs'
import { AppStatus } from 'src/models'
import { TimerService } from './timer.service'
import { environment } from 'src/environment/environment'

@Injectable({
  providedIn: 'root',
})
export class StateService {
  private appStateInternal: WritableSignal<AppStatus> = signal('sleeping')
  appState: Signal<AppStatus> = this.appStateInternal.asReadonly()

  constructor(private timerService: TimerService) {}

  startApp(): void {
    this.appStateInternal.update(() => 'startingUp')
    if (environment.environmentName === 'prod') {
      this.timerService.timer$
        .pipe(
          switchMap(() => timer(300000)),
          tap((res) => this.goToSleep()),
          takeUntil(this.timerService.stopTimer$),
        )
        .subscribe()
    }
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
