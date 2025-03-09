import { Input, Space, Form, Toast } from "antd-mobile";
import Logo from "@/components/Logo/Logo";
import { useRegister } from "@/services/authService";
import { RegisterRequest } from "@/types/user";
import { useNavigate } from "react-router-dom";
import CenterLoading from "@/components/CenterLoading";
import CustomNavBar from "@/components/CustomNavBar/CustomNavBar";
import { Link } from "react-router-dom";

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
  const [form] = Form.useForm();
  const { register, isLoading } = useRegister();

  const navigate = useNavigate();

  const handleRegister = async () => {
    const values = await form.validateFields() as {
      firstName: string;
      lastName: string;
      email: string;
      password: string;
      confirmPassword: string;
    };

    if (values.password !== values.confirmPassword) {
      Toast.show({ icon: "fail", content: "Passwords not match" });
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
      Toast.show({ icon: "fail", content: "Invalid email format" });
      return;
    }

    const data: RegisterRequest = {
      email: values.email,
      firstName: values.firstName,
      lastName: values.lastName,
      password: values.password,
      confirmPassword: values.confirmPassword,
    };

    try {
      await register(data);
      Toast.show({
        icon: "success",
        content: "Please verify your email",
        duration: 2000,
      });
      void navigate("/login", { replace: true });
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  const footer = (
    <div className="flex flex-col items-center justify-center">
        {/* 主按钮区域 */}
        <button
          className="btn btn-primary btn-xl w-full text-white rounded-full shadow-md"
          onClick={() => void handleRegister()}
        >
          Sign up
        </button>
        {/* 提示文字与链接 */}
        <div className="mt-4 text-center">
          <span className="text-gray-600 mr-1">Already have an account?</span>
          <Link to="/login" className="text-green-600">
            Sign in 
          </Link>
        </div>
      </div>
  );

  if (isLoading) {
    return <CenterLoading />
  }

  return (
    <>
      <CustomNavBar title="Register" showBack={true}/>
      <div style={styles.innerContainer}>
        <Space align="center" direction="vertical">
          <Logo height={80} width={300}/>
          <Form layout="horizontal" footer={footer} form={form}>
            <Form.Item
              label="First name"
              name="firstName"
              rules={[{ required: true, message: "First name is required" }]}
            >
              <Input
                placeholder="Please input first name"
                type="text"
              />
            </Form.Item>
            <Form.Item
              label="Last name"
              name="lastName"
              rules={[{ required: true, message: "Last name is required" }]}
            >
              <Input
                placeholder="Please input last name"
                type="text"
              />
            </Form.Item>
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
              />
            </Form.Item>
          </Form>
        </Space>
      </div>
    </>
  );
};

export default Register;
