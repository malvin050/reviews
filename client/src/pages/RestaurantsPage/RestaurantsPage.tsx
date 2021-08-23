import React from "react";
import CircularProgress from "@material-ui/core/CircularProgress";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { useApiClient } from "common/hooks/useApiClient";
import { RestaurantCard } from "common/RestaurantCard/RestaurantCard";
import { Restaurant } from "common/utils/models";
import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import { buildUrl } from "common/utils";
import { RESTAURANT_URL } from "common/constants/routerConstants";

export const RestaurantsPage = () => {
  const { apiClient } = useApiClient();
  const { error, isFetching, data: response } = useQuery(
    ["getRestaurants"],
    () => apiClient({ method: "GET", url: "/restaurant" }),
    {
      retry: false,
    },
  );

  if (isFetching) {
    return <CircularProgress />;
  }

  if (error) {
    return <Typography variant="h4">Unable to load data</Typography>;
  }

  const restaurants: Restaurant[] = response.data.data.restaurants;

  return (
    <div>
      <Typography variant="h4">Restaurants</Typography>
      <div>
        <Grid container spacing={4}>
          {restaurants.map((restaurant) => (
            <Grid key={restaurant.id} item>
              <Link to={buildUrl(RESTAURANT_URL, { id: restaurant.id })} style={{ textDecoration: 'none' }}>
                <RestaurantCard restaurant={restaurant} />
              </Link>
            </Grid>
          ))}
        </Grid>
      </div>
    </div>
  );
};
