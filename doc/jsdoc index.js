/**
 * Express Router for handling index-related routes.
 * @module routers/index
 */

const router = require("express").Router();

/**
 * Route for the root path ("/").
 * @function
 * @name get/
 * @memberof module:routers/index
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {void}
 */
router.get("/", (req, res) => {
    /**
     * Render the 'index' view.
     * @function
     * @name renderIndex
     * @memberof module:routers/index~get/
     * @param {string} view - Name of the view to render ("index").
     */
    res.render("index");
});

/**
 * Module exports the router for index-related routes.
 * @exports router
 */
module.exports = router;
