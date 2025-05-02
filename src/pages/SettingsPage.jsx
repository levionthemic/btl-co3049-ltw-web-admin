import { useState, useEffect } from "react";
import axios from "axios";
import sanitizeInput from "../utils/inputSanitizer.js";

const SettingsPage = () => {
  const [formData, setFormData] = useState({
    hotelName: "",
    phoneNumber: "",
    address: "",
    logo: null,
    currentLogoPath: "/uploads/current-logo.png",
  });

  const [isSubmited, setIsSubmited] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewImage, setPreviewImage] = useState(null);

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
    setFormData({ ...formData, [name]: sanitizeInput(value) });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Kiểm tra kích thước file (ví dụ: tối đa 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("File size should be less than 5MB");
        return;
      }

      // Kiểm tra định dạng file
      const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
      if (!allowedTypes.includes(file.type)) {
        alert("Only JPG, PNG and GIF files are allowed");
        return;
      }

      // Tạo URL preview cho ảnh
      const imageUrl = URL.createObjectURL(file);
      setPreviewImage(imageUrl);
      setFormData({ ...formData, logo: file });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    formDataToSend.append("hotel_name", sanitizeInput(formData.hotelName));
    formDataToSend.append("phone_number", sanitizeInput(formData.phoneNumber));
    formDataToSend.append("address", sanitizeInput(formData.address));

    if (formData.logo) {
      formDataToSend.append("logo", formData.logo);
    }

    axios
      .post("http://localhost/public/api/settings", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percentCompleted);
        },
      })
      .then((response) => {
        console.log("API Response:", response.data);
        setIsSubmited(true);
        setUploadProgress(0);

        // Cập nhật đường dẫn ảnh mới nếu có
        if (response.data.logo_path) {
          setFormData((prev) => ({
            ...prev,
            currentLogoPath: `http://localhost/public/uploads/${response.data.logo_path}`,
          }));
        }
      })
      .catch((error) => {
        console.error("API Error:", error.response?.data || error.message);
        alert("Error uploading file. Please try again.");
      });
  };

  // Cleanup preview URL khi component unmount
  useEffect(() => {
    return () => {
      if (previewImage) {
        URL.revokeObjectURL(previewImage);
      }
    };
  }, [previewImage]);

  return (
    <div className="section">
      <div className="card">
        <div className="card-header">
          <h4 className="card-title">Hotel Settings</h4>
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
                    <div className="mb-2">
                      {previewImage ? (
                        <img
                          src={previewImage}
                          alt="Preview"
                          className="img-thumbnail"
                          style={{ maxWidth: "200px" }}
                        />
                      ) : formData.currentLogoPath ? (
                        <img
                          src={formData.currentLogoPath}
                          alt="Current Logo"
                          className="img-thumbnail"
                          style={{ maxWidth: "200px" }}
                        />
                      ) : null}
                    </div>
                    <input
                      type="file"
                      id="logo"
                      name="logo"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="form-control"
                    />
                    <small className="form-text text-muted">
                      Leave empty to keep current logo. Maximum file size: 5MB.
                      Allowed formats: JPG, PNG, GIF
                    </small>
                    {uploadProgress > 0 && uploadProgress < 100 && (
                      <div className="progress mt-2">
                        <div
                          className="progress-bar progress-bar-striped progress-bar-animated"
                          role="progressbar"
                          style={{ width: `${uploadProgress}%` }}
                          aria-valuenow={uploadProgress}
                          aria-valuemin="0"
                          aria-valuemax="100"
                        >
                          {uploadProgress}%
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="col-12">
                  <div className="d-flex justify-content-end">
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={uploadProgress > 0 && uploadProgress < 100}
                    >
                      {uploadProgress > 0 && uploadProgress < 100
                        ? "Uploading..."
                        : "Submit"}
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
