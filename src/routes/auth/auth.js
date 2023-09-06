const register = require("../user/user.query").register
const {mail_exist, login} = require("../user/user.query")
const genToken = require("../../middleware/auth").genToken

module.exports = function(app, bcrypt) {
    app.post('/register', (req, res) => {

        var email = req.body["email"];
        var password = req.body["password"];
        var name = req.body["name"];
        var firstname = req.body["firstname"]

        if (email == undefined || password == undefined || name == undefined || firstname == undefined) {
            return res.status(400).json({"msg" : "Bad parameter"})
        }

        if (email === undefined || password == undefined || name === undefined || firstname === undefined) {
            return res.status(500).json({ "msg": "internal server error" });
        }

        mail_exist(email, function(callback) {
            if (callback) {
                res.status(409).json({"msg":"account already exist"});
                return;
            } else {
                password = bcrypt.hashSync(password, 10);
                register(res, email, password, name, firstname);
                return;
            }
        });
    });

    app.post("/login", (req, res) => {
        var email = req.body["email"];
        var password = req.body["password"];

        if (email == undefined || password == undefined) {
            return res.status(400).json({"msg" : "Bad parameter"})
        }

        mail_exist(email, function(callback) {
            if (!callback) {
                res.status(404).json({"msg":"Not found"});
                return;
            } else {
                login(email, password, bcrypt, res, function(callback, id) {
                    if (callback) {
                        const token = genToken(id)
                        res.json({token});
                    } else {
                        res.status(409).json({"msg":"wrong password"});
                    }
                });
            }
        });
    });
}
