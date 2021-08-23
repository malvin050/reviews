import admin from "firebase-admin";

export const createUser = async ({
  email,
  password,
  role,
}: {
  email: string;
  password: string;
  role: "user" | "admin";
}) => {
  const { uid } = await admin.auth().createUser({
    email,
    password,
  });
  await admin.auth().setCustomUserClaims(uid, { role });
  return uid;
};

export const listUsers = async (nextPageToken: string = "0") => {
  const listUsersResult = await admin.auth().listUsers(1000, nextPageToken);
  return listUsersResult.users.map((userRecord) => userRecord.toJSON());
};

export const updateUser = async (id : string,{
  email,
  password,
  role,
}: {
  email: string;
  password: string;
  role: "user" | "admin";
}) => {
  if (email || password) {
    await admin.auth().updateUser(id, {
      email: email || undefined,
      password: password || undefined,
    });
  }
  if (role) {
    await admin.auth().setCustomUserClaims(id, { role });
  }
};

export const deleteUser = (id: string) => {
  return admin.auth().deleteUser(id);
};
