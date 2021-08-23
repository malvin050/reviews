import React from "react";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";
import { Restaurant } from "common/utils/models";
import { makeStyles } from "@material-ui/core/styles";
import Rating from "@material-ui/lab/Rating";
import Tooltip from "@material-ui/core/Tooltip";

const useStyles = makeStyles({
  cardRoot: {
    width: 300,
  },
  media: {
    height: 140,
  },
  rating: {
    display: "flex",
    alignItems: "center",
  },
  tooltip: {
    margin: 0,
  },
});

interface Props {
  restaurant: Restaurant;
}

export const RestaurantCard = ({ restaurant }: Props) => {
  const classes = useStyles();
  return (
    <Card key={restaurant.id} className={classes.cardRoot}>
      <CardMedia className={classes.media} image={restaurant.image} title={restaurant.name} />
      <CardContent>
        <Typography gutterBottom variant="h5" component="h2">
          {restaurant.name}
        </Typography>
        <div className={classes.rating}>
          <Tooltip classes={{ tooltip: classes.tooltip }} title={restaurant.averageRating.toPrecision(2)}>
            <div>
              <Rating
                precision={0.1}
                name="averageRating"
                value={Number(restaurant.averageRating.toPrecision(2))}
                readOnly
              />
            </div>
          </Tooltip>
          <Typography variant="body2" color="textSecondary" component="p">
            {`${restaurant.numberOfReviews || "No"} Reviews`}
          </Typography>
        </div>
        <Typography variant="body2" color="textSecondary" component="p">
          {restaurant.address}
        </Typography>
        <Typography variant="body2" color="textSecondary" component="p">
          {`${restaurant.city}, ${restaurant.state} ${restaurant.zipCode}`}
        </Typography>
      </CardContent>
    </Card>
  );
};
