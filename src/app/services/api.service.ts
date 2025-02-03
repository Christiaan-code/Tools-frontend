import { Injectable } from '@angular/core'
import { delay, take, tap, Observable, Subject } from 'rxjs'
import { StateService } from './state.service'
import { AxiosService } from './axios.service'
import { Socket, io } from 'socket.io-client'
import { websocketUrl } from 'src/environment'
import {
  BulkEncryptProgress,
  BulkEncryptRequest,
  BulkEncryptResponse,
  BulkEncryptStatus,
} from 'src/models'

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private socket: Socket | null = null
  private responseSubject = new Subject<BulkEncryptResponse>()
  private progressSubject = new Subject<BulkEncryptProgress>()
  private statusSubject = new Subject<BulkEncryptStatus>()

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

  connect(): void {
    if (!this.socket) {
      this.socket = io(websocketUrl)

      this.socket.on('bulk-one-way-encrypt-result', (response: BulkEncryptResponse) => {
        this.responseSubject.next(response)
      })

      this.socket.on('bulk-one-way-encrypt-progress', (progress: BulkEncryptProgress) => {
        this.progressSubject.next(progress)
      })

      this.socket.on('bulk-one-way-encrypt-status', (status: BulkEncryptStatus) => {
        this.statusSubject.next(status)
      })
    }
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
    }
  }

  sendBulkEncryptRequest(data: string[]): void {
    if (this.socket) {
      const request: BulkEncryptRequest = {
        type: 'bulk-one-way-encrypt',
        data,
      }
      this.socket.emit('bulk-one-way-encrypt', request)
    }
  }

  getWebSocketResponses(): Observable<BulkEncryptResponse> {
    return this.responseSubject.asObservable()
  }

  getWebSocketProgress(): Observable<BulkEncryptProgress> {
    return this.progressSubject.asObservable()
  }

  getWebSocketStatus(): Observable<BulkEncryptStatus> {
    return this.statusSubject.asObservable()
  }
}
