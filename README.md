
# Crypto Trading Frontend

This is the **React.js frontend** for a real-time crypto trading simulation app. It connects to a Spring Boot backend and provides:

- Live cryptocurrency market prices
- Portfolio management
- Buy/sell crypto transactions
- Transaction history with profit/loss calculations
- Realtime data updates using polling or WebSocket (optional)

---

## Features

- View top 20 cryptocurrencies with live prices
- Buy crypto (deducts from balance)
- Sell crypto (adds to balance + shows profit/loss)
- Dynamic portfolio and transaction history
- Account reset button to restore initial balance
- Context-based global state (user, balance, etc.)

---

## Tech Stack

- React 18
- MUI (Material UI) for styling
- Axios for HTTP requests
- React Router v6
- Custom API service layer
- Optional: WebSocket client for live updates

---

## Setup Instructions

### 1. Install dependencies
```bash
npm install
```

### 2. Start the app
```bash
npm start
```

### 3. Runs on
```
http://localhost:3000
```

Make sure your backend is running on `http://localhost:8080`.

---

## Environment

The app assumes the backend is hosted at `http://localhost:8080`. You can change that in `src/services/api.js`:

```js
const BASE_URL = "http://localhost:8080";
```

---

## Available Routes

| Path             | Page               |
|------------------|--------------------|
| `/`              | Dashboard          |
| `/market`        | Crypto Market      |
| `/portfolio`     | Portfolio Summary  |
| `/transactions`  | Transaction History|

---

## Developer Notes

- Prices are polled every 5 seconds from the backend (which receives updates from Kraken).
- Transaction history enriches selling data with profit/loss using backend logic.
- State is shared via React Context (UserContext.js).

---

## Author

Developed by [ObesetorRebirth]. Connects with a Spring Boot backend for full trading simulation.
