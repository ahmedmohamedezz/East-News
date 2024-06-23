const Article = require("../models/articleModel");
const Country = require("../models/countryModel");
const Language = require("../models/languageModel");
const Category = require("../models/categoryModel");

const getNews = async (req, res) => {
  // for filtering upon language, category, country
  const { country, category, language } = req.body;

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

module.exports = getNews;
