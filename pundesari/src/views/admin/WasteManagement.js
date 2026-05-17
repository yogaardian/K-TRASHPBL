import React, { useState, useEffect } from "react";
import { hargaAPI } from "../../services/api";

import {
  Card,
  Container,
  Row,
  Col,
  Button,
  Form,
  Table,
} from "react-bootstrap";

function WasteManagement() {
  const [garbageData, setGarbageData] = useState([]);
  const [loading, setLoading] = useState(true);

  // FILTER TABEL
  const [currentJenis, setCurrentJenis] =
    useState("anorganik");

  // STATUS EDIT
  const [isEditing, setIsEditing] = useState(false);

  // FORM DATA
  const [formData, setFormData] = useState({
    id: "",
    jenis: "anorganik",
    sub_jenis: "",
    harga: "",
  });

  // =========================================
  // FETCH DATA
  // =========================================
  const fetchData = async () => {
    setLoading(true);

    try {
      const response = await hargaAPI.getByJenis(currentJenis);

      if (Array.isArray(response.data)) {
        setGarbageData(response.data);
      } else {
        setGarbageData([]);
      }
    } catch (error) {
      console.error("Gagal mengambil data:", error);
      setGarbageData([]);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [currentJenis]);

  // =========================================
  // RESET FORM
  // =========================================
  const resetForm = () => {
    setFormData({
      id: "",
      jenis: currentJenis,
      sub_jenis: "",
      harga: "",
    });

    setIsEditing(false);
  };

  // =========================================
  // SIMPAN / UPDATE
  // =========================================
  const handleSave = async (e) => {
    if (e && e.preventDefault) {
      e.preventDefault();
    }

    // VALIDASI
    if (
      !formData.jenis ||
      !formData.sub_jenis ||
      !formData.harga
    ) {
      alert("Semua field wajib diisi");
      return;
    }

    try {
      const payload = {
        jenis: formData.jenis
          .toLowerCase()
          .trim(),

        sub_jenis:
          formData.sub_jenis.trim(),

        harga: parseInt(formData.harga),
      };

      // ================= UPDATE =================
      if (formData.id) {
        await hargaAPI.updateHarga(formData.id, payload);

        alert("Data berhasil diupdate");
      }

      // ================= INSERT =================
      else {
        await hargaAPI.addHarga(payload);

        alert(
          "Jenis sampah baru berhasil ditambahkan"
        );
      }

      // reload kategori aktif
      setCurrentJenis(payload.jenis);

      // reset form
      resetForm();

      // refresh data
      fetchData();
    } catch (error) {
      console.error(error);

      if (error.response) {
        console.log(error.response.data);
      }

      alert("Terjadi kesalahan server");
    }
  };

  // =========================================
  // HAPUS DATA
  // =========================================
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Yakin ingin menghapus data?"
    );

    if (!confirmDelete) return;

    try {
      await hargaAPI.deleteHarga(id);

      alert("Data berhasil dihapus");

      fetchData();
    } catch (error) {
      console.error(error);

      alert("Gagal menghapus data");
    }
  };

  // =========================================
  // EDIT DATA
  // =========================================
  const handleEdit = (item) => {
    setFormData({
      id: item.id,
      jenis: item.jenis,
      sub_jenis: item.sub_jenis,
      harga: item.harga,
    });

    setIsEditing(true);
  };

  return (
    <>
      <Container fluid>
        <Row>
          <Col md="12">
            <Card className="strpied-tabled-with-hover">
              {/* ========================================= */}
              {/* HEADER */}
              {/* ========================================= */}

              <Card.Header>
                <Card.Title as="h4">
                  Manajemen Data Sampah
                </Card.Title>

                <Row>
                  <Col md="3">
                    <Form.Select
                      className="mt-2"
                      value={currentJenis}
                      onChange={(e) =>
                        setCurrentJenis(
                          e.target.value
                        )
                      }
                    >
                      <option value="anorganik">
                        Anorganik
                      </option>

                      <option value="organik">
                        Organik
                      </option>

                      <option value="lainnya">
                        Lainnya
                      </option>
                    </Form.Select>
                  </Col>
                </Row>

                <p className="card-category mt-2">
                  Total tersedia:{" "}
                  {garbageData.length} data
                </p>
              </Card.Header>

              {/* ========================================= */}
              {/* BODY */}
              {/* ========================================= */}

              <Card.Body className="table-full-width table-responsive px-0">
                {/* ========================================= */}
                {/* INLINE FORM */}
                {/* ========================================= */}

                <div className="px-4 mb-4">
                  <Row className="align-items-end">

                    {/* NAMA SAMPAH */}
                    <Col md="3">
                      <Form.Group>
                        <Form.Label>
                          Nama Sampah
                        </Form.Label>

                        <Form.Control
                          type="text"
                          placeholder="Contoh: Botol Plastik"
                          value={
                            formData.sub_jenis
                          }
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              sub_jenis:
                                e.target.value,
                            })
                          }
                        />
                      </Form.Group>
                    </Col>

                    {/* HARGA */}
                    <Col md="3">
                      <Form.Group>
                        <Form.Label>
                          Harga per Kg
                        </Form.Label>

                        <Form.Control
                          type="number"
                          placeholder="Contoh: 5000"
                          value={formData.harga}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              harga:
                                e.target.value,
                            })
                          }
                        />
                      </Form.Group>
                    </Col>

                    {/* BUTTON */}
                    <Col md="3">
                      <Button
                        variant={
                          isEditing
                            ? "warning"
                            : "success"
                        }
                        className="btn-fill"
                        onClick={handleSave}
                      >
                        {isEditing
                          ? "Update Data"
                          : "Tambah Data"}
                      </Button>

                      {isEditing && (
                        <Button
                          variant="secondary"
                          className="btn-fill ml-2"
                          onClick={resetForm}
                        >
                          Batal
                        </Button>
                      )}
                    </Col>
                  </Row>
                </div>

                {/* ========================================= */}
                {/* TABLE */}
                {/* ========================================= */}

                <Table className="table-hover table-striped">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Kategori</th>
                      <th>Nama Sampah</th>
                      <th>Harga / Kg</th>
                      <th>Aksi</th>
                    </tr>
                  </thead>

                  <tbody>
                    {/* LOADING */}
                    {loading ? (
                      <tr>
                        <td
                          colSpan="5"
                          className="text-center"
                        >
                          Memuat data...
                        </td>
                      </tr>
                    ) : garbageData.length ===
                      0 ? (
                      /* DATA KOSONG */
                      <tr>
                        <td
                          colSpan="5"
                          className="text-center"
                        >
                          Data kosong
                        </td>
                      </tr>
                    ) : (
                      /* DATA ADA */
                      garbageData.map(
                        (item, index) => (
                          <tr
                            key={
                              item.id || index
                            }
                          >
                            <td>{item.id}</td>

                            <td>
                              {item.sub_jenis}
                            </td>

                            <td>
                              Rp{" "}
                              {item.harga
                                ? parseInt(
                                    item.harga
                                  ).toLocaleString()
                                : 0}
                            </td>

                            <td>
                              {/* EDIT */}
                              <Button
                                variant="warning"
                                size="sm"
                                className="mr-2 btn-fill"
                                onClick={() =>
                                  handleEdit(
                                    item
                                  )
                                }
                              >
                                Edit
                              </Button>

                              {/* DELETE */}
                              <Button
                                variant="danger"
                                size="sm"
                                className="btn-fill"
                                onClick={() =>
                                  handleDelete(
                                    item.id
                                  )
                                }
                              >
                                Hapus
                              </Button>
                            </td>
                          </tr>
                        )
                      )
                    )}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default WasteManagement;