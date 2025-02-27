import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";

const LoginCard: React.FC = () => {
  const navigate = useNavigate();
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <div className="flex flex-col items-center justify-center">
        {/* 主按钮区域 */}
        <button
          className="btn btn-primary btn-xl w-4/5 text-white rounded-full shadow-md"
          onClick={() =>void navigate("/login", { replace: true })}
        >
          Log in
        </button>
        {/* 提示文字与链接 */}
        <div className="mt-4 text-center">
          <span className="text-gray-600 mr-1">Don&apos;t have an account?</span>
          <Link to="/register" className="text-green-600">
            Sign up
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default LoginCard;
