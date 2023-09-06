var db = require('../../config/db');
const { genToken } = require('../../middleware/auth');

exports.register = function(res, email, pswd, name, fname) {
    db.execute("INSERT INTO `user` (email, password, name, firstname) VALUES (?, ?, ?, ?)", [email, pswd, name, fname], function(error, result, fields) {
        db.execute("SELECT `id` FROM `user` WHERE email = ?", [email], function(err, result) {
            const token = genToken(result.id);
            res.status(200).json({token});
        });
    });
}

exports.get_all_user = function(res) {
    db.query("SELECT * FROM `user`", function(error, result, fields) {
        res.status(200).json(result);
    });
}

exports.mail_exist = function(email, callback) {
    db.execute("SELECT * FROM `user` WHERE email = ?", [email], function(req, res, fields) {
        if (res .length > 0) {
            callback(true);
        } else {
            callback(false);
        }
    });
}

exports.login = function(email, password, bcrypt, res, callback) {
    db.execute("SELECT password, id FROM `user` WHERE email = ?", [email], function(req, results, fields) {
        if (bcrypt.compareSync(password, results[0].password)) {
            callback(true, results[0].id);
        } else {
            callback(false, results[0].id);
        }
    })
}

exports.get_all_todos_from_id = function(user_id, res) {
    db.execute("SELECT * FROM `todo` WHERE user_id = ?", [user_id], function(req, results, fields) {
        if (results.length > 0) {
            res.status(200).json({results});
        } else {
            res.status(200).json({"mgs" : "User have no todos"});
        }
    });
}

exports.user_exist_from_id = function(id, callback) {
    db.execute("SELECT * FROM `user` WHERE id = ?", [id], function(error, results) {
        if (error) {
            callback(error, false);
        } else {
            callback(null, results.length > 0);
        }
    });
};

exports.get_user_id_from_email = function(email) {
    db.execute("SELECT id FROM `user` WHERE email = ?", [email], function(error, results, fields) {
      if (error) {
        console.error("Erreur lors de l'exécution de la requête : ", error);
        return null;
      }
      if (results.length > 0) {
        return results[0].id;
      } else {

        return null;
      }
    });
  };

const { user_exist_from_id } = require('./user.query');

exports.delete_user_from_id = function(user_id, res) {
    user_exist_from_id(user_id, function(error, exists) {
        if (error) {
            return res.status(500).json({"msg": "Internal server error"});
        }
        if (!exists) {
            return res.status(404).json({"msg": "Not found"});
        }
        db.execute("DELETE FROM `user` WHERE id = ?", [user_id], function(error, r) {
            if (error) {
                return res.status(500).json({"msg": "Internal server error"});
            }
            db.execute("DELETE FROM `todo` WHERE user_id = ?", [user_id], function(error) {
                if (error) {
                    return res.status(500).json({"msg": "Internal server error"});
                }
                res.status(200).json({"msg": `Successfully deleted record number: ${user_id}`});
            });
        });
    });
};

exports.get_user_info = function(id, res) {
    user_exist_from_id(id, function(error, exists) {
        if (error) {
            return res.status(500).json({"msg": "Internal server error"});
        }
        if (!exists) {
            return res.status(404).json({"msg": `Not found`});
        }
        db.execute("SELECT * FROM `user` WHERE id = ?", [id], function(error, results) {
            if (error) {
                return res.status(500).json({"msg": "Internal server error"});
            } else {
                return res.status(200).json(results[0]);
            }
        });
    });
}

exports.get_user_info_email = function(email, res) {
    db.execute("SELECT * FROM `user` WHERE email = ?", [email], function(error, results) {
        if (error) {
            return res.status(500).json({"msg": "Internal server error"});
        } else {
            if (results.length == 0) {
                return res.status(404).json({"msg": `Not found`});
            } else {
                return res.status(200).json(results[0]);
            }
        }
    });
}
const {get_user_info} = require("./user.query")

exports.update_user_from_id = function(req, res) {
    const id = req.params.id;
    const email = req.body["email"];
    const pwd = req.body["password"];
    const fname = req.body["firstname"];
    const name = req.body["name"];

    db.execute("UPDATE `user` SET email = ?, password = ?, name = ?, firstname = ? WHERE id = ?",
        [email, pwd, name, fname, id], function(error, result) {
        if (error) {
          return res.status(500).json({"msg": "Internal server error"});
        } else {
            return get_user_info(id, res);
        }
      });
}