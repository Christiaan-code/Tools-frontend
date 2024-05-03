import { Component, OnInit, effect } from '@angular/core'
import { FormControl } from '@angular/forms'
import { tap, firstValueFrom } from 'rxjs'
import { StateService } from './services/state.service'
import { AppStatus } from 'src/models'
import { ApiService } from './services/api.service'

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

  constructor(
    private apiService: ApiService,
    private stateService: StateService,
  ) {
    effect(() => {
      this.appState = this.stateService.appState()
    })
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

  async decrypt() {
    this.isProduction.getRawValue()
    this.decryptLoading = true
    await this.initControlFromClipboard(this.decryptInput)

    const postData = {
      data: this.decryptInput.getRawValue(),
      production: this.isProduction.getRawValue(),
    }

    firstValueFrom(
      this.apiService.decrypt(postData)
        .pipe(tap((decryptedValue: string) => this.encryptInput.setValue(decryptedValue))),
    )
  }

  async encrypt() {
    this.encryptLoading = true
    await this.initControlFromClipboard(this.encryptInput)

    const postData = {
      data: this.encryptInput.getRawValue(),
      production: this.isProduction.getRawValue(),
    }

    firstValueFrom(
      this.apiService.encrypt(postData)
        .pipe(tap((encryptedValue: string) => this.decryptInput.setValue(encryptedValue))),
    )
  }

  async oneWayEncrypt() {
    this.oneWayEncryptLoading = true
    await this.initControlFromClipboard(this.oneWayEncryptInput)

    const postData = {
      data: this.oneWayEncryptInput.getRawValue(),
    }

    firstValueFrom(
      this.apiService.oneWayEncrypt(postData)
        .pipe(tap((encryptedValue: string) => this.oneWayEncryptOutput.setValue(encryptedValue))),
    )
  }

  generateRSAID() {
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
    const reversed = number.split('').reverse().map(Number)
    let sum = 0

    for (let i = 0; i < reversed.length; i++) {
      let digit = reversed[i]
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
}
