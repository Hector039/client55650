import { HashRouter, Route, Routes } from "react-router-dom";
import { DataProvider } from "./components/context/dataContext";
import ProductsContainer from "./components/ProductsContainer/ProductsContainer";
import Cart from './components/Cart/Cart';
import Account from "./components/User/LoginAndRegister";
import Forgot from "./components/Forgot/Forgot";
import Logout from "./components/Logout/Logout";
import System from "./components/System/AdminSystem"
import NavBar from "./components/NavBar/NavBar";
import ProductDetail from "./components/ProductDetail/ProductDetail";
import Contact from "./components/Contact/Contact";
import UserTickets from "./components/UserTickets/UserTickets";
import Footer from "./components/Footer/Footer"
import { ToastContainer } from 'react-toastify';
import './App.css'
import PassRestoration from "./components/Forgot/passRestoration";

export default function App() {

  return (
    <DataProvider>
      <HashRouter basename="/client55650">
      <NavBar/>
        <Routes>
          <Route exact path={"/"} element={<ProductsContainer />} />
          <Route exact path={"/productdetail/:pid"} element={<ProductDetail />} />
          <Route exact path={"/usertickets/:email"} element={<UserTickets />} />
          <Route exact path={"/cart"} element={<Cart />} />
          <Route exact path={"/account"} element={<Account />} />
          <Route exact path={"/forgot/:email"} element={<Forgot />} />
          <Route exact path={"/passrestoration"} element={<PassRestoration />} />
          <Route exact path={"/logout"} element={<Logout />} />
          <Route exact path={"/realtimeproducts"} element={<System />} />
          <Route exact path={"/contact"} element={<Contact />} />
        </Routes>
        <Footer />
      </HashRouter>

      <ToastContainer
        position="top-right"
        autoClose={1500}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover={false}
        theme="colored"
      />

    </DataProvider>
  )
}

