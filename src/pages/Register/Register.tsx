import { validateEmail, validatePassword } from "@/utils/validation";
import { useState } from "react";
import FormInput from "@/components/FormInput/FormInput";
import { registerUser } from "@/services/userService";

const Register: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const handleRegister = async () => {
    if (!validateEmail(email)) {
      setError("Invalid email");
      return;
    }
    if (!validatePassword(password)) {
      setError("password must be atmost 20 characters long");
      return;
    }
    setError(null);
    try {
      const response = await registerUser({ email, password, confirmPassword });
      console.log("Registratiion successful:", response);
    } catch (e) {
      setError("Failed to register user");
    }
  };

  return (
    <div>
      <h1>Register</h1>
      <FormInput label="Email" type="email" value={email} onChange={setEmail} />
      <FormInput
        label="Password"
        type="password"
        value={password}
        onChange={setPassword}
      />
      <FormInput
        label="confirmPassword"
        type="password"
        value={confirmPassword}
        onChange={setConfirmPassword}
      />
      {error && <p>{error}</p>}
      <button onClick={handleRegister}>Register</button>
    </div>
  );
};

export default Register;
