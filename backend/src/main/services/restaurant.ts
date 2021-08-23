import admin from "firebase-admin";

const COLLECTION = "restaurants";

export const getRestaurant = async (id: string) => {
  const snapshot = admin.firestore().collection(COLLECTION).doc(id);
  const doc = await snapshot.get();
  return { id, ...doc.data() };
};

export const getRestaurants = async () => {
  const snapshot = await admin
    .firestore()
    .collection(COLLECTION)
    .orderBy("averageRating", "desc")
    .get();
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

export const createRestaurant = async ({
  name,
  address,
  city,
  state,
  zipCode,
  image,
}: {
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  image: string;
}) => {
  const restaurantRef = admin.firestore().collection(COLLECTION).doc();
  await restaurantRef.create({
    name,
    address,
    city,
    state,
    zipCode,
    image,
    numberOfReviews: 0,
    averageRating: 0,
    lowestReview: null,
    highestReview: null,
    latestReview: null,
  });
  return restaurantRef.id;
};

export const deleteRestaurant = (id: string) => {
  const snapshot = admin.firestore().collection(COLLECTION).doc(id);
  return snapshot.delete();
};

export const updateRestaurant = (
  id: string,
  {
    name,
    address,
    city,
    state,
    zipCode,
    image,
  }: {
    name: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    image: string;
  }
) => {
  const snapshot = admin.firestore().collection(COLLECTION).doc(id);
  console.log({
    name,
    address,
    city,
    state,
    zipCode,
    image,
  });
  return snapshot.update({
    name,
    address,
    city,
    state,
    zipCode,
    image,
  });
};
