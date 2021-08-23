import app from "./src/main/server";

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log("API server started on " + PORT));
