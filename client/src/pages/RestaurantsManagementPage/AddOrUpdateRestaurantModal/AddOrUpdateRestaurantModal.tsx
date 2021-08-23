import React from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import { Restaurant } from "common/utils/models";
import { useForm } from "common/hooks/useForm";
import get from "lodash/get";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (request: Record<string, unknown>) => Promise<void>;
  restaurant: Restaurant | undefined;
}

export const AddOrUpdateRestaurantModal = ({ isOpen, onClose, restaurant, onSubmit }: Props) => {
  const id = get(restaurant, "id");
  const { getFieldProps, values, isDirty, dirty } = useForm({
    initialValues: {
      name: get(restaurant, "name", ""),
      address: get(restaurant, "address", ""),
      city: get(restaurant, "city", ""),
      state: get(restaurant, "state", ""),
      zipCode: get(restaurant, "zipCode", ""),
      image: get(restaurant, "image", ""),
    },
    onAnyChangeValidator: () => Promise.resolve({}),
  });

  const handleSubmit = () => {
    onSubmit({
      id,
      name: dirty.name ? values.name : undefined,
      address: dirty.address ? values.address : undefined,
      city: dirty.city ? values.city : undefined,
      state: dirty.state ? values.state : undefined,
      zipCode: dirty.zipCode ? values.zipCode : undefined,
      image: dirty.image ? values.image : undefined,
    });
  };

  return (
    <Dialog open={isOpen} onClose={onClose} aria-labelledby="restaurant-dialog" maxWidth="xs">
      <DialogTitle>{id ? "Update" : "Add"} Restaurant</DialogTitle>
      <DialogContent>
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="name"
          label="Name"
          name="name"
          {...getFieldProps("name")}
        />
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="address"
          label="Address"
          name="address"
          {...getFieldProps("address")}
        />
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="city"
          label="City"
          name="city"
          {...getFieldProps("city")}
        />
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="state"
          label="State"
          name="state"
          {...getFieldProps("state")}
        />
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="zipCode"
          label="Zip Code"
          name="zipCode"
          {...getFieldProps("zipCode")}
        />
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="image"
          label="Link to Image"
          name="image"
          {...getFieldProps("image")}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button disabled={!isDirty} onClick={handleSubmit} color="primary" variant="contained">
          {id ? "Update" : "Add"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
