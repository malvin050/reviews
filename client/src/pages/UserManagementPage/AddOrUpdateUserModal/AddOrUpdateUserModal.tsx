import React from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import MenuItem from "@material-ui/core/MenuItem";
import { User } from "common/utils/models";
import { useForm } from "common/hooks/useForm";
import get from "lodash/get";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (request: Record<string, unknown>) => Promise<void>;
  user: User | undefined;
}

const ROLES = ["user", "admin"];

export const AddOrUpdateUserModal = ({ isOpen, onClose, user, onSubmit }: Props) => {
  const id = get(user, "id");
  const { getFieldProps, values, isDirty, dirty } = useForm({
    initialValues: { email: get(user, "email", ""), role: get(user, "role", ""), password: "" },
    onAnyChangeValidator: () => Promise.resolve({}),
  });

  const handleSubmit = () => {
    onSubmit({
      id,
      email: dirty.email ? values.email : undefined,
      password: dirty.password ? values.password : undefined,
      role: dirty.role ? values.role : undefined,
    });
  };

  return (
    <Dialog open={isOpen} onClose={onClose} aria-labelledby="users-dialog" maxWidth="xs">
      <DialogTitle>{id ? "Update" : "Add"} User</DialogTitle>
      <DialogContent >
        <TextField
          variant="outlined"
          margin="normal"
          fullWidth
          required
          id="email"
          label="Email Address"
          name="email"
          {...getFieldProps("email")}
        />
        <TextField
          variant="outlined"
          margin="normal"
          fullWidth
          required
          name="password"
          label="Password"
          type="password"
          id="password"
          {...getFieldProps("password")}
        />
        <TextField
          variant="outlined"
          margin="normal"
          fullWidth
          required
          id="role"
          name="role"
          label="Role"
          {...getFieldProps("role")}
          select
        >
          {ROLES.map((value) => (
            <MenuItem key={value} value={value}>
              {value}
            </MenuItem>
          ))}
        </TextField>
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
