import apiClient from "@/api/api";
import { Toast } from "antd-mobile";
import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

const VerifyEmail: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // get token
  const token = searchParams.get("token");

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setMessage("Invalid verification link.");
        return;
      }

      try {
        await apiClient.get(`/auth/verify?token=${token}`);
        Toast.show({
          icon: "success",
          content: "Verify Successfully!",
          duration: 2000,
        });
        setMessage("Verified Successfully!");
        const timerId = setTimeout(() => {
          void navigate("/login", { replace: true });
        }, 2000);

        return () => clearTimeout(timerId);
      } catch (e) {
        Toast.show({ icon: "fail", content: e + "" });
        setMessage(e + "");
      }
    };

    verifyEmail();
  }, []);

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>Email Verification</h1>
      <p>{message}</p>
    </div>
  );
};

export default VerifyEmail;
