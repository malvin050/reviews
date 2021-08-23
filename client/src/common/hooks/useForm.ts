import { useEffect, useReducer } from "react";
import mapValues from "lodash/mapValues";

enum ActionType {
  SET_ERRORS = "SET_ERRORS",
  SET_FIELD_VALUE = "SET_FIELD_VALUE",
  FIELD_BLUR = "FIELD_BLUR",
  SET_FIELD_TOUCHED = "SET_FIELD_TOUCHED",
  SET_FIELDS_TOUCHED = "SET_FIELDS_TOUCHED",
  SET_FORM_VALUES = "SET_FORM_VALUES",
  RESET_FORM = "RESET_FORM",
}

interface FormState {
  initialValues: { [key: string]: string | boolean };
  values: { [key: string]: string | boolean };
  errors: { [key: string]: string };
  touched: { [key: string]: boolean };
  dirty: { [key: string]: boolean };
}

interface Action {
  type: ActionType;
  key?: any;
  payload?: any;
  value?: any;
}

const reducer = (state: FormState, action: Action) => {
  switch (action.type) {
    case ActionType.SET_ERRORS:
      return {
        ...state,
        errors: action.payload,
      };
    case ActionType.SET_FIELD_VALUE:
      return {
        ...state,
        values: {
          ...state.values,
          [action.key]: action.value,
        },
        dirty: {
          ...state.dirty,
          [action.key]: action.value !== state.initialValues[action.key],
        },
      };
    case ActionType.SET_FORM_VALUES:
      const values = { ...state.values, ...action.payload };
      const dirty = {} as any;
      Object.keys(action.payload).forEach((key) => {
        dirty[key] = values[key] !== state.initialValues[key];
      });
      return {
        ...state,
        values,
        dirty,
      };
    case ActionType.FIELD_BLUR:
      return {
        ...state,
        values: {
          ...state.values,
          [action.key]: action.value,
        },
        dirty: {
          ...state.dirty,
          [action.key]: action.value !== state.initialValues[action.key],
        },
        touched: {
          ...state.touched,
          [action.key]: true,
        },
      };
    case ActionType.SET_FIELD_TOUCHED:
      return {
        ...state,
        touched: {
          ...state.touched,
          [action.key]: action.value,
        },
      };
    case ActionType.SET_FIELDS_TOUCHED:
      return {
        ...state,
        touched: mapValues(state.values, () => action.value),
      };
    case ActionType.RESET_FORM:
      return {
        ...action.payload,
      };
    default:
      return state;
  }
};

interface UseFormProps {
  initialValues: { [key: string]: string | boolean };
  onAnyChangeValidator: (values: Record<string, unknown>) => Promise<Record<string, unknown>>;
}

function determineIfReactEvent(
  toBeDetermined: React.ChangeEvent<HTMLInputElement> | any,
): toBeDetermined is React.ChangeEvent<HTMLInputElement> {
  if ((toBeDetermined as React.ChangeEvent<HTMLInputElement>).type) {
    return true;
  }
  return false;
}

export const useForm = ({ initialValues, onAnyChangeValidator }: UseFormProps) => {
  const initialState = {
    initialValues,
    values: initialValues,
    errors: {},
    touched: mapValues(initialValues, () => false),
    dirty: mapValues(initialValues, () => false),
  };
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const validationWrapper = async () => {
      const errors = await onAnyChangeValidator(state.values);
      dispatch({ type: ActionType.SET_ERRORS, payload: errors });
    };
    validationWrapper();
  }, [state.values]);

  const handleChange = (fieldName: string) => (eventOrValue: React.ChangeEvent<HTMLInputElement> | any) =>
    dispatch({
      type: ActionType.SET_FIELD_VALUE,
      key: fieldName,
      value: determineIfReactEvent(eventOrValue) ? eventOrValue.target.value : eventOrValue,
    });

  const handleBlur = (fieldName: string) => (eventOrValue: React.ChangeEvent<HTMLInputElement> | any) =>
    dispatch({
      type: ActionType.FIELD_BLUR,
      key: fieldName,
      value: determineIfReactEvent(eventOrValue) ? eventOrValue.target.value : eventOrValue,
    });

  const setFieldTouched = (fieldName: string) =>
    dispatch({ type: ActionType.SET_FIELD_TOUCHED, key: fieldName, value: true });
  const setFieldUntouched = (fieldName: string) =>
    dispatch({ type: ActionType.SET_FIELD_TOUCHED, key: fieldName, value: false });

  const setFieldsTouched = () => dispatch({ type: ActionType.SET_FIELDS_TOUCHED, value: true });
  const setFieldsUntouched = () => dispatch({ type: ActionType.SET_FIELDS_TOUCHED, value: false });

  const setFormValues = (values: { [key: string]: string | boolean }) =>
    dispatch({ type: ActionType.SET_FORM_VALUES, payload: values });

  const resetForm = (newInitialValues: { [key: string]: string | boolean }) => {
    const initialValues = newInitialValues || state.initialValues;
    const values = newInitialValues || state.initialValues;
    dispatch({
      type: ActionType.RESET_FORM,
      payload: { ...initialState, initialValues, values },
    });
  };

  const clearErrors = () => dispatch({ type: ActionType.SET_ERRORS, payload: {} });

  const getFieldProps = (fieldName: string) => ({
    value: state.values[fieldName],
    onChange: handleChange(fieldName),
    onBlur: handleBlur(fieldName),
  });

  const hasErrors = Object.keys(state.errors).length !== 0;
  const isDirty = Object.values(state.dirty).some((isFieldDirty) => isFieldDirty);

  return {
    getFieldProps,
    hasErrors,
    isDirty,
    setFieldTouched,
    setFieldUntouched,
    setFieldsTouched,
    setFieldsUntouched,
    resetForm,
    clearErrors,
    setFormValues,
    ...state,
  };
};
