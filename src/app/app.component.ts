import { Component, OnInit } from '@angular/core'
import { FormControl } from '@angular/forms';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  data: string = ''
  title = 'util-project'
  decryptInput = new FormControl('')
  encryptInput = new FormControl('')
  oneWayEncryptInput = new FormControl('')
  oneWayEncryptOutput = new FormControl('')

  ngOnInit(): void {
    this.oneWayEncryptOutput.disable()
  }

  decrypt() {
    const apiUrl = 'http://localhost:1000/decrypt'; // Replace with your API endpoint
    const postData = {
      data: this.decryptInput.getRawValue()
    };

    fetch(apiUrl, {
      method: 'POST', // HTTP method (e.g., POST)
      headers: {
        'Content-Type': 'application/json', // Set the content type to JSON
      },
      body: JSON.stringify(postData), // Convert the data to JSON string
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log('Response data:', data);
        this.encryptInput.setValue(data.data)
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }

  encrypt() {
    const apiUrl = 'http://localhost:1000/encrypt'; // Replace with your API endpoint
    const postData = {
      data: this.encryptInput.getRawValue()
    };

    fetch(apiUrl, {
      method: 'POST', // HTTP method (e.g., POST)
      headers: {
        'Content-Type': 'application/json', // Set the content type to JSON
      },
      body: JSON.stringify(postData), // Convert the data to JSON string
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log('Response data:', data);
        this.decryptInput.setValue(data.data)
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }

  oneWayEncrypt() {
    const apiUrl = 'http://localhost:1000/one-way-encrypt'; // Replace with your API endpoint
    const postData = {
      data: this.oneWayEncryptInput.getRawValue()
    };

    fetch(apiUrl, {
      method: 'POST', // HTTP method (e.g., POST)
      headers: {
        'Content-Type': 'application/json', // Set the content type to JSON
      },
      body: JSON.stringify(postData), // Convert the data to JSON string
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log('Response data:', data);
        this.oneWayEncryptOutput.setValue(data.data)
        navigator.clipboard.writeText(this.oneWayEncryptOutput.getRawValue() ?? '');
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }
}
