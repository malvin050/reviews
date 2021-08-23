export interface Review {
  id: string;
  createdAt: string;
  visitDate: string;
  rating: number;
  comment: string;
}

export interface Restaurant {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  image: string;
  averageRating: number;
  numberOfReviews: number;
  lowestReview: Review;
  highestReview: Review;
  latestReview: Review;
}

export interface User {
  id: string;
  email: string;
  password: string;
  role: "user" | "admin";
}
