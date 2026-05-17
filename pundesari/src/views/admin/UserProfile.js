import React, { useState, useEffect } from "react";
import { usersAPI } from "../../services/api";

// react-bootstrap components
import {
  Button,
  Card,
  Form,
  Container,
  Row,
  Col,
  Table,
  InputGroup,
} from "react-bootstrap";

function User() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await usersAPI.getUsersByRole('user');
        setUsers(response.data);
      } catch (error) {
        console.error('Failed to fetch users:', error);
      }
      setLoading(false);
    };
    fetchUsers();
  }, []);

  return (
    <>
      <Container fluid>
        <Row>
          <Col md="12">
            <Card>
              <Card.Body>
                <Row className="align-items-center">
                  <Col md="8">
                    <h4 className="title">Data Costumer</h4>
                    <p className="card-category">Total costumer = {users.length} orang</p>
                  </Col>
                  <Col md="4" className="text-md-right">
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row>
          <Col md="12">
            <Card>
              <Card.Body>
                <Row className="align-items-center mb-3">
                  <Col md="6" className="mb-2 mb-md-0">
                    <InputGroup>
                      <Form.Control placeholder="Cari User" type="text" />
                    </InputGroup>
                  </Col>
                  <Col md="6" className="text-md-right">
                    <Button variant="outline-secondary">Filter</Button>
                  </Col>
                </Row>

                <div className="table-responsive">
                  <Table className="table-hover table-striped">
                    <thead>
                      <tr>
                        <th className="border-0">Kode</th>
                        <th className="border-0">Nama</th>
                        <th className="border-0">Jumlah Sampah (Kg)</th>
                        <th className="border-0">Alamat</th>
                        <th className="border-0">Saldo</th>
                        <th className="border-0">Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? (
                        <tr><td colSpan="6" className="text-center">Memuat data...</td></tr>
                      ) : users.length === 0 ? (
                        <tr><td colSpan="6" className="text-center">Data Kosong</td></tr>
                      ) : (
                        users.map((user, index) => (
                          <tr key={user.id}>
                            <td>{user.id}</td>
                            <td>{user.nama}</td>
                            <td>-</td> {/* Placeholder, need to calculate */}
                            <td>-</td> {/* Placeholder */}
                            <td>-</td> {/* Placeholder */}
                            <td>
                              <Button
                                variant="warning"
                                size="sm"
                                className="mr-2"
                              >
                                Edit
                              </Button>
                              <Button variant="danger" size="sm">
                                Hapus
                              </Button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </Table>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default User;
