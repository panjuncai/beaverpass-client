import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import CenteredLoading from "@/components/CenterLoading";
import { useUpdateUserMutation, useGetUserProfileQuery } from "@/services/userApi";
import AddressModal from "@/components/AddressModal/AddressModal";

const EditProfile: React.FC = () => {
  const { loginUser, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();
  const { data: userProfile, isLoading } = useGetUserProfileQuery(loginUser?._id ?? "", {
    skip: !loginUser?._id,
  });

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [address, setAddress] = useState("");
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (userProfile) {
      setFirstName(userProfile.firstName || "");
      setLastName(userProfile.lastName || "");
      setAddress(userProfile.address || "");
    }
  }, [userProfile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginUser?._id) return;

    try {
      await updateUser({
        userId: loginUser._id,
        firstName,
        lastName,
        address,
      }).unwrap();
      
      // 显示成功消息
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Failed to update profile:", error);
      alert("Failed to update profile. Please try again.");
    }
  };

  const handleAddressSelect = (selectedAddress: string) => {
    setAddress(selectedAddress);
    setIsAddressModalOpen(false);
  };

  if (isLoading) return <CenteredLoading />;

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Edit Profile</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="form-control">
          <label className="label">
            <span className="label-text">First Name</span>
          </label>
          <input
            type="text"
            className="input input-bordered"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </div>
        
        <div className="form-control">
          <label className="label">
            <span className="label-text">Last Name</span>
          </label>
          <input
            type="text"
            className="input input-bordered"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </div>
        
        <div className="form-control">
          <label className="label">
            <span className="label-text">Address</span>
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              className="input input-bordered flex-1"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              readOnly
              onClick={() => setIsAddressModalOpen(true)}
            />
            <button 
              type="button" 
              className="btn btn-outline"
              onClick={() => setIsAddressModalOpen(true)}
            >
              Select
            </button>
          </div>
        </div>
        
        <div className="form-control mt-6">
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={isUpdating}
          >
            {isUpdating ? <span className="loading loading-spinner"></span> : "Save Changes"}
          </button>
        </div>
      </form>

      {/* 地址选择模态框 */}
      <AddressModal
        isOpen={isAddressModalOpen}
        onClose={() => setIsAddressModalOpen(false)}
        onSelect={handleAddressSelect}
        initialAddress={address}
      />
    </div>
  );
};

export default EditProfile; 