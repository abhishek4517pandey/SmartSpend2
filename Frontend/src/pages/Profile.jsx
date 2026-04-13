import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext.jsx";
import StreakComponent from "../components/StreakComponent.jsx";

const PREBUILT_AVATARS = [
  { id: '1', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=avatar1' },
  { id: '2', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=avatar2' },
  { id: '3', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=avatar3' },
  { id: '4', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=avatar4' },
  { id: '5', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=avatar5' },
  { id: '6', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=avatar6' },
  { id: '7', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=avatar7' },
  { id: '8', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=avatar8' }
];

const Profile = () => {
  const { user } = useContext(AuthContext);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    college: "",
    course: "",
    semester: "",
    monthlyBudget: "",
    avatarType: "prebuilt",
    avatarData: "1"
  });
  const [notifications, setNotifications] = useState({
    monthlyReport: true,
    budgetAlerts: true,
    budgetThreshold50: true,
    budgetThreshold80: true
  });
  const [showAvatarModal, setShowAvatarModal] = useState(false);

  useEffect(() => {
    if (!user) {
      setForm((prev) => ({
        ...prev,
        name: "",
        email: ""
      }));
      return;
    }

    setForm((prev) => ({
      ...prev,
      name: user.name || "",
      email: user.email || "",
      avatarType: "prebuilt",
      avatarData: "1"
    }));

    const fetchProfile = async () => {
      try {
        const res = await api.get("/profile");
        if (res.data) {
          setForm({
            name: res.data.name || user.name || "",
            email: res.data.email || user.email || "",
            phone: res.data.phone || "",
            college: res.data.college || "",
            course: res.data.course || "",
            semester: res.data.semester || "",
            monthlyBudget: res.data.monthlyBudget || "",
            avatarType: res.data.avatarType || "prebuilt",
            avatarData: res.data.avatarData || "1"
          });
        }
      } catch (err) {
        console.error(err);
      }
    };

    const fetchNotificationPreferences = async () => {
      try {
        const res = await api.get("/emails/preferences");
        setNotifications(res.data || {});
      } catch (err) {
        console.error("Error fetching notification preferences:", err);
      }
    };

    fetchProfile();
    fetchNotificationPreferences();
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarSelect = (type, data) => {
    setForm((prev) => ({ ...prev, avatarType: type, avatarData: data }));
    setShowAvatarModal(false);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        handleAvatarSelect('upload', e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const getAvatarUrl = () => {
    if (form.avatarType === 'upload') {
      return form.avatarData;
    } else {
      const avatar = PREBUILT_AVATARS.find(a => a.id === form.avatarData);
      return avatar ? avatar.url : PREBUILT_AVATARS[0].url;
    }
  };

  const handleSave = async () => {
    try {
      const body = {
        ...form,
        monthlyBudget: form.monthlyBudget
          ? Number(form.monthlyBudget)
          : undefined
      };
      const res = await api.post("/profile", body);
      setForm((prev) => ({
        ...prev,
        monthlyBudget: res.data.monthlyBudget || "",
        avatarType: res.data.avatarType || "prebuilt",
        avatarData: res.data.avatarData || "1"
      }));

      // Save notification preferences
      await api.put("/emails/preferences", notifications);

      alert("Profile and preferences saved successfully");
    } catch (err) {
      console.error(err);
      alert("Error saving profile");
    }
  };

  if (!user) {
    return (
      <div className="page">
        <h1>Profile</h1>
        <p className="subtitle">
          You need to be signed in to edit profile details.
        </p>
        <p>
          <Link to="/login">Login</Link> or <Link to="/register">register</Link>{" "}
          to continue.
        </p>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="profile-header">
        <div className="profile-avatar">
          <img src={getAvatarUrl()} alt="Profile" />
          <button
            className="edit-avatar-btn"
            onClick={() => setShowAvatarModal(true)}
            title="Edit Avatar"
          >
            ✏️
          </button>
        </div>
        <div>
          <h1>{form.name || "Profile"}</h1>
          <p className="subtitle">
            Add or update your personal details and default monthly budget.
          </p>
        </div>
      </div>

      <div className="form-grid">
        <div className="form-group mb-4">
          <label>Name</label>
          <input
            className="h-12 w-full px-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Your name"
          />
        </div>
        <div className="form-group mb-4">
          <label>Email</label>
          <input
            className="h-12 w-full px-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="you@example.com"
          />
        </div>
        <div className="form-group mb-4">
          <label>Phone</label>
          <input
            className="h-12 w-full px-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="Mobile number"
          />
        </div>
        <div className="form-group mb-4">
          <label>College / University</label>
          <input
            className="h-12 w-full px-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400"
            name="college"
            value={form.college}
            onChange={handleChange}
            placeholder="Your college"
          />
        </div>
        <div className="form-group mb-4">
          <label>Course</label>
          <input
            className="h-12 w-full px-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400"
            name="course"
            value={form.course}
            onChange={handleChange}
            placeholder="e.g., B.Tech CSE"
          />
        </div>
        <div className="form-group mb-4">
          <label>Semester / Year</label>
          <input
            className="h-12 w-full px-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400"
            name="semester"
            value={form.semester}
            onChange={handleChange}
            placeholder="e.g., 7th semester"
          />
        </div>
        <div className="form-group mb-4">
          <label>Default Monthly Budget (₹)</label>
          <input
            className="h-12 w-full px-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400"
            type="number"
            name="monthlyBudget"
            value={form.monthlyBudget}
            onChange={handleChange}
            placeholder="e.g., 5000"
          />
        </div>
      </div>

      <div className="notification-preferences">
        <h2>Notification Preferences</h2>
        <div className="toggle-group">
          <label>
            <input
              type="checkbox"
              checked={notifications.monthlyReport}
              onChange={(e) => setNotifications((prev) => ({ ...prev, monthlyReport: e.target.checked }))}
            />
            Receive monthly expense report emails
          </label>
          <label>
            <input
              type="checkbox"
              checked={notifications.budgetAlerts}
              onChange={(e) => setNotifications((prev) => ({ ...prev, budgetAlerts: e.target.checked }))}
            />
            Receive budget alert emails
          </label>
          <label>
            <input
              type="checkbox"
              checked={notifications.budgetThreshold50}
              onChange={(e) => setNotifications((prev) => ({ ...prev, budgetThreshold50: e.target.checked }))}
            />
            Send alert at 50% budget usage
          </label>
          <label>
            <input
              type="checkbox"
              checked={notifications.budgetThreshold80}
              onChange={(e) => setNotifications((prev) => ({ ...prev, budgetThreshold80: e.target.checked }))}
            />
            Send alert at 80% budget usage
          </label>
        </div>
      </div>

      <StreakComponent />

      <div className="profile-action-row">
        <button className="primary-button save-profile-button" onClick={handleSave}>
          Save Profile
        </button>
      </div>

      {showAvatarModal && (
        <div className="modal-overlay" onClick={() => setShowAvatarModal(false)}>
          <div className="avatar-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Choose Avatar</h3>
            <div className="avatar-options">
              <div className="upload-option">
                <label className="upload-btn">
                  📁 Upload Image
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    style={{ display: 'none' }}
                  />
                </label>
              </div>
              <div className="prebuilt-avatars">
                <h4>Pre-built Avatars</h4>
                <div className="avatar-grid">
                  {PREBUILT_AVATARS.map((avatar) => (
                    <img
                      key={avatar.id}
                      src={avatar.url}
                      alt={`Avatar ${avatar.id}`}
                      className={`avatar-option ${form.avatarType === 'prebuilt' && form.avatarData === avatar.id ? 'selected' : ''}`}
                      onClick={() => handleAvatarSelect('prebuilt', avatar.id)}
                    />
                  ))}
                </div>
              </div>
            </div>
            <button className="close-modal-btn" onClick={() => setShowAvatarModal(false)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;