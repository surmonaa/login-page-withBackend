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
    const hashedPassword =  await bcrypt.hash(req.body.password, 10);
    const newUser = {
        id: Date.now(),
        email: req.body.email,
        password: hashedPassword
    }

    users.push(newUser);

    fs.writeFileSync("./data/users.json", JSON.stringify(users, null, 2));

    res.redirect("/");
})

app.post("/login", (req, res) => {
    const plainPassword = req.body.password;
    const email = req.body.email;
    const user = users.find(u =>
        u.email === email
    );

     if (!user) {
        return res.send("User not found");
    }

    const isMatch = bcrypt.compareSync(plainPassword, user.password);


    if(isMatch){
        req.session.user = {
        id: user.id,
        email: user.email
    };
        res.redirect("/dashboard")
    }else {
        res.send("password is incorrect");
    }    
});

app.post("/logout", (req, res) => {
    req.session.destroy(() => {
        res.redirect("/");
    })
})

app.listen(port);
