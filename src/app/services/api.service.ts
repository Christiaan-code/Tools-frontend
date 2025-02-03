import { Injectable } from '@angular/core'
import { delay, take, tap } from 'rxjs'
import { StateService } from './state.service'
import { AxiosService } from './axios.service'

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(
    private axios: AxiosService,
    private stateService: StateService,
  ) {}

  getStatus() {
    return this.axios
      .get('/status')
      .pipe(
        delay(2000),
        tap(() => this.stateService.setReady()),
        take(1),
      )
      .subscribe()
  }

  decrypt(postData: { data: any; production: boolean | null }) {
    return this.axios.post('/decrypt', postData)
  }

  encrypt(postData: { data: any; production: boolean | null }) {
    return this.axios.post('/encrypt', postData)
  }

  oneWayEncrypt(postData: any) {
    return this.axios.post('/one-way-encrypt', postData)
  }
}
