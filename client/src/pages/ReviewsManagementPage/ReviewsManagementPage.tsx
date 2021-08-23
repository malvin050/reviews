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
import { Restaurant, Review } from "common/utils/models";
import { AddOrUpdateReviewModal } from "./AddOrUpdateReviewModal/AddOrUpdateReviewModal";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import Button from "@material-ui/core/Button";
import { useParams } from "react-router-dom";
import get from "lodash/get";
import { RestaurantCard } from "common/RestaurantCard/RestaurantCard";

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
    marginTop: theme.spacing(4),
  },
}));

interface PathParam {
  id: string;
}

interface UpdateReviewModalState {
  review: Review | undefined;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (request: Record<string, unknown>) => Promise<void>;
}

const UPDATE_REVIEW_MODAL_INITIAL_STATE: UpdateReviewModalState = {
  review: undefined,
  isOpen: false,
  onClose: () => null,
  onSubmit: () => Promise.resolve(),
};

export const ReviewsManagementPage = () => {
  const classes = useStyles();
  const { id: restaurantId } = useParams<PathParam>();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [updateReviewModalState, setUpdateReviewModalState] = useState<UpdateReviewModalState>(
    UPDATE_REVIEW_MODAL_INITIAL_STATE,
  );
  const { apiClient } = useApiClient();
  const { error, isFetching, data: reviews, refetch: refetchReviews } = useQuery(
    ["getReviews"],
    () =>
      apiClient({ method: "GET", url: `/restaurant/${restaurantId}/review` }).then(
        (response) => response.data.data.reviews as Review[],
      ),
    {
      retry: false,
    },
  );
  const { isFetching: isFetchingRestaurant, data: restaurant, refetch: refetchRestaurant } = useQuery(
    ["getRestaurant"],
    () =>
      apiClient({ method: "GET", url: `/restaurant/${restaurantId}` }).then(
        (response) => response.data.data.restaurants[0] as Restaurant,
      ),
    {
      retry: false,
    },
  );

  const isMenuOpen = Boolean(anchorEl);

  const updateReview = async (request: any) => {
    const { id, ...data } = request;
    try {
      await apiClient({ method: "PATCH", url: `/restaurant/${restaurantId}/review/${id}`, data });
      await refetchReviews({ throwOnError: true });
      await refetchRestaurant({ throwOnError: true });
      setUpdateReviewModalState(UPDATE_REVIEW_MODAL_INITIAL_STATE);
    } catch (err) {
      console.log(err);
    }
  };

  const deleteReview = async (id: string) => {
    try {
      await apiClient({ method: "DELETE", url: `/restaurant/${restaurantId}/review/${id}` });
      await refetchReviews({ throwOnError: true });
      await refetchRestaurant({ throwOnError: true });
    } catch (err) {
      console.log(err);
    }
  };

  const createReview = async (request: any) => {
    const { id, ...data } = request;
    try {
      await apiClient({ method: "POST", url: `/restaurant/${restaurantId}/review`, data });
      await refetchReviews({ throwOnError: true });
      await refetchRestaurant({ throwOnError: true });
      setUpdateReviewModalState(UPDATE_REVIEW_MODAL_INITIAL_STATE);
    } catch (error) {
      console.log(error);
    }
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const handleMenuItemClick = (action) => {
    const reviewId = get(anchorEl, "id");
    if (action === "update") {
      setUpdateReviewModalState({
        review: reviews!.find((review) => review.id === reviewId)!,
        isOpen: true,
        onClose: () => setUpdateReviewModalState(UPDATE_REVIEW_MODAL_INITIAL_STATE),
        onSubmit: updateReview,
      });
    } else if (action === "delete") {
      deleteReview(reviewId!);
    } else if (action === "create") {
      setUpdateReviewModalState({
        review: undefined,
        isOpen: true,
        onClose: () => setUpdateReviewModalState(UPDATE_REVIEW_MODAL_INITIAL_STATE),
        onSubmit: createReview,
      });
    }
    handleMenuClose();
  };

  if (isFetching || isFetchingRestaurant) {
    return <CircularProgress />;
  }

  if (error) {
    return <Typography variant="h4">Unable to load data</Typography>;
  }

  return (
    <>
      <RestaurantCard restaurant={restaurant!} />
      <div className={classes.titleContainer}>
        <Typography variant="h4">Reviews</Typography>
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
              <TableCell>Visit Date</TableCell>
              <TableCell>Rating</TableCell>
              <TableCell>Comment</TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {reviews!.map(({ id, visitDate, rating, comment }) => (
              <TableRow key={id}>
                <TableCell component="th" scope="row">
                  {visitDate}
                </TableCell>
                <TableCell>{rating}</TableCell>
                <TableCell>{comment}</TableCell>
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
      {updateReviewModalState.isOpen && <AddOrUpdateReviewModal {...updateReviewModalState} />}
    </>
  );
};
