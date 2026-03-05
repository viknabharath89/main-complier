const express = require("express");
const router = express.Router();

const { compileCode } = require("../controllers/compileController");

// compile API
router.post("/compile", async (req, res, next) => {
  try {
    await compileCode(req, res);
  } catch (error) {
    console.error("Compile Route Error:", error.message);
    res.status(500).json({
      success: false,
      error: "Internal Server Error"
    });
  }
});

module.exports = router;