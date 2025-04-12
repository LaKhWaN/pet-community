# Tech Context: Pet Community

## 1. Technologies Used

*   **Frontend:**
    *   **Framework/Library:** React 18+
    *   **Build Tool:** Vite
    *   **Language:** JavaScript (ES6+)
    *   **Routing:** `react-router-dom` v6
    *   **UI Components:** `react-bootstrap` v2+
    *   **HTTP Client:** `axios`
    *   **State Management:** React Context API (`AuthContext`), Component State (`useState`, `useEffect`, `useCallback`)
    *   **Notifications:** `react-toastify`
    *   **Icons:** `lucide-react`
    *   **Linting/Formatting:** ESLint (configuration likely in `eslint.config.js`), Prettier (implied via auto-formatting)
*   **Backend:**
    *   **Framework:** Express.js v4
    *   **Language:** Node.js (check `package.json` for specific version)
    *   **Database:** MongoDB Atlas
    *   **ODM:** Mongoose
    *   **Environment Variables:** `dotenv`
    *   **CORS:** `cors` middleware
    *   **Authentication:** `jsonwebtoken`, `bcryptjs` (used in `authController.js`), `authMiddleware` (applied to protected backend routes).
*   **Development Environment:**
    *   **Package Manager:** npm
    *   **Version Control:** Git
*   **Deployment:**
    *   Frontend: Vercel (implied by `frontend/vercel.json`)
    *   Backend: Vercel (implied by `backend/vercel.json`)

## 2. Development Setup

*   **Prerequisites:** Node.js and npm installed. Git installed. Access to a MongoDB Atlas cluster.
*   **Backend Setup:**
    1.  Navigate to the `backend` directory (`cd backend`).
    2.  Install dependencies: `npm install`.
    3.  Create a `.env` file in the `backend` directory.
    4.  Add necessary environment variables to `.env`:
        *   `MONGODB_URI`: Connection string for MongoDB Atlas.
        *   `PORT`: Port for the backend server (e.g., 5000).
        *   `JWT_SECRET`: Secret key for signing JWTs.
        *   (Potentially others like `JWT_EXPIRES_IN`).
    5.  Start the development server: `npm run dev` (assuming a `dev` script exists in `backend/package.json`, otherwise `node app.js`).
*   **Frontend Setup:**
    1.  Navigate to the `frontend` directory (`cd frontend`).
    2.  Install dependencies: `npm install`.
    3.  (Optional) Create a `.env` file in the `frontend` directory if frontend-specific environment variables are needed (e.g., `VITE_API_BASE_URL=http://localhost:5000/api`). The `axiosInstance` likely needs configuration to point to the correct backend URL.
    4.  Start the development server: `npm run dev`.
*   **Running Both:** Typically run the backend and frontend servers concurrently in separate terminals.

## 3. Technical Constraints & Considerations

*   **Environment Variables:** Sensitive information (API keys, database URIs, JWT secrets) MUST be stored in `.env` files and not committed to version control. `.gitignore` files should include `.env`.
*   **CORS:** The backend `cors` middleware is configured to allow requests from specific origins (`localhost:5173` for local dev, `pet-community-lyart.vercel.app` for deployment). Ensure this is updated if frontend deployment URLs change.
*   **Authentication Middleware:** The `authMiddleware` is now applied to relevant backend service routes (`POST`, `GET /my-services`, `PUT`, `DELETE`) ensuring authenticated access and ownership checks where applicable.
*   **Error Handling:** Implement robust error handling on both frontend and backend (e.g., specific error messages, logging, user feedback).
*   **Scalability:** State management in `App.jsx` now handles add, update, and delete, but might become complex. Consider refactoring if features grow. Backend filtering/pagination is needed for large datasets.

## 4. Key Dependencies & Libraries (Summary)

*   **Frontend:** `react`, `react-dom`, `react-router-dom`, `react-bootstrap`, `axios`, `react-toastify`, `lucide-react`.
*   **Backend:** `express`, `mongoose`, `dotenv`, `cors`, `jsonwebtoken`, `bcryptjs`.
