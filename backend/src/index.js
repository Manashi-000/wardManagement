import express from "express"
// import bodyParser from "body-parser"
import cors from "cors"

const app = express()

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));

app.use("/uploads", express.static("uploads"));

app.use(cors({
    origin: ["http://localhost:3000", "https://expo.dev/@manashi/frontend"],
    methods: ["POST", "GET", "PUT", "DELETE"],
    credentials: true,
}))

import usersRouter from "./routes/user.route.js";
import adminRouter from "./routes/admin.route.js"
import organizationRouter from "./routes/organization.route.js";
import complaintRouter from "./routes/complaint.route.js";
import emergencyRouter from "./routes/emergency.route.js";
import memberRouter from "./routes/member.route.js";

app.use("/api/v1/users", usersRouter)
app.use("/api/v1/organizations", organizationRouter)
app.use("/api/v1/admins", adminRouter)
app.use("/api/v1/complaints",complaintRouter)
app.use("/api/v1/emergency",emergencyRouter)
app.use("/api/v1/member",memberRouter)

app.post("/create-member", (req, res) => {
  console.log("REQ BODY:", req.body);
  res.json({ received: req.body });
});

const port = process.env.PORT || 8000
app.listen(port, () => {
    console.log("application is listenning to port", port)
})