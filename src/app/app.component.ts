import { Component, OnInit, effect } from '@angular/core'
import { FormControl } from '@angular/forms'
import { tap, firstValueFrom, Observable, takeUntil, Subject } from 'rxjs'
import { StateService } from './services/state.service'
import { AppStatus, BulkEncryptProgress, BulkEncryptResponse, BulkEncryptStatus } from 'src/models'
import { ApiService } from './services/api.service'
import { WebSocketService } from './services/websocket.service'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  decryptLoading: boolean = false
  encryptLoading: boolean = false
  oneWayEncryptLoading: boolean = false
  appState: AppStatus = 'sleeping'

  selectedFile: File | null = null
  csvRecords: { originalIdentifier: string; identifier: string }[] = []
  progress: number = 0
  bulkEncryptReady: boolean = false
  returnedRecords: number = 0

  progress$: Observable<BulkEncryptProgress>
  status$: Observable<BulkEncryptStatus>
  response$: Observable<BulkEncryptResponse>
  unsubscribe$: Subject<void> = new Subject()

  constructor(
    private apiService: ApiService,
    private stateService: StateService,
    private websocketService: WebSocketService,
  ) {
    effect(() => {
      this.appState = this.stateService.appState()
    })
    effect(() => {
      if (this.appState === 'sleeping') {
        this.websocketService.disconnect()
        this.unsubscribe$.next()
      }
    })

    this.progress$ = this.websocketService.webSocketProgress$
    this.status$ = this.websocketService.webSocketStatus$
    this.response$ = this.websocketService.webSocketResponses$
  }

  decryptInput = new FormControl()
  encryptInput = new FormControl()
  oneWayEncryptInput = new FormControl()
  oneWayEncryptOutput = new FormControl()
  RSAIDOutput = new FormControl()
  customAge = new FormControl(false)
  customAgeInput = new FormControl()
  isProduction = new FormControl(false)

  data: string = ''
  title = 'util-project'

  ngOnInit(): void {
    this.oneWayEncryptOutput.disable()
    this.RSAIDOutput.disable()
  }

  async decrypt(): Promise<void> {
    this.isProduction.getRawValue()
    this.decryptLoading = true
    await this.initControlFromClipboard(this.decryptInput)

    const postData = {
      data: this.decryptInput.getRawValue(),
      production: this.isProduction.getRawValue(),
    }

    firstValueFrom(
      this.apiService
        .decrypt(postData)
        .pipe(tap((decryptedValue: string) => this.encryptInput.setValue(decryptedValue))),
    )
  }

  async encrypt(): Promise<void> {
    this.encryptLoading = true
    await this.initControlFromClipboard(this.encryptInput)

    const postData = {
      data: this.encryptInput.getRawValue(),
      production: this.isProduction.getRawValue(),
    }

    firstValueFrom(
      this.apiService
        .encrypt(postData)
        .pipe(tap((encryptedValue: string) => this.decryptInput.setValue(encryptedValue))),
    )
  }

  async oneWayEncrypt(): Promise<void> {
    await this.initControlFromClipboard(this.oneWayEncryptInput)

    const postData = {
      data: this.oneWayEncryptInput.getRawValue(),
    }

    firstValueFrom(
      this.apiService
        .oneWayEncrypt(postData)
        .pipe(tap((encryptedValue: string) => this.oneWayEncryptOutput.setValue(encryptedValue))),
    )
  }

  generateRSAID(): void {
    let age: number
    if (this.customAgeInput.getRawValue()) {
      age = this.customAgeInput.getRawValue()
    } else {
      age = Math.floor(Math.random() * 63) + 18
    }
    const year: number = new Date().getFullYear() - age
    const month: number = Math.floor(Math.random() * 12) + 1
    const daysInMonth: number = new Date(year, month + 1, 0).getDate()
    const day: number = Math.floor(Math.random() * daysInMonth) + 1
    const birthDate: string =
      year.toString().slice(-2) +
      month.toString().padStart(2, '0') +
      day.toString().padStart(2, '0')

    const ssssNumber: string = Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, '0')
    const a: number = Math.floor(Math.random() * 10)
    let idNumber: string = birthDate + ssssNumber + '0' + a

    idNumber = idNumber + this.performLuhnsAlgorithm(idNumber).toString()
    this.RSAIDOutput.setValue(idNumber)
    navigator.clipboard.writeText(idNumber)
  }

  performLuhnsAlgorithm(number: string): number {
    const reversed: number[] = number.split('').reverse().map(Number)
    let sum: number = 0

    for (let i: number = 0; i < reversed.length; i++) {
      let digit: number = reversed[i]
      if (i % 2 === 0) {
        digit *= 2

        if (digit > 9) {
          digit -= 9
        }
      }
      sum += digit
    }

    const result = 10 - (sum % 10)
    return result === 10 ? 0 : result
  }

  private async initControlFromClipboard(control: FormControl<any>): Promise<void> {
    const clipboardData = await navigator.clipboard.readText()
    if (!control.getRawValue()) {
      control.setValue(clipboardData)
    }
  }

  async processUnencryptedIdentifiers(file: File): Promise<void> {
    this.oneWayEncryptLoading = true
    const text: string = await file.text()
    this.csvRecords = text
      .split('\n')
      .filter((line: string) => line.trim())
      .map((line: string) => ({
        originalIdentifier: line.trim(),
        identifier: line.trim(),
      }))

    await this.encryptAllIdentifiers()
  }

  private async encryptAllIdentifiers(): Promise<void> {
    try {
      this.websocketService.connect()

      const identifiers = this.csvRecords.map((record) => record.identifier)

      this.response$.pipe(takeUntil(this.unsubscribe$)).subscribe({
        next: (response: BulkEncryptResponse) => {
          const record = this.csvRecords.find((r) => r.originalIdentifier === response.original)
          if (record) {
            record.identifier = response.encrypted
          }
        },
      })

      this.progress$.pipe(takeUntil(this.unsubscribe$)).subscribe({
        next: (progress: BulkEncryptProgress) => {
          this.progress = Math.round((progress.processed / progress.total) * 100)
        },
      })

      const statusSub = this.status$.pipe(takeUntil(this.unsubscribe$)).subscribe({
        next: (status: BulkEncryptStatus) => {
          if (status.status === 'complete') {
            this.saveEncryptedFile()
            this.oneWayEncryptLoading = false
          } else if (status.status === 'error') {
            console.error('Encryption error:', status.message)
            this.oneWayEncryptLoading = false
          }
        },
      })

      this.websocketService.sendBulkEncryptRequest(identifiers)

      // Clean up
      await new Promise<void>((resolve) => {
        statusSub.add(() => resolve())
      })
    } catch (error) {
      console.error('Encryption error:', error)
      this.oneWayEncryptLoading = false
    } finally {
      this.websocketService.disconnect()
      this.unsubscribe$.next()
      this.progress = 0
    }
  }

  private saveEncryptedFile(): void {
    const csvContent = this.csvRecords
      .map((record) => `${record.originalIdentifier},${record.identifier}`)
      .join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'encrypted_identifiers.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  handleFileSelect(event: Event): void {
    const input: HTMLInputElement = event.target as HTMLInputElement
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0]
      this.bulkEncryptReady = true
    } else {
      this.selectedFile = null
      this.bulkEncryptReady = false
    }
  }
}
