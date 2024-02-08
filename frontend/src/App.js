import "./App.css";
import { useState } from "react";
import axios from "axios";
import Header from "./component/layout/Header/Header.js";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import WebFont from "webfontloader";
import React from "react";
import Footer from "./component/layout/Footer/Footer.js";
import Home from "./component/Home/Home.js";
import ProductDetails from "./component/Product/ProductDetails.js";
import Products from "./component/Product/Products.js";
import Search from "./component/Product/Search.js";
import LoginSignUp from "./component/User/LoginSignUp";
import store from "./store";
import { useSelector, useDispatch } from "react-redux";
import { loadUser } from "./actions/userAction";
import UserOptions from "./component/layout/Header/UserOptions";
import Profile from "./component/User/Profile.js";
import ProtectedRoute from "./component/Route/ProtectedRoute";
import UpdateProfile from "./component/User/UpdateProfile.js";
import UpdatePassword from "./component/User/UpdatePassword.js";
import ForgotPassword from "./component/User/ForgotPassword.js";
import ResetPassword from "./component/User/ResetPassword.js";
import Cart from "./component/Cart/Cart.js";
import Shipping from "./component/Cart/Shipping.js";
import ConfirmOrder from "./component/Cart/ConfirmOrder.js";
import Payment from "./component/Cart/Payment.js";
import OrderSuccess from "./component/Cart/OrderSuccess.js";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import MyOrders from "./component/Order/MyOrders.js";
import OrderDetails from "./component/Order/OrderDetails.js";
import Dashboard from "./component/Admin/Dashboard.js";
import ProductList from "./component/Admin/ProductList.js";
import NewProduct from "./component/Admin/NewProduct.js";
import UpdateProduct from "./component/Admin/UpdateProduct.js";
import OrderList from "./component/Admin/OrderList.js";
import ProcessOrder from "./component/Admin/ProcessOrder.js";
import UsersList from "./component/Admin/UsersList.js";
import UpdateUser from "./component/Admin/UpdateUser.js";
import ProductReviews from "./component/Admin/ProdutReviews.js";
import Contact from "./component/layout/Contact/Contact.js";
import About from "./component/layout/About/About.js";

function App() {
  const { isAuthenticated, user } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const [stripeApiKey, setStripeApiKey] = useState("");

  async function getStripeApiKey() {
    const { data } = await axios.get("/api/v1/stripeapikey");

     setStripeApiKey(data.stripeApiKey);
  }

  React.useEffect( async() => {
    async function hehe(){
      WebFont.load({
        google: {
          families: ["Roboto", "Droid Sans", "Chilanka"],
        },
      });
      await store.dispatch(loadUser());
    }
    function ok()
    {
      if (isAuthenticated) {
        console.log("hehe");
        getStripeApiKey();
      }
    }
    async function timepass(){
      await hehe();
      await ok();
    }
    timepass()
    
  }, [dispatch]);

  return (
    <Router>
      <Header />

      {isAuthenticated && <UserOptions user={user} />}
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
      <Routes>
        <Route path="product/:id" element={<ProductDetails />} />
      </Routes>
      <Routes>
        <Route path="/products" element={<Products />} />
      </Routes>
      <Routes>
        <Route path="/products/:keyword" element={<Products />} />
      </Routes>
      <Routes>
        <Route path="/search" element={<Search />} />
      </Routes>
      <Routes>
        <Route path="/contact" element={<Contact />} />
      </Routes>
      <Routes>
        <Route path="/about" element={<About />} />
      </Routes>
      <Routes>
        <Route path="/cart" element={<Cart />} />
      </Routes>
      <Routes>
        <Route
          path="/account"
          element={<ProtectedRoute element={<Profile />} />}
        />
      </Routes>
      <Routes>
        <Route
          path="/me/update"
          element={<ProtectedRoute element={<UpdateProfile />} />}
        />
      </Routes>
      <Routes>
        <Route
          path="/password/update"
          element={<ProtectedRoute element={<UpdatePassword />} />}
        />
      </Routes>
      <Routes>
        <Route path="/password/forgot" element={<ForgotPassword />} />
      </Routes>
      <Routes>
        <Route path="/password/reset/:token" element={<ResetPassword />} />
      </Routes>
      <Routes>
        <Route
          eaxct
          path="/shipping"
          element={<ProtectedRoute element={<Shipping />} />}
        />
      </Routes>

      <Routes>
        <Route
          eaxct
          path="/orders"
          element={<ProtectedRoute element={<MyOrders />} />}
        />
      </Routes>

      {stripeApiKey && (
        <Elements stripe={loadStripe(stripeApiKey)}>
          <Routes>
            <Route
              eaxct
              path="/process/payment"
              element={<ProtectedRoute element={<Payment />} />}
            />
          </Routes>
        </Elements>
      )}

      <Routes>
        <Route
          eaxct
          path="/success"
          element={<ProtectedRoute element={<OrderSuccess />} />}
        />
      </Routes>

      <Routes>
        <Route
          eaxct
          path="/order/confirm"
          element={<ProtectedRoute element={<ConfirmOrder />} />}
        />

        <Route
          eaxct
          path="/order/:id"
          element={<ProtectedRoute element={<OrderDetails />} />}
        />
      </Routes>

      <Routes>
        <Route
          isAdmin={true}
          eaxct
          path="/admin/dashboard"
          element={<ProtectedRoute element={<Dashboard />} />}
        />
      </Routes>
      <Routes>
        <Route
          isAdmin={true}
          eaxct
          path="/admin/products"
          element={<ProtectedRoute element={<ProductList />} />}
        />
      </Routes>
      <Routes>
        <Route
          isAdmin={true}
          eaxct
          path="/admin/product"
          element={<ProtectedRoute element={<NewProduct />} />}
        />
      </Routes>
      <Routes>
        <Route
          isAdmin={true}
          eaxct
          path="/admin/product/:id"
          element={<ProtectedRoute element={<UpdateProduct />} />}
        />
      </Routes>
      <Routes>
        <Route
          isAdmin={true}
          eaxct
          path="/admin/orders"
          element={<ProtectedRoute element={<OrderList />} />}
        />
      </Routes>
      <Routes>
        <Route
          isAdmin={true}
          eaxct
          path="/admin/order/:id"
          element={<ProtectedRoute element={<ProcessOrder />} />}
        />
      </Routes>
      <Routes>
        <Route
          isAdmin={true}
          eaxct
          path="/admin/users"
          element={<ProtectedRoute element={<UsersList />} />}
        />
      </Routes>
      <Routes>
        <Route
          isAdmin={true}
          eaxct
          path="/admin/user/:id"
          element={<ProtectedRoute element={<UpdateUser />} />}
        />
      </Routes>
      <Routes>
        <Route
          isAdmin={true}
          eaxct
          path="/admin/reviews"
          element={<ProtectedRoute element={<ProductReviews />} />}
        />
      </Routes>

      <Routes>
        <Route path="/login" element={<LoginSignUp />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
