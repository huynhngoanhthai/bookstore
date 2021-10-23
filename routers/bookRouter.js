const { Router } = require("express");
const { jwtAuth } = require("../middleware/jwtAuth");
const bookController = require("../controllers/bookController");
const authorize = require("../middleware/role");
const { ROLES } = require("../constants");
const router = Router();

router.get("/", jwtAuth, bookController.getBooks);
router.get("/:id", jwtAuth, bookController.getBookDetail);
router.post("/", jwtAuth, bookController.createBook);
router.delete("/:id", jwtAuth, bookController.deleteBook);
router.patch("/:id", jwtAuth, bookController.updateBook);

module.exports = router;
