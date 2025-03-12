import React from "react";
import { Container, Row, Col } from "react-bootstrap";

export default function Footer() {
  return (
    <footer className="bg-light py-4 mt-5">
      <Container>
        <Row>
          <Col md={6} className="text-center text-md-start">
            <p className="mb-0">
              &copy; {new Date().getFullYear()} PetCare. All rights reserved.
            </p>
          </Col>
          <Col md={6} className="text-center text-md-end">
            <a href="/privacy" className="me-3 text-decoration-none text-dark">
              Privacy Policy
            </a>
            <a href="/terms" className="text-decoration-none text-dark">
              Terms of Service
            </a>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}
