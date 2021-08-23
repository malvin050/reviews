import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react";
import { SignInPage } from "./SignInPage";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import { UserContext } from "common/contexts/UserContext";
import { RESTAURANTS_URL } from "common/constants/routerConstants";

const mockSignInWithEmailAndPassword = jest.fn();
jest.mock("firebase", () => ({
  auth: () => ({ signInWithEmailAndPassword: mockSignInWithEmailAndPassword }),
}));
const mockUseHistoryPush = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useHistory: () => ({ push: mockUseHistoryPush }),
}));

const queryClient = new QueryClient();
const TOKEN = "MY_TOKEN";
const mockSetIdToken = jest.fn();
const renderHelper = () =>
  render(
    <BrowserRouter>
      <UserContext.Provider
        value={{
          idToken: "",
          setIdToken: mockSetIdToken,
        }}
      >
        <QueryClientProvider client={queryClient}>
          <SignInPage />
        </QueryClientProvider>
      </UserContext.Provider>
    </BrowserRouter>,
  );

describe("SignInPage", () => {
  beforeEach(() => {
    mockSignInWithEmailAndPassword.mockImplementation(() =>
      Promise.resolve({
        user: { getIdToken: () => TOKEN },
      }),
    );
  });

  it("renders without crashing", async () => {
    const { container } = renderHelper();
    expect(container).toBeTruthy();
  });

  it("user signs in successfully", async () => {
    const email = "name@domain.com";
    const password = "password";
    const { container, getByText } = renderHelper();

    const emailInput = container.querySelector("input#email") as HTMLInputElement;
    fireEvent.change(emailInput, {
      target: { value: email },
    });
    const passwordInput = container.querySelector("input#password") as HTMLInputElement;
    fireEvent.change(passwordInput, {
      target: { value: password },
    });

    fireEvent.click(getByText("Sign In"));

    await waitFor(() => {
      expect(mockSignInWithEmailAndPassword).toBeCalledWith(email, password);
      expect(mockSetIdToken).toBeCalledWith(TOKEN);
      expect(mockUseHistoryPush).toBeCalledWith(RESTAURANTS_URL);
    });
  });
});
