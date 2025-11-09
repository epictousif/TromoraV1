const dotenv = require('dotenv');
dotenv.config();
const app = require('./app');
const errorHandler = require('./middleware/errorHandler');

// Initialize Redis client
require('./utils/redisClient');


app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});