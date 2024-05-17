import { BrowserRouter, Route, Routes } from "react-router-dom";
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
      <BrowserRouter basename="/client55650">
      <NavBar/>
        <Routes>
          <Route path={"/"} element={<ProductsContainer />} />
          <Route path={"/productdetail/:pid"} element={<ProductDetail />} />
          <Route path={"/usertickets/:email"} element={<UserTickets />} />
          <Route path={"/cart"} element={<Cart />} />
          <Route path={"/account"} element={<Account />} />
          <Route path={"/forgot/:email"} element={<Forgot />} />
          <Route path={"/passrestoration"} element={<PassRestoration />} />
          <Route path={"/logout"} element={<Logout />} />
          <Route path={"/realtimeproducts"} element={<System />} />
          <Route path={"/contact"} element={<Contact />} />
        </Routes>
        <Footer />
      </BrowserRouter>

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

