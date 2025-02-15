import { RootState } from "@/store";
import { useSelector } from "react-redux";
import { createPortal } from "react-dom";

export const ToastInfo: React.FC = () => {
  const { message, type, isVisible } = useSelector(
    (state: RootState) => state.toast
  );
  if (!isVisible) {
    return null;
  }

  let colorClass ="";
  if (type === "success") {
    colorClass = "alert-success";
  } else if (type === "warning") {
    colorClass = "alert-warning";
  } else if (type === "error") {
    colorClass = "alert-error";
  }else if(type==="info"){
    colorClass="alert-info";
  }

  return createPortal(
    <div className="fixed top-4 left-4 right-4 flex items-center justify-center z-[9999]">
      <div role="alert" className={`alert ${colorClass} shadow-lg`}>
        <span className="text-white text-lg">{message}</span>
      </div>
    </div>,
    document.body
  );
};
