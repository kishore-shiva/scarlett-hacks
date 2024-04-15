function validateUserSSN(db, ssn) {
    return new Promise((resolve, reject) => {
        try {
            db.get("SELECT * FROM users WHERE SSN = ?", [ssn], (err, row) => {
                if (err) {
                    console.log("USER VALIDATION ERROR: " + err);
                    reject(err);
                } else {
                    resolve(!!row); // Convert row to boolean and resolve
                }
            });
        } catch (err) {
            console.log("USER VALIDATION ERROR: " + err);
            reject(err);
        }
    });
}

module.exports = validateUserSSN;