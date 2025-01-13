import { SpinLoading,Toast } from "antd-mobile";

const styles: { loadingContainer: React.CSSProperties } = {
  loadingContainer: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    zIndex: 1000,
  },
};

const CenteredLoading: React.FC = () => {
  return (
    <div style={styles.loadingContainer}>
      <SpinLoading color="primary" />
      {/* Toast.show({ icon: 'loading'}); */}
    </div>
  );
};

export default CenteredLoading;
