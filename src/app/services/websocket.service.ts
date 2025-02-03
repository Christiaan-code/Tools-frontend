import { Injectable } from '@angular/core'
import { Subject, Observable } from 'rxjs'
import { Socket, io } from 'socket.io-client'
import { environment } from 'src/environment/environment'
import {
  BulkEncryptResponse,
  BulkEncryptProgress,
  BulkEncryptStatus,
  BulkEncryptRequest,
} from 'src/models'

@Injectable({
  providedIn: 'root',
})
export class WebSocketService {
  private socket: Socket | null = null
  private responseSubject = new Subject<BulkEncryptResponse>()
  private progressSubject = new Subject<BulkEncryptProgress>()
  private statusSubject = new Subject<BulkEncryptStatus>()

  constructor() {}

  connect(): void {
    if (!this.socket) {
      this.socket = io(environment.websocketUrl)

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
    } else {
      throw new Error('Socket not connected')
    }
  }

  get webSocketResponses$(): Observable<BulkEncryptResponse> {
    return this.responseSubject.asObservable()
  }

  get webSocketProgress$(): Observable<BulkEncryptProgress> {
    return this.progressSubject.asObservable()
  }

  get webSocketStatus$(): Observable<BulkEncryptStatus> {
    return this.statusSubject.asObservable()
  }
}
