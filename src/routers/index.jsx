import React from "react";
import { Routes, Route } from "react-router-dom";

import BasicLayout from "_common/component/Layout/BasicLayout";
import UnAuthLayout from "_common/component/Layout/UnAuthLayout";
import PageNotfound from "_common/component/PageNotfound";

// auth
import LoginPage from "pages/Auth/Login";
import RegisterPage from "pages/Auth/Register";

import { MiddlewareRouter } from "routers/MiddlewareRouter";
import CheckAuth from "routers/CheckAuth";

// page
import Dashboard from "pages/Dashboard";

// user
import ListUser from "pages/User/ListUser";
import ListVerify from "pages/User/ListVerify";
import ListAgency from "pages/User/ListAgency";

// history
import AddMoneyPage from "pages/History/AddMoney";
import BetPage from "pages/History/Bet";
import DepositPage from "pages/History/Deposit";
import ExchangePage from "pages/History/Exchange";
import TradePage from "pages/History/Trade";
import WithdrawalPage from "pages/History/Withdrawal";

// game
import ChampionPage from "pages/Game/Champion";

// tool
// import CommissionPage from "pages/Tool/Commission";
import Game1Page from "pages/Game/Game1";
import Game2Page from "pages/Game/Game2";
import MoneyPage from "pages/Tool/Money";
import SettingPage from "pages/Tool/Setting";

import UpdateProfilePage from "pages/Profile/UpdateProfilePage";
import ChangePasswordPage from "pages/Profile/ChangePasswordPage";
import ListVipPage from "pages/Tool/Vip";
import CommissionPage from "pages/History/Commission";
import ListSale from "pages/User/ListSale";
import GiftPage from "pages/History/Gift";
import LuckyPage from "pages/History/Lucky";
import NotifyPage from "pages/Tool/Notify";
import BankPage from "pages/Tool/Bank";
import ProductPage from "../pages/Tool/Product";

export const Routers = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <MiddlewareRouter>
            <BasicLayout />
          </MiddlewareRouter>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="analytics" element={<Dashboard />} />
        <Route path="users">
          <Route path="list" element={<ListUser />} />
          <Route path="verify" element={<ListVerify />} />
          <Route path="sale" element={<ListSale />} />
          <Route path="agency" element={<ListAgency />} />
        </Route>
        <Route path="history">
          <Route path="deposit" element={<DepositPage />} />
          <Route path="withdrawal" element={<WithdrawalPage />} />
          <Route path="trade" element={<TradePage />} />
          <Route path="bet" element={<BetPage />} />
          <Route path="exchange" element={<ExchangePage />} />
          <Route path="add-money" element={<AddMoneyPage />} />
          <Route path="commission" element={<CommissionPage />} />
        </Route>
        <Route path="game">
          <Route path="gift" element={<GiftPage />} />
          <Route path="lucky" element={<LuckyPage />} />
          <Route path="game1" element={<Game1Page />} />
          <Route path="game2" element={<Game2Page />} />
        </Route>
        <Route path="tool">
          <Route path="commission" element={<CommissionPage />} />
          <Route path="bank" element={<BankPage />} />
          <Route path="money" element={<MoneyPage />} />
          <Route path="setting" element={<SettingPage />} />
          <Route path="vip" element={<ListVipPage />} />
          <Route path="notify" element={<NotifyPage />} />
          <Route path="product" element={<ProductPage />} />
        </Route>

        <Route path="profile">
          <Route path="update-profile" element={<UpdateProfilePage />} />
          <Route path="change-password" element={<ChangePasswordPage />} />
        </Route>
      </Route>
      <Route
        path="auth"
        element={
          <CheckAuth>
            <UnAuthLayout />
          </CheckAuth>
        }
      >
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
      </Route>
      <Route path="*" element={<PageNotfound />} />
    </Routes>
  );
};
