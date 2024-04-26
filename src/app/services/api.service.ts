import { Injectable } from '@angular/core'
import axios, { AxiosResponse } from 'axios'
import { EMPTY, Observable, catchError, from, map, tap } from 'rxjs'
import { backendUrl } from 'src/environment'
import { Route } from 'src/models'

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  post(route: Route, data: any): Observable<any> {
    return from(axios.post(backendUrl+route, data )).pipe(
      tap((response: AxiosResponse) => {
        if (!response.status) {
          throw new Error(`HTTP error! Status: ${response.statusText}`)
        }
        console.log('Response data:', response.data.data)
      }),
      map((response: AxiosResponse) => response.data.data),
      tap((value: any) => {
        if (typeof value === 'string' && !!value) {
          navigator.clipboard.writeText(value)
        }
      }),
      catchError((error) => {
        console.error('API call failed:', error)
        return EMPTY
      }),
    )
  }
}