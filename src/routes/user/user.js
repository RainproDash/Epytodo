const { get_all_user, get_all_todos_from_id, delete_user_from_id, get_user_id_from_email, get_user_info, update_user_from_id, get_user_info_email } = require("./user.query");

module.exports = function(app, bcrypt) {
    app.get("/user", (req, res) => {
        get_user_info(req.decoded.id, res);
    });
    app.get("/user/todos", (req, res) => {
        get_all_todos_from_id(req.decoded.id, res);
    });
    app.delete("/users/:id", (req, res) => {
        delete_user_from_id(req.params.id, res);
    });
    app.get("/users/:data", (req, res) => {
        if (req.params.data == undefined) {
            return res.status(400).json({"msg" : "Bad parameter"});
        }
        if (req.params.data.includes("@")) {
            return get_user_info_email(req.params.data, res);
        }
        get_user_info(req.params.data, res);
    });
    app.put("/users/:id", (req, res) => {
        update_user_from_id(req, res);
    });
}