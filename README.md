# AgriRent - Farm Equipment Rental Platform

A modern, full-stack web application for renting farm equipment built with the MERN (MongoDB, Express, React, Node.js) stack.

## Features
- Browse and search available farm equipment
- Secure user authentication with JWT
- Equipment rental booking system
- Payment integration with Razorpay
- Image management with Cloudinary
- Responsive UI with Tailwind CSS

## Tech Stack
- **Frontend:** React, Tailwind CSS, Axios
- **Backend:** Node.js, Express
- **Database:** MongoDB
- **Authentication:** JWT
- **Payments:** Razorpay
- **Storage:** Cloudinary

## Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- MongoDB Atlas account (for cloud database)
- Razorpay account (for payment processing)
- Cloudinary account (for image storage)

## Installation & Setup

### Backend Setup
Open a terminal and run:
```bash
cd server
npm install
npm run dev
```
The backend server will start on `http://localhost:5000`

### Frontend Setup
Open another terminal and run:
```bash
cd client
npm install
npm run dev
```

### Environment Variables
Create a `.env` file in the `server` folder with:
```
PORT=5000
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_secret_key
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

## Project Structure
```
agrirent/
├── client/          # React frontend
├── server/          # Express backend
├── .gitignore
└── README.md
```

## Usage
1. Start the backend server first
2. In a new terminal, start the frontend
3. Open your browser and navigate to the frontend URL
4. Create an account and start renting equipment

## Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

## License
ISC