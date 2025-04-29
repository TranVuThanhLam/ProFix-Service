import Header from "../../components/common/Header/Header";
import Footer from "../../components/common/Footer/Footer";
function MainLayout({ children }) {
  return (
    <div>
      <Header />
      {children}
      <Footer />
    </div>
  );
}

export default MainLayout;
