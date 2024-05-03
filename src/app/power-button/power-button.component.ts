import { Component, effect } from '@angular/core'
import { StateService } from '../services/state.service'
import { AppStatus } from 'src/models'
import { AxiosService } from '../services/axios.service'
import { delay, take, tap } from 'rxjs'
import { ApiService } from '../services/api.service'

@Component({
  selector: 'app-power-button',
  templateUrl: './power-button.component.html',
  styleUrls: ['./power-button.component.scss'],
})
export class PowerButtonComponent {
  appState: AppStatus = 'sleeping'
  checkBox: boolean = false

  constructor(
    private stateService: StateService,
    private apiService: ApiService,
  ) {
    effect(() => {
      this.appState = this.stateService.appState()
    })
    effect(() => {
      this.checkBox = this.stateService.appState() !== 'sleeping'
    })
  }

  togglePower() {
    if (this.appState === 'sleeping') {
      this.checkBox = true
      this.stateService.startApp()
      this.apiService.getStatus()
    } else {
      this.stateService.goToSleep()
    }
  }
}
