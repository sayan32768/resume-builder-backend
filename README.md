# Resume Builder Backend

This is the backend server for the Resume Builder application. It is a **Node.js** and **Express.js** API responsible for handling user authentication, email verification, and all data persistence for resumes.

It provides a secure RESTful API for the React frontend to consume.

## Features

  - **User Authentication:** Secure user registration and login using cookie-based sessions.
  - **Protected Routes:** Utilizes isAuthenticated.js middleware to protect sensitive endpoints by validating the user's session cookie.
  - **Email Verification:** Sends a verification email to new users upon registration.
  - **Password Hashing:** Uses `bcrypt` to securely hash and store user passwords.
  - **Protected Routes:** Utilizes middleware (`isAuthenticated.js`) to protect sensitive endpoints.
  - **Resume CRUD:** Full Create, Read, Update, and Delete operations for user-specific resumes.
  - **Data Validation:** Server-side schema validation for all incoming user and resume data (`validators/`).
  - **Database Management:** Connects to a MongoDB database using Mongoose (`models/`).

## Technologies Used

  - **Node.js** - JavaScript runtime environment.
  - **Express.js** - Web framework for Node.js.
  - **MongoDB** - NoSQL database for storing user and resume data.
  - **Mongoose** - Object Data Modeling (ODM) library for MongoDB.
  - **JSON Web Tokens (JWT)** - For handling user authentication.
  - **cookie-parser** - For parsing cookie headers to manage authentication.
  - **bcrypt.js** - For password hashing.
  - **Nodemailer** - For sending verification emails.
  - **Handlebars (hbs)** - For email templating.
  - **dotenv** - For managing environment variables.
  - **Zod** - For data validation in the `validators/` directory.

## Project Structure

```
resume-builder-backend/
├─ controllers/
│  ├─ resumeController.js
│  └─ userController.js
├─ database/
│  └─ db.js
├─ emailVerify/
│  ├─ template.hbs
│  └─ verifyMail.js
├─ middlewares/
│  └─ isAuthenticated.js
├─ models/
│  ├─ resumeModel.js
│  ├─ sessionModel.js
│  └─ userModel.js
├─ routes/
│  ├─ resumeRoute.js
│  └─ userRoute.js
├─ validators/
│  ├─ resumeValidate.js
│  └─ userValidator.js
├─ .env
├─ .gitignore
├─ package.json
└─ server.js
```

-----

## Folder Conventions

  - **`controllers/`**: Contains the business logic for each route. Functions here are called by the routes to handle requests.
  - **`database/`**: Includes the database connection logic (`db.js`).
  - **`emailVerify/`**: Holds the logic (`verifyMail.js`) and email template (`template.hbs`) for sending verification emails.
  - **`middlewares/`**: Contains Express middleware, such as the `isAuthenticated.js` check to protect routes.
  - **`models/`**: Defines the Mongoose schemas for all database collections (e.g., `userModel.js`, `resumeModel.js`).
  - **`routes/`**: Defines all API endpoints and connects them to their respective controller functions.
  - **`validators/`**: Contains validation schemas or functions to validate request bodies before they reach the controller.
  - **`server.js`**: The main entry point for the application. It initializes the Express server, connects to the database, and sets up all routes and middleware.

## Getting Started

### Prerequisites

  - Node.js \>= 18
  - npm or yarn
  - MongoDB (a local instance or a connection string from a service like MongoDB Atlas)

### Installation

1.  Clone the repository:

    ```bash
    git clone https://github.com/sayan32768/resume-builder-backend.git
    cd resume-builder-backend
    ```

2.  Install dependencies:

    ```bash
    npm install
    ```

    or

    ```bash
    yarn
    ```

3.  Set up your environment variables (see section below).

4.  Start the development server:

    ```bash
    npm run dev
    ```

    (Assuming you have a `dev` script in `package.json`. If not, use:)

    ```bash
    node server.js
    ```

The server will typically start on `http://localhost:8000` (or the port specified in your `.env`).

## Environment Variables

This project requires environment variables to run.

1.  Create a `.env` file in the root of the `resume-builder-backend/` directory.

2.  Copy the following content into the `.env` file and fill in your values.

    ```
    # Server Configuration
    PORT=8000

    # Database Configuration
    MONGO_URI="your_mongodb_connection_string"

    # Authentication for user session management
    SECRET_KEY="your_very_strong_secret_key_here"

    # Authentication for email service
    MAIL_SECRET_KEY="your_very_strong_secret_key_here"

    # Email service config for nodemailer
    MAIL_USER=your_mail_id
    MAIL_PASSWORD=your_mail_password

    # URL for the frontend (for email links)
    BASE_URL_FRONTEND=http://localhost:5173 (typically)
    ```

3.  Restart the server for the changes to take effect.

> **Important:** Never commit your `.env` file to GitHub.

## API Endpoints

Here is a summary of the available API endpoints.

### User & Authentication Routes

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/user/register` | Registers a new user. |
| `POST` | `/user/login` | Logs in an existing user. |
| `POST` | `/user/logout` | Logs out the current user. |
| `GET` | `/user/getUserDetails` | Gets the profile of the currently logged-in user (Protected). |
| `POST` | `/user/verify` | Verifies a user's email via a link. |
| `POST` | `/user/refresh` | To refresh the access token. |

### Resume Routes (Protected)

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/resume/create` | Creates a new resume for the logged-in user. |
| `GET` | `/resume/all` | Gets all resumes for the logged-in user. |
| `PUT` | `/resume/:id` | Updates a specific resume by its ID. |
| `GET` | `/resume/:id` | Gets a specific resume by its ID. |
| `DELETE` | `/resume/delete/:id` | Deletes a specific resume by its ID. |
| `POST` | `/resume/download` | Handles the resume download request. |

## Contributing

1.  Fork the repository.
2.  Create a feature branch (`git checkout -b feature/my-feature`).
3.  Commit your changes (`git commit -am 'Add new feature'`).
4.  Push to the branch (`git push origin feature/my-feature`).
5.  Open a Pull Request.
