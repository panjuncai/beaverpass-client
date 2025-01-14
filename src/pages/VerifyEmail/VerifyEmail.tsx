import apiClient from "@/utils/api";
import { Toast } from "antd-mobile";
import { log } from "console";
import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

const VerifyEmail: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // 获取 token 参数
  const token = searchParams.get("token");

  useEffect(() => {
    console.log(`Come verify page`);
    
    const verifyEmail = async () => {
      if (!token) {
        setMessage("Invalid verification link.");
        return;
      }

      try {
        await apiClient.get(
          `/users/verify?token=${token}`
        );
        Toast.show({
          icon: "success",
          content: "Verified Successfully!",
          duration: 3000,
        });
        setMessage("Verified Successfully!")
        navigate("/login");
      } catch (e) {
        Toast.show({ icon: "fail", content: e + "" });
        setMessage(e+"")
      }
    };

    verifyEmail();
  }, [token, navigate]);

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>Email Verification</h1>
      <p>{message}</p>
    </div>
  );
};

export default VerifyEmail;
