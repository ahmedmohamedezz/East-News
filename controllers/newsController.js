const Article = require("../models/articleModel");
const Country = require("../models/countryModel");
const Language = require("../models/languageModel");
const Category = require("../models/categoryModel");
const Comment = require("../models/commentsModel");
const axios = require("axios");
const smmry = require("smmry")({ SM_API_KEY: "3591563BA7" });
const SMMRY_API_URL = "https://api.smmry.com/";

const getNews = async (req, res) => {
  // for filtering upon language, category, country
  const { country, category, language } = req.body;

  if (!country && !category && !language) {
    return res.status(400).json({
      message: "atleast 1 field is required [category, country, language]",
    });
  }
  try {
    let requestedAttrs = {};

    // 1. check valdity of attrs values
    if (country) {
      if (!Country.getAllowedCountries().includes(country)) {
        return res.status(400).json({
          error: "Invalid Country",
          providedValue: country,
          acceptedValues: Country.getAllowedCountries(),
        });
      }
      const cn = await Country.findOne({ code: country });
      requestedAttrs.countryId = cn._id;
    }

    if (category) {
      if (!Category.getAllowedCategories().includes(category)) {
        return res.status(400).json({
          error: "Invalid Cateory",
          providedValue: category,
          acceptedValues: Category.getAllowedCategories(),
        });
      }
      const cat = await Category.findOne({ name: category });
      requestedAttrs.categoryIds = { $in: [cat._id] };
      // { categoryIds: { $in: [] } }
    }

    if (language) {
      if (!Language.getAllowedLanguages().includes(language)) {
        return res.status(400).json({
          error: "Invalid Language",
          providedValue: language,
          acceptedValues: Language.getAllowedLanguages(),
        });
      }
      const lan = await Language.findOne({ code: language });
      requestedAttrs.languageId = lan._id;
    }

    // make the request
    const articles = await Article.find(requestedAttrs);

    return res.status(200).json(articles);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

const summarize = async (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ message: "article content is required" });
  }

  smmry
    .summarizeText(text)
    .then((data) => {
      return res.status(200).json({ summary: data });
    })
    .catch((err) => {
      // console.error(err);
      return res.status(500).json({ err });
    });
};

module.exports = {
  getNews,
  summarize,
};
