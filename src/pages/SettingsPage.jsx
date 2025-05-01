import { useState, useEffect } from "react";
import axios from "axios";

const SettingsPage = () => {
  const [formData, setFormData] = useState({
    hotelName: "",
    phoneNumber: "",
    address: "",
    logo: null,
    currentLogoPath: "/uploads/current-logo.png",
  });

  const [isSubmited, setIsSubmited] = useState(false);

  useEffect(() => {
    axios
      .get("http://localhost/public/api/settings/latest")
      .then((response) => {
        const data = response.data;
        setFormData({
          hotelName: data.hotel_name || "",
          phoneNumber: data.phone_number || "",
          address: data.address || "",
          logo: null,
          currentLogoPath: data.logo_path
            ? `http://localhost/public/uploads/${data.logo_path}`
            : "",
        });
      })
      .catch((error) => {
        console.error(
          "Error fetching settings:",
          error.response?.data || error.message
        );
      });
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, logo: e.target.files[0] });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    formDataToSend.append("hotel_name", formData.hotelName);
    formDataToSend.append("phone_number", formData.phoneNumber);
    formDataToSend.append("address", formData.address);
    if (formData.logo) {
      formDataToSend.append("logo", formData.logo);
    }

    axios
      .post("http://localhost/public/api/settings", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        console.log("API Response:", response.data);
        setIsSubmited(true);
      })
      .catch((error) => {
        console.log("API Response:", JSON.stringify(error));
        console.error("API Error:", error.response?.data || error.message);
      });
  };

  return (
    <div className="section">
      <div className="card">
        <div className="card-header">
          <h4 className="card-title">Settings</h4>
        </div>
        <div className="card-body">
          {!isSubmited ? (
            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-12">
                  <div className="form-group mb-3">
                    <label htmlFor="hotelName" className="form-label">
                      Hotel Name:
                    </label>
                    <input
                      type="text"
                      id="hotelName"
                      name="hotelName"
                      required
                      value={formData.hotelName}
                      onChange={handleInputChange}
                      className="form-control"
                    />
                  </div>
                </div>

                <div className="col-12">
                  <div className="form-group mb-3">
                    <label htmlFor="phoneNumber" className="form-label">
                      Phone Number:
                    </label>
                    <input
                      type="text"
                      id="phoneNumber"
                      name="phoneNumber"
                      required
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      className="form-control"
                    />
                  </div>
                </div>

                <div className="col-12">
                  <div className="form-group mb-3">
                    <label htmlFor="address" className="form-label">
                      Address:
                    </label>
                    <textarea
                      id="address"
                      name="address"
                      required
                      value={formData.address}
                      onChange={handleInputChange}
                      className="form-control"
                      rows="4"
                    ></textarea>
                  </div>
                </div>

                <div className="col-12">
                  <div className="form-group mb-3">
                    <label htmlFor="logo" className="form-label">
                      Logo:
                    </label>
                    {formData.currentLogoPath && (
                      <div className="mb-2">
                        <img
                          src={formData.currentLogoPath}
                          alt="Current Logo"
                          className="img-thumbnail"
                          style={{ maxWidth: "200px" }}
                        />
                      </div>
                    )}
                    <input
                      type="file"
                      id="logo"
                      name="logo"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="form-control"
                    />
                    <small className="form-text text-muted">
                      Leave empty to keep current logo
                    </small>
                  </div>
                </div>

                <div className="col-12">
                  <div className="d-flex justify-content-end">
                    <button type="submit" className="btn btn-primary">
                      Submit
                    </button>
                  </div>
                </div>
              </div>
            </form>
          ) : (
            <div className="text-center">
              <h2 className="mb-4">Settings Updated Successfully!</h2>
              <p className="text-muted mb-4">
                Your settings have been saved. You can make further changes if
                needed.
              </p>
              <button
                onClick={() => setIsSubmited(false)}
                className="btn btn-primary"
              >
                Edit Settings
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
