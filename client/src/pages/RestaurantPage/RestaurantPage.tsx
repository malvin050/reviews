import React, { Fragment } from "react";
import CircularProgress from "@material-ui/core/CircularProgress";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import { useApiClient } from "common/hooks/useApiClient";
import { useForm } from "common/hooks/useForm";
import { RestaurantCard } from "common/RestaurantCard/RestaurantCard";
import { Restaurant, Review } from "common/utils/models";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Rating from "@material-ui/lab/Rating";

const useStyles = makeStyles((theme) => ({
  reviewContainer: {
    marginTop: theme.spacing(4),
    display: "flex",
    flexDirection: "column",
  },
  rating: {
    minWidth: "10rem",
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  reviewTitle: {
    display: "flex",
    alignItems: "flex-end"
  },
}));

interface PathParam {
  id: string;
}

interface ReviewComponentProps {
  label: string;
  review: Review;
}
const ReviewComponent = ({ label, review }: ReviewComponentProps) => {
  const classes = useStyles();
  return (
    <div>
      <Typography variant="subtitle1"><b>{label}</b></Typography>
      <div className={classes.reviewTitle}>
        <Rating name={label} value={review.rating} readOnly />
        <Typography variant="body2">{review.visitDate}</Typography>
      </div>
      <Typography>{review.comment}</Typography>
    </div>
  );
};

export const RestaurantPage = () => {
  const classes = useStyles();
  const { id } = useParams<PathParam>();
  const { getFieldProps, values, resetForm } = useForm({
    initialValues: { rating: "1", comment: "", visitDate: "" },
    onAnyChangeValidator: () => Promise.resolve({}),
  });
  const { apiClient } = useApiClient();
  const { error, isFetching, data: response, refetch: getRestaurant } = useQuery(
    ["getRestaurant"],
    () => apiClient({ method: "GET", url: `/restaurant/${id}` }),
    {
      retry: false,
    },
  );
  const { refetch: createReview } = useQuery(
    ["createReview"],
    () =>
      apiClient({
        method: "POST",
        url: `/restaurant/${id}/review`,
        data: { ...values, rating: parseInt(values.rating) },
      }),
    {
      retry: false,
      enabled: false,
    },
  );

  if (isFetching) {
    return <CircularProgress />;
  }

  if (error) {
    return <Typography variant="h4">Unable to load data</Typography>;
  }

  const restaurant: Restaurant = response.data.data.restaurants[0];

  const onSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    try {
      await createReview({ throwOnError: true });
      await getRestaurant({ throwOnError: true });
      resetForm();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <div>
        <RestaurantCard restaurant={restaurant} />
        <div className={classes.reviewContainer}>
          <Typography variant="h5">Reviews</Typography>
          {restaurant.numberOfReviews <= 0 && <Typography>There are no reviews</Typography>}
          {restaurant.numberOfReviews > 0 && (
            <Fragment>
              <ReviewComponent label="Highest Review" review={restaurant.highestReview} />
              <ReviewComponent label="Lowest Review" review={restaurant.lowestReview} />
              <ReviewComponent label="Latest Review" review={restaurant.latestReview} />
            </Fragment>
          )}
        </div>
        <form noValidate onSubmit={onSubmit}>
          <div className={classes.reviewContainer}>
            <Typography variant="h5">Leave a Review</Typography>
            <div>
              <TextField
                id="date"
                name="date"
                margin="normal"
                required
                label="Visit Date"
                type="date"
                {...getFieldProps("visitDate")}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </div>
            <div>
              <Typography component="legend">Rating</Typography>
              <Rating
                name="rating"
                value={parseInt(getFieldProps("rating").value)}
                onChange={(event, newValue) => {
                  newValue && getFieldProps("rating").onChange(newValue?.toString());
                }}
              />
            </div>
            <TextField
              variant="outlined"
              margin="normal"
              multiline
              rows={4}
              id="comment"
              label="Comment"
              name="comment"
              {...getFieldProps("comment")}
            />
            <div>
              <Button type="submit" variant="contained" color="primary" className={classes.submit}>
                Submit
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
