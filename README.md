# Whisper Wall

An anonymous, real-time message-sharing platform built with the MERN stack.

## Features

- Post anonymous messages without login
- Real-time feed updates via Socket.IO
- Dark mode UI with Tailwind CSS
- Responsive mobile-first design
- Character limit validation
- Toast notifications
- Auto-refresh feed

## Tech Stack

- **Frontend:** React + Tailwind CSS + Axios
- **Backend:** Node.js + Express.js + Socket.IO
- **Database:** MongoDB Atlas
- **Real-time:** Socket.IO

## Project Structure

```
whisper-wall/
├── client/    # React frontend
├── server/    # Express backend
└── README.md
```

## Quick Start

### Backend

```bash
cd server
npm install
# Create .env file (see .env.example)
npm start
```

### Frontend

```bash
cd client
npm install
npm start
```

## Deployment

### Frontend (Vercel)

```bash
cd client
npm install -g vercel
vercel
```

### Backend (Render)

1. Push code to GitHub
2. Connect repository to Render
3. Set environment variables
4. Deploy

### MongoDB Atlas

1. Create cluster at [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Whitelist all IPs (`0.0.0.0/0`)
3. Copy connection string to `MONGODB_URI`

## License

MIT
