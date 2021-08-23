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
import { Restaurant } from "common/utils/models";
import { AddOrUpdateRestaurantModal } from "./AddOrUpdateRestaurantModal/AddOrUpdateRestaurantModal";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import Button from "@material-ui/core/Button";
import get from "lodash/get";
import { useHistory } from "react-router-dom";
import { buildUrl } from "common/utils";
import { ADMIN_REVIEW_MANAGEMENT_URL } from "common/constants/routerConstants";

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

interface AddOrUpdateRestaurantModalState {
  restaurant: Restaurant | undefined;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (request: Record<string, unknown>) => Promise<void>;
}

const ADD_OR_UPDATE_RESTAURANT_MODAL_INITIAL_STATE: AddOrUpdateRestaurantModalState = {
  restaurant: undefined,
  isOpen: false,
  onClose: () => null,
  onSubmit: () => Promise.resolve(),
};

export const RestaurantsManagementPage = () => {
  const classes = useStyles();
  const history = useHistory();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [
    addOrUpdateRestaurantModalState,
    setAddOrUpdateRestaurantModalState,
  ] = useState<AddOrUpdateRestaurantModalState>(ADD_OR_UPDATE_RESTAURANT_MODAL_INITIAL_STATE);
  const { apiClient } = useApiClient();
  const { error, isFetching, data: restaurants, refetch } = useQuery(
    ["getRestaurants"],
    () =>
      apiClient({ method: "GET", url: "/restaurant" }).then(
        (response) => response.data.data.restaurants as Restaurant[],
      ),
    {
      retry: false,
    },
  );

  const isMenuOpen = Boolean(anchorEl);

  const updateRestaurant = async (request: any) => {
    const { id, ...data } = request;
    try {
      await apiClient({ method: "PATCH", url: `/restaurant/${id}`, data });
      await refetch();
      setAddOrUpdateRestaurantModalState(ADD_OR_UPDATE_RESTAURANT_MODAL_INITIAL_STATE);
    } catch (err) {
      console.log(err);
    }
  };

  const deleteRestaurant = async (id: string) => {
    try {
      await apiClient({ method: "DELETE", url: `/restaurant/${id}` });
      await refetch();
    } catch (err) {
      console.log(err);
    }
  };

  const createRestaurant = async (request: any) => {
    const { id, ...data } = request;
    try {
      await apiClient({ method: "POST", url: "/restaurant", data });
      await refetch();
      setAddOrUpdateRestaurantModalState(ADD_OR_UPDATE_RESTAURANT_MODAL_INITIAL_STATE);
    } catch (error) {
      console.log(error);
    }
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const handleMenuItemClick = (action: string) => {
    const restaurantId = get(anchorEl, "id");
    if (action === "update") {
      setAddOrUpdateRestaurantModalState({
        restaurant: restaurants!.find((restaurant) => restaurant.id === restaurantId)!,
        isOpen: true,
        onClose: () => setAddOrUpdateRestaurantModalState(ADD_OR_UPDATE_RESTAURANT_MODAL_INITIAL_STATE),
        onSubmit: updateRestaurant,
      });
    } else if (action === "delete") {
      deleteRestaurant(restaurantId!);
    } else if (action === "create") {
      setAddOrUpdateRestaurantModalState({
        restaurant: undefined,
        isOpen: true,
        onClose: () => setAddOrUpdateRestaurantModalState(ADD_OR_UPDATE_RESTAURANT_MODAL_INITIAL_STATE),
        onSubmit: createRestaurant,
      });
    } else if (action === "view reviews") {
      return history.push(buildUrl(ADMIN_REVIEW_MANAGEMENT_URL, { id: restaurantId! }));
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
        <Typography variant="h4">Restaurants</Typography>
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
              <TableCell>Name</TableCell>
              <TableCell>Address</TableCell>
              <TableCell>City</TableCell>
              <TableCell>State</TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {restaurants!.map(({ id, name, address, city, state }) => (
              <TableRow key={id}>
                <TableCell component="th" scope="row">
                  {name}
                </TableCell>
                <TableCell>{address}</TableCell>
                <TableCell>{city}</TableCell>
                <TableCell>{state}</TableCell>
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
        {["update", "delete", "view reviews"].map((option) => (
          <MenuItem key={option} onClick={() => handleMenuItemClick(option)}>
            {option}
          </MenuItem>
        ))}
      </Menu>
      {addOrUpdateRestaurantModalState.isOpen && <AddOrUpdateRestaurantModal {...addOrUpdateRestaurantModalState} />}
    </>
  );
};
