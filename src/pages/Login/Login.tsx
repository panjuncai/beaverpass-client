import { useState } from "react";
import { Input, Button, Space, Form, Toast, NavBar } from "antd-mobile";
import Logo from "@/components/Logo/Logo";
import { loginUser } from "@/services/userService";
import { LoginRequest } from "@/types/user";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

interface State {
  email: string;
  password: string;
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

const Login: React.FC = () => {
  const [state, setState] = useState<State>({
    email: "",
    password: "",
    error: "",
  });

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (name: string, value: string | boolean) => {
    setState((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleLogin = async () => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(state.email)) {
      Toast.show({ icon: "fail", content: "Invalid email format" });
      return;
    }
    const data: LoginRequest = {
      email: state.email,
      password: state.password,
    };
    try {
      Toast.show({ icon: "loading" });
      // server login auth
      await loginUser(data);
      // local login auth
      login();
      Toast.show({ icon: "success" });
      setState({
        email: "",
        password: "",
        error: "",
      });
      navigate("/");
    } catch (e) {
      Toast.show({ icon: "fail", content: e + "" });
    }
  };
  const handleBack = () => {
    navigate(-1);
  };
  const handleRegister = async () => {
    navigate("/register");
  };

  const footer = (
    <Space direction="vertical" block>
      <Button
        block
        type="submit"
        color="primary"
        size="large"
        onClick={handleLogin}
      >
        Sign In
      </Button>
      <Button block color="default" size="large" onClick={handleRegister}>
        Sign Up
      </Button>
    </Space>
  );

  return (
    <>
      {/* <NavBar back="" backIcon={true} onBack={handleBack}>
        Login
      </NavBar>
      <div className="body"> */}
        <div style={styles.innerContainer}>
          <Logo height={80} width={300} />
          <Space align="center">
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
            </Form>
          </Space>
        </div>
      {/* </div> */}
    </>
  );
};

export default Login;
