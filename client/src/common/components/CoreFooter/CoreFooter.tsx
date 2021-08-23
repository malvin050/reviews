import React from "react";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  footer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "3rem",
    backgroundColor: "#F5F5F5"
  },
}));

export const CoreFooter = () => {
  const classes = useStyles();
  return <footer className={classes.footer}>All Rights Reserved</footer>;
};
