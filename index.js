import express from "express";
import bcrypt from "bcrypt";
import fs from "fs";
import session from "express-session";
import {dirname} from "path";
import {fileURLToPath} from "url";
const __dirname = dirname(fileURLToPath(import.meta.url)); 

const app = express();
const port = 3000;

app.use(session({
    secret: "mySecretKey123",
    resave: false,
    saveUninitialized: false
}));

app.use((req, res, next) => {
    req.flash = (type, message) => {
        req.session.flash = { type, message };
    };

    res.locals.flash = req.session.flash;
    delete req.session.flash;

    next();
});

const users = JSON.parse(
    fs.readFileSync("./data/users.json")
);

function isLoggedIn(req, res, next) {
    if (req.session.user) {
        next();
    } else {
        res.redirect("/");
    }
};

function redirectIfLoggedIn(req, res, next) {
    if (req.session.user) {
        return res.redirect("/dashboard");
    }
    next();
}

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.get("/", redirectIfLoggedIn, (req, res) => {
    res.render("login.ejs");
});

app.get("/register", (req, res) => {
    res.render("register.ejs")
});

app.get("/dashboard", isLoggedIn, (req, res) => {
    res.render("dashboard.ejs", {user: req.session.user });
});

app.post("/register" , async (req, res) => {
    const existingUser = users.find(
        u => u.email === req.body.email
    );

    if (existingUser) {
        req.flash("error", "Email already exists");
        return res.redirect("/register");
    }
    
    const hashedPassword =  await bcrypt.hash(req.body.password, 10);
    const newUser = {
        id: Date.now(),
        email: req.body.email,
        password: hashedPassword
    }

    users.push(newUser);

    fs.writeFileSync("./data/users.json", JSON.stringify(users, null, 2));
    
    req.flash("success", "Account created successfully");
    res.redirect("/");
})

app.post("/login", async (req, res) => {
    const plainPassword = req.body.password;
    const email = req.body.email;
    const user = users.find(u =>
        u.email === email
    );

     if (!user) {
        req.flash("error", "User not found");
        return res.redirect("/");

    }

    const isMatch = await  bcrypt.compare(plainPassword, user.password);
   
    if (isMatch) {
    req.session.user = {
        id: user.id,
        email: user.email
    };

    req.flash("success", "Welcome back!");
    res.redirect("/dashboard");
} else {
    req.flash("error", "Password is incorrect");
    res.redirect("/");
};
});

app.post("/logout", (req, res) => {
    req.session.flash = {
        type: "success",
        message: "Logged out successfully"
    };

    req.session.user = null;
    res.redirect("/");
});

app.listen(port);
