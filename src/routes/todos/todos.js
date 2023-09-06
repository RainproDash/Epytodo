const {get_all_todos, get_todo_by_id, create_todo, update_todo, delete_todo} = require("./todos.query");


module.exports = function(app, bcrypt) {
    app.get("/todos", (req, res) => {
        get_all_todos(res);
    })
    app.get("/todos/:id", (req, res) => {
        get_todo_by_id(res, req.params.id);
    })
    app.post("/todos", (req, res) => {
        var title = req.body["title"];
        var desc = req.body["description"];
        var due_time = req.body["due_time"];
        var status = req.body["status"];
        var id = req.body["user_id"];

        if (title == undefined || desc == undefined || due_time == undefined || status == undefined || id == undefined) {
            return res.status(400).json({"msg" : "Bad parameter"});
        }
        create_todo(res, title, desc, due_time, status, id);
    })
    app.put("/todos/:id", (req, res) => {
        var title = req.body["title"];
        var desc = req.body["description"];
        var due_time = req.body["due_time"];
        var status = req.body["status"];
    
        if (title == undefined || desc == undefined || due_time == undefined || status == undefined) {
            return res.status(400).json({"msg" : "Bad parameter"});
        }
        update_todo(res, req.params.id, title, desc, due_time, status);
    })
    app.delete("/todos/:id", (req, res) => {
        if (req.params.id == undefined) {
            return res.status(400).json({"msg" : "Bad parameter"});
        }
        delete_todo(res, req.params.id);
    })
}
