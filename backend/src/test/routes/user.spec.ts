jest.mock("../../main/services/user", () => ({
  createUser: jest.fn(),
}));

import supertest from "supertest";
import server from "../../main/server";
import * as user from "../../main/services/user";

const mockCreateUser = user.createUser as jest.Mock;

describe("user route", () => {
  it("canary", () => {
    expect(true).toBe(true);
  });

  it("user can sign up", async () => {
    const id = "NEW_USER_ID";
    const email = "user@domain.com";
    const password = "password";
    mockCreateUser.mockImplementationOnce(() => id);

    await supertest(server)
      .post("/api/auth/signUp")
      .send({ email, password })
      .expect(201)
      .expect((response) => {
        expect(mockCreateUser).toBeCalledWith({
          email,
          password,
          role: "user",
        });
        expect(response.body).toEqual({ id });
      });
  });
});
