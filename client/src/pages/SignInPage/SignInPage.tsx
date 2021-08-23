import React, { useContext } from "react";
import firebase from "firebase";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import Checkbox from "@material-ui/core/Checkbox";
import Container from "@material-ui/core/Container";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Grid from "@material-ui/core/Grid";
import Link from "@material-ui/core/Link";
import { Link as RouterLink, useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import { useQuery } from "react-query";
import { useForm } from "common/hooks/useForm";
import { RESTAURANTS_URL, SIGN_UP_PAGE_URL } from "common/constants/routerConstants";
import { UserContext } from "common/contexts/UserContext";
import { setLocalStorageItem } from "common/utils/localStorage";
import { setSessionStorageItem } from "common/utils/sessionStorage";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export const SignInPage = (): JSX.Element => {
  const classes = useStyles();
  const history = useHistory();
  const { getFieldProps, values } = useForm({
    initialValues: { email: "", password: "", remember: false },
    onAnyChangeValidator: () => Promise.resolve({}),
  });
  const { setIdToken } = useContext(UserContext);
  const signIn = async ({ email, password }) => {
    const { user } = await firebase.auth().signInWithEmailAndPassword(email, password);
    return await user!.getIdToken();
  };
  const { refetch } = useQuery(["signIn"], () => signIn(values), {
    enabled: false,
    retry: false,
  });

  const onSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    try {
      const result = await refetch({ throwOnError: true });
      setIdToken(result.data!);
      values.remember ? setLocalStorageItem("idToken", result.data!) : setSessionStorageItem("idToken", result.data!);
      history.push(RESTAURANTS_URL);
      // TODO: redirect
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Container maxWidth="xs">
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <form className={classes.form} noValidate onSubmit={onSubmit}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            {...getFieldProps("email")}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            {...getFieldProps("password")}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={values.remember}
                onChange={(event) => getFieldProps("remember").onChange(event.target.checked)}
                value="remember"
                color="primary"
              />
            }
            label="Remember me"
          />
          <Button type="submit" fullWidth variant="contained" color="primary" className={classes.submit}>
            Sign In
          </Button>
          <Grid container justify="center">
            {/* <Grid item xs>
              <Link href="#" variant="body2">
                Forgot password?
              </Link>
            </Grid> */}
            <Grid item>
              <Link component={RouterLink} to={SIGN_UP_PAGE_URL} variant="body2">
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  );
};
