# Product Context: Pet Community

## 1. Problem Solved

Users previously had no way to view or manage specific pet-related services offered within the community platform. Service information was either non-existent or hardcoded, lacking dynamic updates and user contribution.

## 2. How It Works

*   **Service Listing:** Users can navigate to a dedicated "Services" page to view a list of available pet services fetched dynamically from the database.
*   **Adding Services:** Logged-in users can open a modal ("Add Service" from Navbar) to input details (name, description, price, location, image URL). The service is saved with an association to the creating user (`createdBy`). The main service list updates automatically.
*   **Managing Own Services:** Logged-in users can open a separate modal ("Modify My Services" from Navbar). This modal lists only the services created by that user.
    *   **Editing:** Clicking "Edit" opens another modal pre-filled with the service's details, allowing modification. Changes are saved via a PUT request.
    *   **Deleting:** Clicking "Delete" opens a confirmation modal. If confirmed, the service is deleted via a DELETE request.
*   **Viewing Details:** Clicking on any service card (from the main list) navigates the user to a detail page (implementation pending).
*   **Data Flow:** Frontend (React) communicates with backend (Node.js/Express) API endpoints:
    *   `GET /api/services`: Fetch all public services.
    *   `POST /api/services`: Add a new service (requires auth).
    *   `GET /api/services/my-services`: Fetch services created by the logged-in user (requires auth).
    *   `PUT /api/services/:id`: Update a specific service (requires auth, user must own service).
    *   `DELETE /api/services/:id`: Delete a specific service (requires auth, user must own service).
    *   `GET /api/services/:id`: Fetch details for a single service.
    Data is stored in MongoDB.

## 3. User Experience Goals

*   **Discoverability:** Easily find and browse available pet services.
*   **Contribution & Management:** Allow authenticated users to easily add, edit, and delete their own services through intuitive modal forms.
*   **Real-time Updates:** Ensure the main service list reflects newly added, updated, or deleted services without requiring a manual page refresh.
*   **Ownership:** Clearly separate viewing all services from managing only the user's own services.
*   **Clarity:** Present service information clearly. Provide confirmation steps for destructive actions like deletion.
