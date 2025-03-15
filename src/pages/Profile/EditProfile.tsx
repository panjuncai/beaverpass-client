import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import CenteredLoading from "@/components/CenterLoading";
import { useUpdateUserMutation } from "@/services/userApi";
import AddressModal from "@/components/AddressModal/AddressModal";
import { Toast } from "antd-mobile";
const EditProfile: React.FC = () => {
  const { session, isAuthenticated, isLoading: isLoadingAuth } = useAuth();
  const navigate = useNavigate();
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      void navigate("/login", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (session?.user?.id) {
      setFirstName(session?.user?.user_metadata.firstName || "");
      setLastName(session?.user?.user_metadata.lastName || "");
      setAddress(session?.user?.user_metadata.address || "");
      setPhone(session?.user?.user_metadata.phone || "");
    }
  }, [session]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user?.id) return;

    try {
      await updateUser({
        userId: session?.user?.id,
        firstName,
        lastName,
        address,
        phone,
      }).unwrap();
      
      // 显示成功消息
      Toast.show({
        content: "OK",
        icon: "success",
      });
      console.log("Profile updated successfully!");
    } catch (error) {
      Toast.show({
        content: "Failed to update profile. Please try again.",
        icon: "fail",
      });
      console.error("Failed to update profile:", error);
      console.log("Failed to update profile. Please try again."+JSON.stringify(error));
    }
  };

  const handleAddressSelect = (selectedAddress: string) => {
    setAddress(selectedAddress);
    setIsAddressModalOpen(false);
  };

  if (isUpdating||isLoadingAuth) return <CenteredLoading />;

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Edit Profile</h1>
      
      <form onSubmit={(e)=>void handleSubmit(e)} className="space-y-6">
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
            <span className="label-text">Phone</span>
          </label>
          <input
            type="text" 
            className="input input-bordered"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
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
        key={isAddressModalOpen ? 'open' : 'closed'}
        isOpen={isAddressModalOpen}
        onClose={() => setIsAddressModalOpen(false)}
        onSelect={handleAddressSelect}
        initialAddress={address}
        isSave={false}
      />
    </div>
  );
};

export default EditProfile; 