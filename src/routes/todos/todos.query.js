var db = require('../../config/db');

exports.get_all_todos = function(res) {
    db.query("SELECT * FROM `todo`", function(error, result, fields) {
        res.status(200).json(result);
    });
}

exports.get_todo_by_id = function(res, id) {
    db.query("SELECT * FROM `todo` WHERE `id` = ?", [id], function(error, result, fields) {
        if (error) {
            return res.status(500).json({"msg": "Internal server error"});
        }
        if (!result) {
            return res.status(404).json({"msg": "Not found"});
        }
        res.status(200).json(result);
    });
}

exports.create_todo = function(res, title, desc, due_time, status, id) {
    db.query("SELECT * FROM `user` WHERE `id` = ?", [id], function(error, userResult, fields) {
        if (error) {
            return res.status(500).json({"msg": "Internal server error"});
        }
        if (userResult.length === 0) {
            return res.status(404).json({"msg": "Not found"});
        }
        db.execute("INSERT INTO `todo` (title, description, due_time, user_id, status) VALUES (?, ?, ?, ?, ?)", [title, desc, due_time, id, status], function(error, result, fields) {
            if (error) {
                return res.status(500).json({"msg": "Internal server error"});
            }
            db.query("SELECT * FROM `todo` WHERE `id` = ?", [result["insertId"]], function(error, todoResult, fields) {
                if (error) {
                    return res.status(500).json({"msg": "Internal server error"});
                }
                res.status(200).json(todoResult);
            });
        });
    });
};


exports.update_todo = function(res, id, title, desc, due_time, status) {
    db.execute("UPDATE `todo` SET title = ?, description = ?, due_time = ?, status = ? WHERE id = ?", [title, desc, due_time, status, id], function(error, result, fields) {
        db.query("SELECT * FROM `todo` WHERE `id` = ?", [id], function(error, result, fields) {
            if (error) {
                return res.status(500).json({"msg": "Internal server error"});
            }
            if (!result) {
                return res.status(404).json({"msg": "Not found"});
            }
            res.status(200).json(result);
        });
    });
}

exports.delete_todo = function(res, id) {
    db.execute("DELETE FROM `todo` WHERE `id` = ?", [id], function(error, result, fields) {
        if (error) {
            return res.status(500).json({"msg": "Internal server error"});
        }
        if (!result) {
            return res.status(404).json({"msg": "Not found"});
        }
        res.json({"msg": "Successfully deleted record number: " + id});
    });
}
