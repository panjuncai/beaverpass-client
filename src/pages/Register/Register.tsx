import { useState } from "react";
import { Input, Button, Space, Form, Toast, NavBar } from "antd-mobile";
import Logo from "@/components/Logo/Logo";
import { registerUser } from "@/services/userService";
import { RegisterRequest } from "@/types/user";
import { replace, useNavigate } from "react-router-dom";
import { usePageTitle } from "@/hooks/usePageTitle";

interface State {
  email: string;
  password: string;
  confirmPassword: string;
  error: string;
}

const styles: { innerContainer: React.CSSProperties } = {
  innerContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
  },
};

const Register: React.FC = () => {
  usePageTitle();
  const [state, setState] = useState<State>({
    email: "",
    password: "",
    confirmPassword: "",
    error: "",
  });

  const navigate = useNavigate();

  const handleChange = (name: string, value: string | boolean) => {
    setState((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleLogin = () => {
    navigate("/login");
  };

  const handleBack = () => {
    navigate(-1);
  };
  const handleRegister = async () => {
    if (state.password !== state.confirmPassword) {
      Toast.show({ icon: "fail", content: "Passwords do not match!" });
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(state.email)) {
      Toast.show({ icon: "fail", content: "Invalid email format" });
      return;
    }

    const data: RegisterRequest = {
      email: state.email,
      password: state.password,
      confirmPassword: state.confirmPassword,
    };

    try {
      Toast.show({ icon: "loading" });
      await registerUser(data);
      Toast.show({
        icon: "success",
        content: "Please verify your email",
        duration: 2000,
      });
      setState({
        email: "",
        password: "",
        confirmPassword: "",
        error: "",
      });
      navigate("/login",{replace:true});
    } catch (e) {
      Toast.show({ icon: "fail", content: e + "" ,duration:4000});
    }
  };

  const footer = (
    <Space direction="vertical" block>
      <Button
        block
        type="submit"
        color="primary"
        size="large"
        onClick={handleRegister}
      >
        Sign Up
      </Button>
      <Button block color="default" size="large" onClick={handleLogin}>
        Sign In
      </Button>
    </Space>
  );

  return (
    <>
      <NavBar back="" backIcon={true} onBack={handleBack}>
        Register
      </NavBar>
      <div style={styles.innerContainer}>
        <Space align="center" className="body" direction="vertical">
          <Logo height={80} width={300}/>
          <Form layout="horizontal" footer={footer}>
            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: "Email is required" },
                { type: "string", min: 6, message: "Must has 6 characters" },
                {
                  type: "email",
                  warningOnly: true,
                  message: "Email format incorrect",
                },
              ]}
            >
              <Input
                placeholder="Please input email"
                autoComplete="false"
                onChange={(val) => handleChange("email", val)}
              />
            </Form.Item>
            <Form.Item
              label="Password"
              name="password"
              rules={[{ required: true, message: "Password is required" }]}
            >
              <Input
                placeholder="Please input password"
                type="password"
                onChange={(val) => handleChange("password", val)}
              />
            </Form.Item>
            <Form.Item
              label="Confirm Password"
              name="confirmPassword"
              rules={[
                { required: true, message: "Confirm password is required" },
              ]}
            >
              <Input
                placeholder="Please confirm password"
                type="password"
                onChange={(val) => handleChange("confirmPassword", val)}
              />
            </Form.Item>
          </Form>
        </Space>
      </div>
    </>
  );
};

export default Register;
