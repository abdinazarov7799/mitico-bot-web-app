import React, {Suspense, useEffect} from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Loader from "../components/Loader.jsx";
import HomePage from "../modules/home/HomePage.jsx";
import {useTelegram} from "../hooks/useTelegram.jsx";
import ProductViewPage from "../modules/product/ProductViewPage.jsx";
import BasketPage from "../modules/basket/BasketPage.jsx";
import OrdersPage from "../modules/orders/OrdersPage.jsx";

const Router = ({ ...rest }) => {
    const {tg} = useTelegram();
    useEffect(() => {
        tg.ready();
        tg.expand();
        tg.enableClosingConfirmation();
    }, [])
  return (
    <BrowserRouter>
      <Suspense fallback={<Loader />}>
        <Routes>
            <Route
              path={"/:userId/:lang"}
              index
              element={<HomePage />}
            />
            <Route
              path={"/product/view/:userId/:lang/:id"}
              index
              element={<ProductViewPage />}
            />
            <Route
              path={"/basket/:userId/:lang"}
              index
              element={<BasketPage />}
            />
            <Route
              path={"/orders/:userId/:lang"}
              index
              element={<OrdersPage />}
            />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default Router;
