const app = require('./app')

// * Initialize MongoDB
require('./versions/v1/helpers/mongodb')

// * Initialize Redis
require('./versions/v1/helpers/redis')

const PORT = process.env.PORT || 5000

app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`))