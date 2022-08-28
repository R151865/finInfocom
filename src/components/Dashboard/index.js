import Header from "../Header";
import HOST from "../../constants/host";
import Cookies from "js-cookie";
import { TailSpin } from "react-loader-spinner";
import { useState, useEffect } from "react";
import apiStatusConstants from "../../constants/apiStatusConstants";
import { motion } from "framer-motion";

import "./index.css";

const sampData = {
  latitude: 16.8486792,
  longitude: 82.1266437,
  radius: 2,
  sorts: {
    rating: -1,
  },
  limit: 10,
};

export default function Dashboard() {
  const [products, setProducts] = useState([]);
  const [apiStatus, setApiStatus] = useState(apiStatusConstants.initial);

  useEffect(() => {
    fetchBackendProductsAPI();
  }, []);

  const fetchBackendProductsAPI = async () => {
    setApiStatus(apiStatusConstants.loading);

    const jwtToken = Cookies.get("jwtToken");
    const url = `${HOST}/api/product/get-list`;
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwtToken}`,
      },
      body: JSON.stringify(sampData),
    };

    const response = await fetch(url, options);
    const data = await response.json();
    if (response.ok === true) {
      setProducts(data.data.products);
      setApiStatus(apiStatusConstants.success);
    } else {
      setApiStatus(apiStatusConstants.failure);
    }
  };

  const getProduct = (eachProduct) => {
    const { name, price, quantity, rating, quantityUnits } = eachProduct;
    return (
      <motion.div
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 4 }}
        className="product"
      >
        <p className="title">{name}</p>
        <div className="product_title_section">
          <p className="quantity">Quantity - {quantity}</p>
          <p className="price">Rs {price}</p>
        </div>

        <div className="product_title_section">
          <p>rating - {rating}</p>
          <p className="units">units: {quantityUnits}</p>
        </div>
      </motion.div>
    );
  };

  const renderLoadingView = () => {
    return (
      <div className="dashboard__loader">
        <TailSpin color="blue" />;
      </div>
    );
  };

  const renderProductsListSuccessView = () => {
    return (
      <div className="products_list">
        {products.map((each) => getProduct(each))}
      </div>
    );
  };

  const onClickRetryButton = () => {
    fetchBackendProductsAPI();
  };

  const renderFailureView = () => {
    return (
      <div className="failure">
        <h1>Oops connection lost</h1>
        <p>check your internet connection and retry</p>
        <button type="button" onClick={onClickRetryButton}>
          Retry
        </button>
      </div>
    );
  };

  const renderViewsBasedOnApiStatus = () => {
    switch (apiStatus) {
      case apiStatusConstants.loading:
        return renderLoadingView();
      case apiStatusConstants.failure:
        return renderFailureView();
      case apiStatusConstants.success:
        return renderProductsListSuccessView();
      default:
        return null;
    }
  };

  return (
    <>
      <Header />
      <div className="dashboard">
        <div className="dashboard__body">{renderViewsBasedOnApiStatus()}</div>
      </div>
    </>
  );
}
