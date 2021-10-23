const { Router } = require("express");
const catchAsync = require("../middleware/async");
const request = require("request");
const cheerio = require("cheerio");
const axios = require("axios");
const router = Router();

router.get(
  "/",
  catchAsync(async (req, res) => {
    const { word } = req.query;
    request(
      `https://www.dictionary.com/browse/${word}`,
      (err, response, body) => {
        const $ = cheerio.load(body);
        const data = $(".pron-spell-content").text();
        res.json({
          success: true,
          data,
        });
      }
    );
  })
);

module.exports = router;
