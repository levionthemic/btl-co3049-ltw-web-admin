import React, { useEffect, useState } from "react";
import axios from "axios";

const CustomerPage = () => {
  const [contacts, setContacts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalContacts, setTotalContacts] = useState(0);

  useEffect(() => {
    // Fetch data from the API
    const fetchContacts = async () => {
      try {
        const response = await axios.get(
          `http://localhost/public/api/contacts?page=${currentPage}&limit=${rowsPerPage}`
        );
        alert(JSON.stringify(response.data, null, 2));
        setContacts(response.data.contacts);
        setTotalContacts(response.data.total_contacts);
      } catch (error) {
        console.error("Error fetching contacts:", error);
        alert(response.data);
      }
    };

    fetchContacts();
  }, [currentPage, rowsPerPage]);

  const handleMarkAsRead = async (id) => {
    try {
      // Update the status to "read"
      await axios.put(`http://localhost/public/api/contacts/${id}`, {
        status: "read",
      });
      // Update the local state
      setContacts((prevContacts) =>
        prevContacts.map((contact) =>
          contact.id === id ? { ...contact, status: "read" } : contact
        )
      );
    } catch (error) {
      console.error("Error updating contact status:", error);
    }
  };

  const handleMarkAsResponded = async (id) => {
    try {
      // Update the status to "responded"
      await axios.put(`http://localhost/public/api/contacts/${id}`, {
        status: "responded",
      });
      // Update the local state
      setContacts((prevContacts) =>
        prevContacts.map((contact) =>
          contact.id === id ? { ...contact, status: "responded" } : contact
        )
      );
    } catch (error) {
      console.error("Error updating contact status to responded:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      // Delete the contact
      await axios.delete(`http://localhost/public/api/contacts/${id}`);
      // Update the local state
      setContacts((prevContacts) =>
        prevContacts.filter((contact) => contact.id !== id)
      );
    } catch (error) {
      console.error("Error deleting contact:", error);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleRowsPerPageChange = (e) => {
    setRowsPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset về trang đầu tiên khi thay đổi số hàng
  };

  const totalPages = Math.ceil(totalContacts / rowsPerPage);
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="section">
      <div className="card">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h4 className="card-title">Customer Contacts</h4>
          <div className="form-group">
            <label htmlFor="rowsPerPage" className="me-2">
              Rows per page:
            </label>
            <select
              id="rowsPerPage"
              className="form-select form-select-sm"
              value={rowsPerPage}
              onChange={handleRowsPerPageChange}
              style={{ width: "auto" }}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={15}>15</option>
            </select>
          </div>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Message</th>
                  <th>Status</th>
                  <th>Actions</th>
                  <th>Delete</th>
                </tr>
              </thead>
              <tbody>
                {contacts.map((contact) => (
                  <tr key={contact.id}>
                    <td>{contact.name}</td>
                    <td>{contact.email}</td>
                    <td>{contact.message}</td>
                    <td>
                      <span
                        className={`badge bg-${
                          contact.status === "unread" ? "warning" : "success"
                        }`}
                      >
                        {contact.status}
                      </span>
                    </td>
                    <td>
                      {contact.status === "unread" && (
                        <button
                          onClick={() => handleMarkAsRead(contact.id)}
                          className="btn btn-primary btn-sm"
                        >
                          Mark as Read
                        </button>
                      )}
                      {contact.status === "read" && (
                        <button
                          onClick={() => handleMarkAsResponded(contact.id)}
                          className="btn btn-success btn-sm"
                        >
                          Mark as Responded
                        </button>
                      )}
                    </td>
                    <td>
                      <button
                        onClick={() => handleDelete(contact.id)}
                        className="btn btn-danger btn-sm"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <nav aria-label="Page navigation" className="mt-4">
            <ul className="pagination justify-content-center">
              <li
                className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
              >
                <button
                  className="page-link"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
              </li>

              {pageNumbers.map((number) => (
                <li
                  key={number}
                  className={`page-item ${
                    currentPage === number ? "active" : ""
                  }`}
                >
                  <button
                    className="page-link"
                    onClick={() => handlePageChange(number)}
                  >
                    {number}
                  </button>
                </li>
              ))}

              <li
                className={`page-item ${
                  currentPage === totalPages ? "disabled" : ""
                }`}
              >
                <button
                  className="page-link"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default CustomerPage;
