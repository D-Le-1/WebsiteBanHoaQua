import React, { useEffect, useState } from "react";
import Sidebar from "../sidebar/sideBar";
import { editProfile } from "../../useQuery/api/api";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

const ProfilePage: React.FC = () => {
  const [user, setUser] = useState(null); // Khởi tạo user là null
  const [openModal, setOpenModal] = useState(false);
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    avatar: null,
    avatarPreview: "",
    name: "",
    phone: "",
    address: "",
  });

  // Lấy dữ liệu user từ localStorage khi component mount
  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("user"));
    if (savedUser) {
      setUser(savedUser);
      setFormData({
        avatar: null,
        avatarPreview: savedUser.avatar || "",
        name: savedUser.name || "",
        phone: savedUser.phone || "",
        address: savedUser.address || "",
      });
    }
  }, []);

  // Mutation để gửi dữ liệu lên API
  const mutation = useMutation({
    mutationFn: editProfile,
    onSuccess: (data) => {
      toast.success("Update profile successfully");
      // Cập nhật user với dữ liệu trả về từ API
      const updatedUser = {
        ...user,
        ...data.user, // Dữ liệu từ API (đảm bảo dùng user từ response)
      };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);
      setOpenModal(false);
      setTimeout(()=>{
        window.location.reload()
      }, 1000)
    },
    onError: (error) => {
      console.error("Error updating profile:", error);
      toast.error("Error updating profile");
      // Rollback: Hoàn tác thay đổi trong localStorage và state user
      const savedUser = JSON.parse(localStorage.getItem("userBackup"));
      localStorage.setItem("user", JSON.stringify(savedUser));
      setUser(savedUser);
    },
  });

  // Xử lý thay đổi input trong form
  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "avatar") {
      const file = files[0];
      if (file) {
        const previewUrl = URL.createObjectURL(file);
        setFormData((prev) => ({
          ...prev,
          avatar: file,
          avatarPreview: previewUrl,
        }));
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Xử lý submit form
  const handleUpdateProfile = (e) => {
    e.preventDefault();

    // Kiểm tra validation đơn giản
    if (!formData.name || !formData.phone || !formData.address) {
      toast.error("Please fill in all required fields");
      return;
    }

    localStorage.setItem("userBackup", JSON.stringify(user));
    localStorage.removeItem("userBackup")

    const updatedUser = {
      ...user,
      name: formData.name,
      phone: formData.phone,
      address: formData.address,
      avatar: formData.avatarPreview || user.avatar,
    };
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setUser(updatedUser);

    // Tạo FormData để gửi lên API
    const data = new FormData();
    if (formData.avatar) {
      data.append("avatar", formData.avatar);
    }
    data.append("name", formData.name);
    data.append("phone", formData.phone);
    data.append("address", formData.address);

    // Gửi dữ liệu lên API
    mutation.mutate(data);
  };

  // Đóng modal và reset preview
  const handleCloseModal = () => {
    setOpenModal(false);
    if (formData.avatarPreview) {
      URL.revokeObjectURL(formData.avatarPreview); // Giải phóng bộ nhớ
    }
    setFormData((prev) => ({
      ...prev,
      avatar: null,
      avatarPreview: user?.avatar || "",
    }));
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-10">
      <div className="space-x-2">
        <span className="text-sm text-zinc-500">Home /</span>
        <span className="text-sm">My Account</span>
      </div>
      <div className="flex space-x-44">
        <Sidebar />
        <div className="bg-white p-6 rounded-lg justify-center shadow-lg h-full w-full">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <img
                crossorigin="anonymous | use-credentials"
                src={user?.avatar}
                alt="Avatar"
                className="w-10 h-10 rounded-full mr-3 object-cover"
              />
              <div>
                <p className="text-lg font-semibold">{user?.name || "N/A"}</p>
                <p className="text-sm text-gray-500">{user?.email || "N/A"}</p>
              </div>
            </div>
            <button className="text-gray-500 hover:text-gray-700">×</button>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label className="text-gray-600">{t("my_account.profile.name")}</label>
              <p className="text-gray-800">{user?.name || "N/A"}</p>
            </div>
            <hr className="border-gray-200" />
            <div className="flex justify-between items-center">
              <label className="text-gray-600">{t("my_account.profile.email")}</label>
              <p className="text-gray-800">{user?.email || "N/A"}</p>
            </div>
            <hr className="border-gray-200" />
            <div className="flex justify-between items-center">
              <label className="text-gray-600">{t("my_account.profile.phone")}</label>
              <p className="text-gray-800">{user?.phone || "N/A"}</p>
            </div>
            <hr className="border-gray-200" />
            <div className="flex justify-between items-center">
              <label className="text-gray-600">{t("my_account.profile.address")}</label>
              <p className="text-gray-800">{user?.address || "N/A"}</p>
            </div>
          </div>
          <div>
            <button
              onClick={() => setOpenModal(true)}
              className="mt-6 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
            >
              {t("my_account.profile.changeProfile")}
            </button>
          </div>
          {openModal && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <div className="bg-white p-6 rounded-lg w-1/3">
                <h2 className="text-xl font-bold mb-4">{t("my_account.profile.changeProfile")}</h2>
                <form onSubmit={handleUpdateProfile}>
                  <div className="space-y-4">
                    <div>
                      <label className="block mb-2">
                        Avatar: <span className="text-red-500">*</span>
                      </label>
                      {formData.avatarPreview && (
                        <img
                          src={formData.avatarPreview}
                          alt="Avatar Preview"
                          className="w-16 h-16 rounded-full mb-2 object-cover"
                        />
                      )}
                      <input
                        type="file"
                        name="avatar"
                        accept="image/*"
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                      />
                    </div>
                    <div>
                      <label className="block mb-2">
                        {t("my_account.profile.name")}: <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                      />
                    </div>
                    <div>
                      <label className="block mb-2">
                        {t("my_account.profile.phone")}: <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                      />
                    </div>
                    <div>
                      <label className="block mb-2">
                        {t("my_account.profile.address")}: <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end mt-4">
                    <button
                      type="button"
                      className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg mr-2 hover:bg-gray-400"
                      onClick={handleCloseModal}
                    >
                      Cancel
                    </button>
                    <button
                      disabled={mutation.isLoading}
                      type="submit"
                      className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                    >
                      {mutation.isLoading ? "Saving..." : "Save"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;