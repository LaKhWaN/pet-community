import React, { useState } from "react"; // Import useState
import { Container, Nav, Navbar, Button, NavDropdown } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import AddServiceModal from "./AddServiceModal";
// Import the ManageServicesModal
import ManageServicesModal from "./ManageServicesModal";

export default function AppNavbar({
  onServiceAdded,
  onServiceUpdated,
  onServiceDeleted,
}) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showAddServiceModal, setShowAddServiceModal] = useState(false);
  const [showManageServicesModal, setShowManageServicesModal] = useState(false); // State for manage modal

  const handleShowAddServiceModal = () => {
    if (!user) {
      toast.info("Please log in to add a service.");
      navigate("/login"); // Redirect to login if not logged in
      return;
    }
    setShowAddServiceModal(true);
  };
  const handleCloseAddServiceModal = () => setShowAddServiceModal(false);

  const handleShowManageServicesModal = () => {
    if (!user) {
      // This check might be redundant if the option is only shown when logged in, but good practice
      toast.info("Please log in to manage your services.");
      navigate("/login");
      return;
    }
    setShowManageServicesModal(true);
  };
  const handleCloseManageServicesModal = () =>
    setShowManageServicesModal(false);

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully!");
    navigate("/");
  };

  return (
    <Navbar bg="light" expand="lg" className="shadow-sm">
      <Container>
        <Navbar.Brand as={Link} to="/">
          🐾 PetCare
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link as={Link} to="/">
              Home
            </Nav.Link>
            {/* Services Dropdown */}
            <NavDropdown title="Services" id="basic-nav-dropdown">
              <NavDropdown.Item as={Link} to="/services">
                Show Services
              </NavDropdown.Item>
              {/* Only show Add/Modify options if user is logged in */}
              {user && (
                <>
                  {" "}
                  {/* Add React Fragment wrapper */}
                  <NavDropdown.Item onClick={handleShowAddServiceModal}>
                    Add Service
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item onClick={handleShowManageServicesModal}>
                    Modify My Services
                  </NavDropdown.Item>
                </>
              )}
            </NavDropdown>
            {/* <Nav.Link as={Link} to="/community">
              Community
            </Nav.Link> */}
            <Nav.Link as={Link} to="/forum">
              Forums
            </Nav.Link>
            <Nav.Link as={Link} to="/contact">
              Contact
            </Nav.Link>
            {user ? (
              <>
                <Nav.Link as={Link} to="/profile">
                  {user.name}
                </Nav.Link>
                <Button
                  variant="outline-danger"
                  className="ms-2"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/login">
                  Login
                </Nav.Link>
                <Nav.Link as={Link} to="/register">
                  Register
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>

      {/* Render the modal */}
      <AddServiceModal
        show={showAddServiceModal}
        handleClose={handleCloseAddServiceModal}
        onServiceAdded={onServiceAdded}
      />

      {/* Render the Manage Services modal */}
      {/* Render only if user is logged in to potentially avoid unnecessary fetches if modal logic doesn't handle it */}
      {user && (
        <ManageServicesModal
          show={showManageServicesModal}
          handleClose={handleCloseManageServicesModal}
          onServiceUpdated={onServiceUpdated} // Pass down the handler
          onServiceDeleted={onServiceDeleted} // Pass down the handler
        />
      )}
    </Navbar>
  );
}
