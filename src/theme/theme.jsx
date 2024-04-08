import React from "react";
import { createGlobalStyle, ThemeProvider } from "styled-components";
import {ConfigProvider, theme} from "antd";
import {useTelegram} from "../hooks/useTelegram.jsx";
import {get, isEqual} from "lodash";
const { defaultAlgorithm, darkAlgorithm } = theme;
const {tg} = useTelegram();

const CustomTheme = {
    algorithm: isEqual(get(tg,'colorScheme','light'),'light') ? defaultAlgorithm : darkAlgorithm,
    fonts: {
        heading: `'Montserrat', sans-serif`,
        body: `'Montserrat', sans-serif`,
    },
    token: {
        colorPrimary: '#0fcc28',
        borderRadius: '5px',
        fontSize: 16,
        fontSizeHeading5: 16
    },
}

const GlobalStyles = createGlobalStyle`
    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }
    body {
        overflow-x: hidden;
        max-width: 600px;
        margin: 0 auto;
        min-height: 100vh;
    }
    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }
    input[type=number] {
        -moz-appearance: textfield;
    }
    .active button {
        background-color: #0fcc28;
        color: #fff;
        font-weight: 500;
    }
    .ant-card-cover {
        margin-top: 0 !important;
        margin-inline-start: 0 !important;
        margin-inline-end: 0 !important;
    }
`
const Theme = ({ children }) => {

  return (
    <ThemeProvider theme={{}}>
        <GlobalStyles />
      <ConfigProvider theme={CustomTheme}>
        {children}
      </ConfigProvider>
    </ThemeProvider>
  );
};

export default Theme;
