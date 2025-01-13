import { useState, useEffect } from "react";
import {
  Input,
  Radio,
  Button,
  Space,
  Form,
  Toast,
} from "antd-mobile";
import Logo from "@/components/Logo/Logo";
import { registerUser } from "@/services/userService";
import './register.css'

interface State{
  email: string;
  password: string;
  confirmPassword: string;
  error: string;
  redirectToLogin: boolean;
}
const Register: React.FC = () => {
  const [error, setError] = useState<string | null>(null);

  const [state, setState] = useState<State>({
    email: "",
    password: "",
    confirmPassword: "",
    error:"",
    redirectToLogin: false,
  });

  const handleChange = (name:string, value:string|boolean) => {
    setState((prevState) => ({ ...prevState, [name]: value }));
  };

  const toLogin = () => {
    //setState({ redirectToLogin: true });
  };
  const register = async () => {
    //await dispatch(registerUser(state));
    // console.log(`result is :${result}`);
  };

  const footer = (
    <Space direction="vertical" block>
      <Button
        block
        type="submit"
        color="primary"
        size="large"
        onClick={register}
      >
        Sign Up
      </Button>
      <Button block color="default" size="large" onClick={toLogin}>
        Sign In
      </Button>
    </Space>
  );

  return (
   <div className='container2'>
      <Logo />
      <Space align="center">
        <Form layout="horizontal" footer={footer}>
          <Form.Item
            label="Email"
            name="email" 
            rules={[{ required: true, message: "Email is required" }]}
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
            rules={[{ required: true, message: "Confirm password is required" }]}
          >
            <Input
              placeholder="Please confirm password"
              type="password"
              onChange={(val) => handleChange("password2", val)}
            />
          </Form.Item>
        </Form>
      </Space>
    </div> 
  );
};

export default Register;
