import React from "react";
import AppBar from "@material-ui/core/AppBar";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import Toolbar from "@material-ui/core/Toolbar";
import { Link as RouterLink, useHistory } from "react-router-dom";
import Link from "@material-ui/core/Link";
import firebase from "firebase";
import { useQuery } from "react-query";
import { removeLocalStorageItem } from "common/utils/localStorage";
import { SIGN_IN_PAGE_URL } from "common/constants/routerConstants";

const useStyles = makeStyles(() => ({
  root: {
    flexGrow: 1,
  },
  title: {
    flexGrow: 1,
    color: "white",
  },
}));

export const CoreHeader = (): JSX.Element => {
  const classes = useStyles();
  const history = useHistory();

  const { refetch } = useQuery(["signOut"], () => firebase.auth().signOut(), {
    enabled: false,
    retry: false,
  });

  const onSignOut = async () => {
    try {
      await refetch({ throwOnError: true });
      removeLocalStorageItem("idToken");
      history.push(SIGN_IN_PAGE_URL);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Link component={RouterLink} to="/" variant="h6" className={classes.title}>
          Home
        </Link>
        <Button onClick={onSignOut} color="inherit">
          Logout
        </Button>
      </Toolbar>
    </AppBar>
  );
};
