const Koa = require("koa");
const path = require("path");
const cors = require("kcors");
const bodyParser = require("koa-bodyparser");

const app = new Koa();
const bcrypt = require("bcrypt");
const { User } = require("./models");

const PORT = process.env.PORT || 4000;
app.use(cors());
app.use(bodyParser());

require("./routes")(app);

app.listen(PORT, console.log(`Server running at port ${PORT}`));
