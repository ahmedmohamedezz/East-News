const Article = require("../models/articleModel"); // Assuming you have an Article model defined
const Country = require("../models/countryModel");
const Language = require("../models/languageModel");
const Category = require("../models/categoryModel");
const getAPINews = require("../newsAPI/newsAPI");

/*
- required: title, source, author, url, publishedAt, language, category
- not-required: country, imageURL, content, description
*/
let attrIds = {};

async function getCategoryId(name) {
  // to reduce the number of API calls, using attrIds for memoization
  if (attrIds.name === null) {
    console.log(`fetching id of ${name}`);
    attrIds.name = await Category.findOne({ name })._id;
  }

  return attrIds.category;
}

async function getCountryId(code) {
  // to reduce the number of API calls, using attrIds for memoization
  if (attrIds.code === null) {
    console.log(`fetching id of ${code}`);
    attrIds.code = await Country.findOne({ code })._id;
  }

  return attrIds.code;
}

async function getLanguageId(code) {
  // to reduce the number of API calls, using attrIds for memoization
  if (attrIds.code === null) {
    console.log(`fetching id of ${code}`);
    attrIds.code = await Language.findOne({ code })._id;
  }

  return attrIds.code;
}

async function seedArticles() {
  let result = [];
  try {
    // get all kinds of news, add or update the DB
    const allowedCategories = Category.getAllowedCategories();
    const allowedCountries = Country.getAllowedCountries();
    const allowedLanguages = Language.getAllowedLanguages();

    for (const category of allowedCategories) {
      for (const country of allowedCountries) {
        for (const langauge of allowedLanguages) {
          let requestedAttrs = {
            category,
            country,
            langauge,
          };

          let articles = await getAPINews(requestedAttrs);

          for (const curArticle of articles) {
            // api returns: title, source, author, url, publishedAt, imageURL, content, description
            // still missing: countryId, languageId, categoryId

            let artExists = await Article.findOne({
              title: curArticle.title,
              publishedAt: curArticle.publishedAt,
            });

            if (artExists) {
              console.log("article exists");
              continue;
            }

            // add missing attrs
            let lanId = await Language.findOne({ code: langauge });
            let catId = await Category.findOne({ name: category });
            let conId = await Country.findOne({ code: country });

            if (!lanId || !catId || !conId) {
              console.log(langauge, lanId._id);
              console.log(category, catId._id);
              console.log(country, conId._id);
              return;
            }

            curArticle.langaugeId = lanId._id;
            curArticle.categoryId = catId._id;
            curArticle.countryId = conId._id;

            // result.push(curArticle);
            await Article.create(curArticle);
          }
        }
      }
    }
    // console.log(result.length);
    // await Article.insertMany(result);

    console.log("\tArticles seeded successfully");
  } catch (error) {
    console.error("Error seeding articles:", error);
  }
}

module.exports = seedArticles;
