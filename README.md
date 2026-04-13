# CyanCast

----------

CyanCast 📻 is a personal project for finding and playing web radios. Initially designed for **Raspberry Pi 5** audio project with Bluetooth audio, it has evolved with containerized microservices architecture.

## 🚀 Architecture and Technologies

The application utilizes a strict separation of layers into two microservices (containers) via `docker-compose`:

1.  **Web App (`cyancast_app`)**:
    *   **Next.js 14** (App Router). Serving the search Frontend and the Premium Glassmorphism interface with the modern "Mesh Gradient".
    *   **React Server Actions**: Used as a protected communication bridge.
    *   Configured to build instantly and serve the interface in **production mode**, delivering extreme performance on port `3000`.

2.  **Audio Player (`cyancast_player`)**:
    *   **Headless** container running entirely on `debian:bookworm-slim` (Compatible with x86_64 Desktop processors or ARM64 Raspberry Pi).
    *   The audio engine is `mpv` configured to receive commands directly from a pure UNIX socket (`/tmp/mpv/socket/mpv.sock`).
    *   Direct connection to the Host's PulseAudio (The audio is played on the host machine, fully supporting local Bluetooth outputs).

---

## 🎧 Setup and How to Run

Simply clone the directory to your Desktop or Raspberry Pi and spin up the stack with a single Docker command. All environment injection, folder permissions, and PulseAudio ID permissions are handled through dynamic `variables` injected into the compose orchestration.

```bash
docker compose up -d --build
```

The `app` container will spin up, download all packages, execute the final Next.js `build`, and then make the virtual radio available at the url:
`http://YOUR_IP_OR_LOCALHOST:3000`

---

## 📡 Clean and Continuous Communication

CyanCast's key differentiator is that the Web App tab does not internally handle the streaming data. Next.js forwards the radio link via **Socket (IPC)** (stored in the Docker volume) to the neighbor container (`player`). This means closing your phone browser, switching tabs, or turning off your screen will not stop your radio.

Additionally, the system implements "Load More" pagination with the Radio-Browser API backend and maintains seamless interface state management through Next.js. The pause functionality utilizes the `set_property` command to temporarily suspend the player, conserving bandwidth while preserving the active radio station in the UI.

---

## 🔀 Output Mode Switching

A key feature of CyanCast is the ability to switch between server-side and client-side audio output modes:

- **Server Mode**: Audio is processed and played through the MPV player container, providing consistent performance and better resource utilization on the host system.
- **Client Mode**: Audio is streamed and played directly in the browser, offering better compatibility with various audio formats and potentially lower latency.

Users can toggle between these modes using the toggle button in the interface. The preference is saved to localStorage for future sessions.

---

## 📝 Note

This project was created for personal exploration and Home Lab use only.

---

## 📄 License

Copyright (c) 2026 Alex Mendes
[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0.html)

