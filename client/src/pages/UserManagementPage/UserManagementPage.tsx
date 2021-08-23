import React, { useState } from "react";
import CircularProgress from "@material-ui/core/CircularProgress";
import Typography from "@material-ui/core/Typography";
import { useApiClient } from "common/hooks/useApiClient";
import { useQuery } from "react-query";
import { makeStyles } from "@material-ui/core/styles";
import TableContainer from "@material-ui/core/TableContainer";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import Paper from "@material-ui/core/Paper";
import IconButton from "@material-ui/core/IconButton";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import { User } from "common/utils/models";
import { AddOrUpdateUserModal } from "./AddOrUpdateUserModal/AddOrUpdateUserModal";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import Button from "@material-ui/core/Button";
import get from "lodash/get";

const useStyles = makeStyles((theme) => ({
  table: {
    minWidth: 650,
  },
  tableContainer: {
    marginTop: theme.spacing(2),
  },
  titleContainer: {
    display: "flex",
    justifyContent: "space-between",
  },
}));

interface AddOrUpdateUserModalState {
  user: User | undefined;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (request: Record<string, unknown>) => Promise<void>;
}

const ADD_OR_UPDATE_USER_MODAL_INITIAL_STATE: AddOrUpdateUserModalState = {
  user: undefined,
  isOpen: false,
  onClose: () => null,
  onSubmit: () => Promise.resolve(),
};

export const UserManagementPage = () => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [addOrUpdateUserModalState, setAddOrUpdateUserModalState] = useState<AddOrUpdateUserModalState>(
    ADD_OR_UPDATE_USER_MODAL_INITIAL_STATE,
  );
  const { apiClient } = useApiClient();
  const { error, isFetching, data: users, refetch } = useQuery(
    ["getUsers"],
    () =>
      apiClient({ method: "GET", url: "/user" }).then(({ data }) => {
        const users: User[] = data.data.users.map(({ uid, email, customClaims }) => ({
          id: uid,
          email,
          role: customClaims.role,
        }));
        return users;
      }),
    {
      retry: false,
    },
  );

  const isMenuOpen = Boolean(anchorEl);

  const updateUser = async (request: any) => {
    const { id, email, password, role } = request;
    try {
      await apiClient({ method: "PATCH", url: `/user/${id}`, data: { email, password, role } });
      await refetch();
      setAddOrUpdateUserModalState(ADD_OR_UPDATE_USER_MODAL_INITIAL_STATE);
    } catch (err) {
      console.log(err);
    }
  };

  const deleteUser = async (id: string) => {
    try {
      await apiClient({ method: "DELETE", url: `/user/${id}` });
      await refetch();
    } catch (err) {
      console.log(err);
    }
  };

  const createUser = async (request: any) => {
    const { id, ...data } = request;
    try {
      await apiClient({ method: "POST", url: "/user", data });
      await refetch();
      setAddOrUpdateUserModalState(ADD_OR_UPDATE_USER_MODAL_INITIAL_STATE);
    } catch (error) {
      console.log(error);
    }
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const handleMenuItemClick = (action: string) => {
    const userId = get(anchorEl, "id");
    if (action === "update") {
      setAddOrUpdateUserModalState({
        user: users!.find((user) => user.id === userId)!,
        isOpen: true,
        onClose: () => setAddOrUpdateUserModalState(ADD_OR_UPDATE_USER_MODAL_INITIAL_STATE),
        onSubmit: updateUser,
      });
    } else if (action === "delete") {
      deleteUser(userId!);
    } else if (action === "create") {
      setAddOrUpdateUserModalState({
        user: undefined,
        isOpen: true,
        onClose: () => setAddOrUpdateUserModalState(ADD_OR_UPDATE_USER_MODAL_INITIAL_STATE),
        onSubmit: createUser,
      });
    }
    handleMenuClose();
  };

  if (isFetching) {
    return <CircularProgress />;
  }

  if (error) {
    return <Typography variant="h4">Unable to load data</Typography>;
  }

  return (
    <>
      <div className={classes.titleContainer}>
        <Typography variant="h4">Users</Typography>
        <Button
          variant="outlined"
          color="primary"
          startIcon={<AddCircleIcon />}
          onClick={() => handleMenuItemClick("create")}
        >
          Add
        </Button>
      </div>
      <TableContainer className={classes.tableContainer} component={Paper}>
        <Table className={classes.table} size="small" aria-label="users table">
          <TableHead>
            <TableRow>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {users!.map(({ id, email, role }) => (
              <TableRow key={id}>
                <TableCell component="th" scope="row">
                  {email}
                </TableCell>
                <TableCell>{role}</TableCell>
                <TableCell align="right">
                  <IconButton id={id} onClick={handleMenuClick} edge="end">
                    <MoreVertIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Menu id="long-menu" anchorEl={anchorEl} open={isMenuOpen} onClose={handleMenuClose}>
        {["update", "delete"].map((option) => (
          <MenuItem key={option} onClick={() => handleMenuItemClick(option)}>
            {option}
          </MenuItem>
        ))}
      </Menu>
      {addOrUpdateUserModalState.isOpen && <AddOrUpdateUserModal {...addOrUpdateUserModalState} />}
    </>
  );
};
