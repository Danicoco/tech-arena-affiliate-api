import app from "./server";

const { PORT, NODE_ENV } = process.env;

// Start the server
app.listen(PORT, () => {
  console.log(`Environment is ${NODE_ENV}`);
  console.log(`Server started on port: ${PORT}`);
  console.log(`Connected to database: ${process.env.DB_NAME}`);
});
