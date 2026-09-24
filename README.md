# Xonline Wallet App

A modern, installable PWA wallet for crediting funds via e-wallet (GCash, Maya, PayPal) and banks (GoTyme, BPI).

## Features

- Access-code authentication with biometric unlock (WebAuthn)
- Installable PWA (works offline, home-screen icon)
- Cosmic animated background — star field, shooting stars, orbiting satellite
- QR code for each payment method
- Auto-logout after 2 minutes of inactivity
- Live network status bar
- Screenshot detection warning
- Smooth page transitions with Framer Motion

## Tech Stack

- React 18
- Vite 5
- React Router v6
- Framer Motion
- qrcode.react
- vite-plugin-pwa

## Getting Started

    npm install
    npm run dev

Open http://localhost:5173/

## Build for Production

    npm run build
    npm run preview

## Configuration

The access code is stored privately in `src/context/AuthContext.jsx`.
Change it before deploying to production.

## License

MIT
