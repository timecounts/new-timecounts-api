const fs = require("fs")
const path = require("path")

module.exports = async (err, req, res, next) => {
    console.error(err.message)

    if (err.myErr) {
        res.status(err.statusCode).json({
            success: false,
            message: err.message,
        })
    } else {
        // FOR PRODUCTION
        // res.status(500).json({
        //   success: false,
        //   message: "Something went wrong",
        // });

        // FOR DEVELOPMENT

        fs.appendFileSync(
            path.join(__dirname, "./errorlog.txt"),
            "\n\n" + err.stack
        )

        res.status(500).json({
            success: false,
            message: err.message,
        })
    }
}