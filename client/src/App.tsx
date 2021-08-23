import React from "react";
import firebase from "firebase";
import "firebase/database";
import "firebase/auth";
import { Switch, Route, useLocation } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import { CssBaseline, ThemeProvider } from "@material-ui/core";
import { CoreHeader } from "common/components/CoreHeader/CoreHeader";
import { CoreFooter } from "common/components/CoreFooter/CoreFooter";
import {
  AUTHENTICATION_PREFIX,
  SIGN_IN_PAGE_URL,
  SIGN_UP_PAGE_URL,
  RESTAURANTS_URL,
  RESTAURANT_URL,
  ADMIN_USER_MANAGEMENT_URL,
  ADMIN_RESTAURANT_MANAGEMENT_URL,
  ADMIN_REVIEW_MANAGEMENT_URL,
} from "common/constants/routerConstants";
import { SignInPage } from "pages/SignInPage/SignInPage";
import { SignUpPage } from "pages/SignUpPage/SignUpPage";
import { RestaurantPage } from "pages/RestaurantPage/RestaurantPage";
import { UserContextProdiver } from "common/contexts/UserContext";
import { RestaurantsPage } from "pages/RestaurantsPage/RestaurantsPage";
import { theme } from "./common/utils/theme";
import styles from "./App.module.scss";
import firebaseConfig from "./config/firebaseConfig.json";
import { UserManagementPage } from "pages/UserManagementPage/UserManagementPage";
import { RestaurantsManagementPage } from "pages/RestaurantsManagementPage/RestaurantsManagementPage";
import { ReviewsManagementPage } from "pages/ReviewsManagementPage/ReviewsManagementPage";
const queryClient = new QueryClient();

firebase.initializeApp(firebaseConfig);

function App(): JSX.Element {
  const location = useLocation();
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <UserContextProdiver>
        <QueryClientProvider client={queryClient}>
          <div className={styles.app}>
            {!location.pathname.startsWith(AUTHENTICATION_PREFIX) && <CoreHeader />}
            <main role="main">
              <Switch>
                <Route exact path={SIGN_IN_PAGE_URL} component={SignInPage} />
                <Route exact path={SIGN_UP_PAGE_URL} component={SignUpPage} />
                <Route exact path={RESTAURANTS_URL} component={RestaurantsPage} />
                <Route exact path={RESTAURANT_URL} component={RestaurantPage} />
                <Route exact path={ADMIN_USER_MANAGEMENT_URL} component={UserManagementPage} />
                <Route exact path={ADMIN_RESTAURANT_MANAGEMENT_URL} component={RestaurantsManagementPage} />
                <Route exact path={ADMIN_REVIEW_MANAGEMENT_URL} component={ReviewsManagementPage} />
                <Route exact path="/" component={RestaurantsPage} />
              </Switch>
            </main>
            {!location.pathname.startsWith(AUTHENTICATION_PREFIX) && <CoreFooter />}
          </div>
        </QueryClientProvider>
      </UserContextProdiver>
    </ThemeProvider>
  );
}

export default App;
