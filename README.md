# [WhatsApp Chat](https://test-api-green-theta.vercel.app/)

A React app for sending and receiving WhatsApp text messages using GREEN-API.

## Features

- Sign in with GREEN-API credentials
- Protected chat page
- Create chats by phone number
- Send and receive text messages
- Display messages sent from the connected phone
- Chat list with last message previews
- Preserve the session, chats and messages across page reloads using sessionStorage
- Form validation and error messages
- Sign out

## Tech Stack

- React
- TypeScript
- Vite
- Redux Toolkit and RTK Query
- Redux Persist
- React Router
- React Hook Form
- Zod
- SCSS Modules
- ESLint, Stylelint and Prettier
- Steiger (Feature-Sliced Design checks)
- GREEN-API

## How to use

Requires Node.js 22.12+ and npm.

1. Clone the repository and open the project directory:

    ```bash
    git clone https://github.com/SavitskayaKseniya22/test-api-green.git
    cd test-api-green
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

3. Start the development server:

    ```bash
    npm run dev
    ```

4. Open the local URL shown in the terminal.

## GREEN-API setup

1. Create a WhatsApp instance in the GREEN-API console and connect your WhatsApp account.
2. In the instance settings:
    - Enable **Receive webhooks on incoming messages and files**.
    - Enable **Receive webhooks on messages sent from phone** to display messages sent from the connected phone.
    - Leave **Webhook Url** empty to receive notifications through HTTP API.
3. Enter your `idInstance` and `apiTokenInstance` on the app's sign-in page.
4. Create a chat using a phone number with its country code, without spaces.
5. Send a text message and reply from the recipient's WhatsApp account.

Messages are received through `ReceiveNotification` and acknowledged with `DeleteNotification`.
The app stores messages collected during use; it does not load existing WhatsApp history.
Signing out clears the local session and chat history.

## Production build

```bash
npm run build
npm run preview
```

The production files are generated in `dist`. Netlify build settings and SPA routing are configured in `netlify.toml`.

## Screenshots

<img width="1920" height="955" alt="Screenshot 2026-09-28 at 20-14-01 WhatsApp" src="https://github.com/user-attachments/assets/26959b4c-dc9c-4d13-8edb-f8ffdfb0f3e8" />
<img width="1920" height="955" alt="Screenshot 2026-09-28 at 20-14-33 WhatsApp" src="https://github.com/user-attachments/assets/20168841-b123-44f1-ab3c-9fda23f986a8" />
<img width="1920" height="955" alt="Screenshot 2026-09-28 at 20-15-55 WhatsApp" src="https://github.com/user-attachments/assets/6ee5c157-8ebb-499d-a97e-4339f6d2d7b9" />





