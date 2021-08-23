import React, { useContext } from "react";
import axios, { AxiosRequestConfig } from "axios";
import { UserContext } from "common/contexts/UserContext";
import { useHistory } from "react-router";
import { SIGN_IN_PAGE_URL } from "common/constants/routerConstants";
import { removeSessionStorageItem } from "common/utils/sessionStorage";
import { removeLocalStorageItem } from "common/utils/localStorage";

export const useApiClient = () => {
  const { idToken, setIdToken } = useContext(UserContext);
  const history = useHistory();
  const baseOptions = {
    baseURL: "/api",
    headers: {
      "Content-Type": "application/json",
      ...(idToken ? { Authorization: "Bearer " + idToken } : {}),
    },
  };

  const apiClient = (options: AxiosRequestConfig): Promise<any> =>
    axios({ ...baseOptions, ...options }).catch((error) => {
      if (error.response.status === 401) {
        setIdToken("");
        removeLocalStorageItem("idToken");
        removeSessionStorageItem("idToken");
        return history.push(SIGN_IN_PAGE_URL);
      }
      throw error;
    });

  return { apiClient };
};
