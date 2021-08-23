import React from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import { Review } from "common/utils/models";
import { useForm } from "common/hooks/useForm";
import Typography from "@material-ui/core/Typography";
import Rating from "@material-ui/lab/Rating";
import get from "lodash/get";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (request: Record<string, unknown>) => Promise<void>;
  review: Review | undefined;
}

export const AddOrUpdateReviewModal = ({ isOpen, onClose, review, onSubmit }: Props) => {
  const id = get(review, "id");
  const { getFieldProps, values, isDirty, dirty } = useForm({
    initialValues: {
      visitDate: get(review, "visitDate", ""),
      rating: get(review, "rating", 1).toString(),
      comment: get(review, "comment", ""),
    },
    onAnyChangeValidator: () => Promise.resolve({}),
  });

  const handleSubmit = () => {
    onSubmit({
      id,
      visitDate: dirty.visitDate ? values.visitDate : undefined,
      rating: parseInt(values.rating),
      comment: dirty.comment ? values.comment : undefined,
    });
  };

  return (
    <Dialog open={isOpen} onClose={onClose} aria-labelledby="reviews-dialog" maxWidth="xs">
      <DialogTitle>{id ? "Update" : "Add"} Review</DialogTitle>
      <DialogContent>
        <TextField
          id="date"
          name="date"
          margin="normal"
          fullWidth
          required
          label="Visit Date"
          type="date"
          {...getFieldProps("visitDate")}
          InputLabelProps={{
            shrink: true,
          }}
        />
        <Typography component="legend">Rating</Typography>
        <Rating
          name="rating"
          value={parseInt(getFieldProps("rating").value)}
          onChange={(event, newValue) => {
            newValue && getFieldProps("rating").onChange(newValue?.toString());
          }}
        />
        <TextField
          variant="outlined"
          margin="normal"
          fullWidth
          multiline
          rows={4}
          id="comment"
          label="Comment"
          name="comment"
          {...getFieldProps("comment")}
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
