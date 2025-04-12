# System Patterns: Pet Community

## 1. Architecture Overview

The application follows a standard client-server architecture:

*   **Frontend:** A Single Page Application (SPA) built with React and Vite. It handles user interface, routing (using `react-router-dom`), and interaction with the backend API. Styling is primarily done using `react-bootstrap`.
*   **Backend:** A RESTful API built with Node.js and Express. It handles business logic, data validation, and interaction with the database.
*   **Database:** MongoDB (specifically MongoDB Atlas) is used for data persistence, accessed via Mongoose ODM.

```mermaid
graph TD
    User[User Browser] --> Frontend[React SPA (Vite)]
    Frontend --> Backend[Node.js/Express API]
    Backend --> Database[MongoDB Atlas (Mongoose)]

    subgraph Client
        User
        Frontend
    end

    subgraph Server
        Backend
        Database
    end
```

## 2. Key Technical Decisions

*   **MERN Stack Variant:** The core stack is MongoDB, Express, React, Node.js.
*   **Component Library:** `react-bootstrap` is used for UI components, providing pre-built, styled elements.
*   **Routing:** `react-router-dom` manages client-side routing within the React SPA.
*   **API Communication:** `axios` (via a configured instance `axiosInstance`) is used for making HTTP requests from the frontend to the backend API.
*   **Authentication:** JWT (JSON Web Tokens) are used for user authentication (managed by `AuthContext` on the frontend and `authMiddleware` on the backend - though middleware application is pending for some routes).
*   **State Management (Services):** Service data fetched from the API is currently managed in the top-level `App.jsx` component using React's built-in `useState`, `useEffect`, and `useCallback` hooks. State and update handlers are passed down as props.
*   **Notifications:** `react-toastify` is used for displaying user feedback messages (success, error, info).

## 3. Component Relationships (Frontend - Simplified for Services)

```mermaid
graph TD
    App[App.jsx State: services, fetchServices, handleServiceAdded, handleServiceUpdated, handleServiceDeleted] --> Navbar[Navbar onServiceAdded, onServiceUpdated, onServiceDeleted]
    App --> ServicePage[ServicePage services, loading, error, refreshServices]

    Navbar --> AddServiceModal[AddServiceModal]
    Navbar --> ManageServicesModal[ManageServicesModal onServiceUpdated, onServiceDeleted]
    ManageServicesModal --> EditServiceModal[EditServiceModal onUpdateSuccess]
    ManageServicesModal --> DeleteConfirmationModal[DeleteConfirmationModal onDeleteSuccess]

    ServicePage --> ServiceCard[ServiceCard (implicit loop)]
    ServiceCard --> ServiceDetailPage[ServiceDetailPage (via Link)]

    subgraph Core App
        App
    end

    subgraph Navigation & Modals
        Navbar
        AddServiceModal
    end

    subgraph Service Display
        ServicePage
        ServiceCard
        ServiceDetailPage
    end
```

## 4. Data Flow (Add Service Example)

1.  **User Action:** Clicks "Add Service" in Navbar dropdown.
2.  **Navbar:** Opens `AddServiceModal`.
3.  **User Action:** Fills form in `AddServiceModal` and clicks "Add Service".
4.  **AddServiceModal:** Sends POST request with form data to `/api/services` via `axiosInstance`.
5.  **Backend API (`/api/services`):**
    *   Receives request.
    *   (Should apply `authMiddleware`).
    *   Validates data.
    *   Uses `Service` model to save data (including `createdBy`) to MongoDB.
    *   Returns the newly created service object (or error).
6.  **AddServiceModal:**
    *   Receives response.
    *   If successful: Calls `onServiceAdded(newService)` prop, shows toast, closes.
    *   If error: Shows error toast.
7.  **App.jsx (`handleServiceAdded`):** Updates `services` state.
8.  **ServicePage:** Re-renders with the updated `services` prop.

## 5. Data Flow (Update Service Example)

1.  **User Action:** Clicks "Modify My Services" in Navbar.
2.  **Navbar:** Opens `ManageServicesModal`.
3.  **ManageServicesModal:** Fetches user's services (`GET /api/services/my-services`).
4.  **User Action:** Clicks "Edit" button for a service in the list.
5.  **ManageServicesModal:** Opens `EditServiceModal`, passing the selected service data.
6.  **User Action:** Modifies data in `EditServiceModal` and clicks "Save Changes".
7.  **EditServiceModal:** Sends PUT request with updated data to `/api/services/:id`.
8.  **Backend API (`PUT /api/services/:id`):**
    *   Receives request.
    *   Applies `authMiddleware` (route-specific).
    *   Finds service by ID.
    *   Verifies ownership (`service.createdBy === req.user.id`).
    *   Updates service in MongoDB.
    *   Returns updated service object.
9.  **EditServiceModal:**
    *   Receives response.
    *   If successful: Calls `onUpdateSuccess(updatedService)` prop. Shows toast. (Modal closure handled by parent).
    *   If error: Shows error toast.
10. **ManageServicesModal (`handleUpdateSuccess`):** Updates its internal `myServices` list, calls `onServiceUpdated(updatedService)` prop (passed from `App.jsx`), closes `EditServiceModal`.
11. **App.jsx (`handleServiceUpdated`):** Updates the main `services` state.
12. **ServicePage:** Re-renders if the updated service was visible in the main list.

## 6. Data Flow (Delete Service Example)

1.  **User Action:** Clicks "Modify My Services" in Navbar.
2.  **Navbar:** Opens `ManageServicesModal`.
3.  **ManageServicesModal:** Fetches user's services.
4.  **User Action:** Clicks "Delete" button for a service.
5.  **ManageServicesModal:** Opens `DeleteConfirmationModal`, passing the selected service.
6.  **User Action:** Clicks "Delete Service" in confirmation modal.
7.  **DeleteConfirmationModal:** Sends DELETE request to `/api/services/:id`.
8.  **Backend API (`DELETE /api/services/:id`):**
    *   Receives request.
    *   Applies `authMiddleware` (route-specific).
    *   Finds service by ID.
    *   Verifies ownership.
    *   Deletes service from MongoDB.
    *   Returns success message.
9.  **DeleteConfirmationModal:**
    *   Receives response.
    *   If successful: Calls `onDeleteSuccess(deletedServiceId)` prop. Shows toast. (Modal closure handled by parent).
    *   If error: Shows error toast.
10. **ManageServicesModal (`handleDeleteSuccess`):** Updates its internal `myServices` list, calls `onServiceDeleted(deletedServiceId)` prop (passed from `App.jsx`), closes `DeleteConfirmationModal`.
11. **App.jsx (`handleServiceDeleted`):** Updates the main `services` state by filtering out the deleted service.
12. **ServicePage:** Re-renders with the updated `services` prop.
