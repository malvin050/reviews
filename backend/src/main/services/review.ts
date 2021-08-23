import admin from "firebase-admin";

const RESTAURANT_COLLECTION = "restaurants";
const REVIEW_COLLECTION = "reviews";

export const getReviews = async (restaurantId: string) => {
  const snapshot = await admin
    .firestore()
    .collection(RESTAURANT_COLLECTION)
    .doc(restaurantId)
    .collection(REVIEW_COLLECTION)
    .get();
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

export const getReview = async (restaurantId: string, reviewId: string) => {
  const snapshot = await admin
    .firestore()
    .collection(RESTAURANT_COLLECTION)
    .doc(restaurantId)
    .collection(REVIEW_COLLECTION)
    .doc(reviewId)
    .get();
  return snapshot.data();
};

export const createReview = async ({
  restaurantId,
  visitDate,
  rating,
  comment,
}: {
  restaurantId: string;
  visitDate: string;
  rating: number;
  comment: string;
}) => {
  const restaurantRef = admin
    .firestore()
    .collection(RESTAURANT_COLLECTION)
    .doc(restaurantId);
  const reviewRef = restaurantRef.collection(REVIEW_COLLECTION).doc();
  const review = {
    id: reviewRef.id,
    createdAt: admin.firestore.Timestamp.now().toDate().toISOString(),
    visitDate,
    rating,
    comment,
  };

  await admin.firestore().runTransaction(async (transaction) => {
    const restaurantSnapshot = await transaction.get(restaurantRef);
    const restaurant = restaurantSnapshot.data()!;
    const newNumberOfReviews = restaurant.numberOfReviews + 1;

    const ratingTotal = restaurant.averageRating * restaurant.numberOfReviews;
    const newAverageRating = (ratingTotal + rating) / newNumberOfReviews;

    const lowestReview = restaurant.lowestReview;
    const newLowestReview =
      (lowestReview || { rating: Number.POSITIVE_INFINITY }).rating > rating
        ? review
        : lowestReview;

    const highestReview = restaurant.highestReview;
    const newHighestReview =
      (highestReview || { rating: Number.NEGATIVE_INFINITY }).rating < rating
        ? review
        : highestReview;

    transaction.update(restaurantRef, {
      averageRating: newAverageRating,
      numberOfReviews: newNumberOfReviews,
      lowestReview: newLowestReview,
      highestReview: newHighestReview,
      latestReview: review,
    });
    transaction.set(reviewRef, review);
  });

  return reviewRef.id;
};

export const deleteReview = async (restaurantId: string, reviewId: string) => {
  const restaurantRef = admin
    .firestore()
    .collection(RESTAURANT_COLLECTION)
    .doc(restaurantId);
  const reviewsRef = restaurantRef.collection(REVIEW_COLLECTION);
  const reviewRef = reviewsRef.doc(reviewId);

  await admin.firestore().runTransaction(async (transaction) => {
    const restaurantSnapshot = await transaction.get(restaurantRef);
    const reviewSnapshot = await transaction.get(reviewRef);
    const restaurant = restaurantSnapshot.data()!;
    const review = reviewSnapshot.data()!;

    const newNumberOfReviews = restaurant.numberOfReviews - 1;

    const ratingTotal = restaurant.averageRating * restaurant.numberOfReviews;
    const newAverageRating =
      newNumberOfReviews > 0
        ? (ratingTotal - review.rating) / newNumberOfReviews
        : 0;

    const lowestReview = restaurant.lowestReview;
    let newLowestReview = newNumberOfReviews > 0 ? lowestReview : null;
    if (newNumberOfReviews > 0 && lowestReview.id === reviewId) {
      console.log("updating lowest");
      const snapshot = await reviewsRef.orderBy("rating", "asc").limit(2).get();
      newLowestReview = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))[1];
    }

    const highestReview = restaurant.highestReview;
    let newHighestReview = newNumberOfReviews > 0 ? highestReview : null;
    if (newNumberOfReviews > 0 && highestReview.id === reviewId) {
      console.log("updating highest");
      const snapshot = await reviewsRef
        .orderBy("rating", "desc")
        .limit(2)
        .get();
      newHighestReview = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))[1];
    }

    const latestReview = restaurant.latestReview;
    let newLatestReview = newNumberOfReviews > 0 ? latestReview : null;
    if (newNumberOfReviews > 0 && latestReview.id === reviewId) {
      console.log("updating latest");
      const snapshot = await reviewsRef
        .orderBy("createdAt", "desc")
        .limit(2)
        .get();
      newLatestReview = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))[1];
    }

    transaction.update(restaurantRef, {
      averageRating: newAverageRating,
      numberOfReviews: newNumberOfReviews,
      lowestReview: newLowestReview,
      highestReview: newHighestReview,
      latestReview: newLatestReview,
    });
    transaction.delete(reviewRef);
  });
};

export const updateReview = async (
  restaurantId: string,
  reviewId: string,
  {
    visitDate,
    rating,
    comment,
  }: {
    visitDate: string;
    rating: number;
    comment: string;
  }
) => {
  const restaurantRef = admin
    .firestore()
    .collection(RESTAURANT_COLLECTION)
    .doc(restaurantId);
  const reviewsRef = restaurantRef.collection(REVIEW_COLLECTION);
  const reviewRef = reviewsRef.doc(reviewId);

  await admin.firestore().runTransaction(async (transaction) => {
    const restaurantSnapshot = await transaction.get(restaurantRef);
    const reviewSnapshot = await transaction.get(reviewRef);
    const restaurant = restaurantSnapshot.data()!;
    const review = reviewSnapshot.data()!;
    const updatedReview = {
      visitDate: visitDate || reviewSnapshot.data()!.visitDate,
      rating: rating || reviewSnapshot.data()!.rating,
      comment: comment || reviewSnapshot.data()!.comment,
      createdAt: reviewSnapshot.data()!.createdAt,
    };

    const ratingTotal = restaurant.averageRating * restaurant.numberOfReviews;
    const newAverageRating =
      (ratingTotal - review.rating + rating) / restaurant.numberOfReviews;

    const lowestReview = restaurant.lowestReview;
    const newLowestReview =
      lowestReview.rating > rating || lowestReview.id === reviewId
        ? updatedReview
        : lowestReview;

    const highestReview = restaurant.highestReview;
    const newHighestReview =
      highestReview.rating < rating || highestReview.id === reviewId
        ? updatedReview
        : highestReview;

    const latestReview = restaurant.latestReview;
    const newLatestReview =
      latestReview.id === reviewId ? updatedReview : latestReview;

    transaction.update(restaurantRef, {
      averageRating: newAverageRating,
      lowestReview: newLowestReview,
      highestReview: newHighestReview,
      latestReview: newLatestReview,
    });
    transaction.update(reviewRef, updatedReview);
  });
};
