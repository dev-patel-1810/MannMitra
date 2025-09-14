import axios from 'axios'

const BASE_URL = 'https://api.textbee.dev/api/v1'
const API_KEY = '1b80d3ea-a65d-4d07-9217-69114e519c05'
const DEVICE_ID = 'YOUR_DEVICE_ID'

const response = await axios.post(`${BASE_URL}/gateway/devices/${DEVICE_ID}/send-sms`, {
    recipients: [ '+1234567890' ],
    message: 'Hello from TextBee!',
}, {
    headers: {
    'x-api-key': API_KEY,
  },
})

console.log(response.data)