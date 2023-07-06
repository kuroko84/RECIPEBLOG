require("../models/database");
const { reset } = require("nodemon");
const Category = require("../models/Category");
const Recipe = require("../models/Recipe");
const cloudinary = require("cloudinary").v2;
const Login = require("../models/Login");
const User = require("../models/User");

/**
 * GET/
 * Homepage
 */

exports.homepage = async (req, res) => {
  try {
    const limitNumber = 5;
    const categories = await Category.find({}).limit(limitNumber);
    const latest = await Recipe.find({}).sort({ _id: -1 }).limit(limitNumber);
    const thai = await Recipe.find({ category: "Thai" }).limit(limitNumber);
    const american = await Recipe.find({ category: "American" }).limit(
      limitNumber
    );
    const chinese = await Recipe.find({ category: "Chinese" }).limit(
      limitNumber
    );
    const mexican = await Recipe.find({ category: "Mexican" }).limit(
      limitNumber
    );
    const indian = await Recipe.find({ category: "Indian" }).limit(limitNumber);
    const spanish = await Recipe.find({ category: "Spanish" }).limit(
      limitNumber
    );

    const food = { latest, indian, american, thai, chinese, mexican, spanish };

    res.render("index", { title: "Cooking blog - Homepage", categories, food });
  } catch (error) {
    res.satus(500).send({ mesage: error.message || "Error Occured" });
  }
};

/**
 * GET/exploreCategories
 * Categories
 */

exports.exploreCategories = async (req, res) => {
  try {
    const limitNumber = 20;
    const categories = await Category.find({}).limit(limitNumber);
    res.render("categories", {
      title: "Cooking blog - Categories",
      categories,
    });
  } catch (error) {
    res.satus(500).send({ mesage: error.message || "Error Occured" });
  }
};

/**
 * GET/exploreCategories/:id
 * Categories by ID
 */

exports.exploreCategoriesById = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const limitNumber = 20;
    const categoryById = await Recipe.find({ category: categoryId }).limit(
      limitNumber
    );
    res.render("categories", {
      title: "Cooking blog - Categories",
      categoryById,
    });
  } catch (error) {
    res.satus(500).send({ mesage: error.message || "Error Occured" });
  }
};

/**
 * GET/recipe/:id
 * Recipe
 */

exports.exploreRecipe = async (req, res) => {
  try {
    let recipeId = req.params.id;
    const recipe = await Recipe.findById(recipeId);
    res.render("recipe", { title: "Cooking blog - Recipe", recipe });
  } catch (error) {
    res.satus(500).send({ mesage: error.message || "Error Occured" });
  }
};

/**
 * POST/search
 * Recipe
 */

exports.serachRecipe = async (req, res) => {
  //searchTerm

  try {
    let searchTerm = req.body.searchTerm;
    let recipe = await Recipe.find({
      $text: { $search: searchTerm, $diacriticSensitive: true },
    });
    //res.json(recipe);
    res.render("search", { title: "Cooking blog - Search", recipe });
  } catch (error) {}
};

/**
 * GET/explore-latest
 * Explore Latest
 */

exports.exploreLatest = async (req, res) => {
  try {
    const limitNumber = 20;
    const recipe = await Recipe.find({}).sort({ _id: -1 }).limit(limitNumber);
    res.render("explore-latest", {
      title: "Cooking blog - Explore Lastest",
      recipe,
    });
  } catch (error) {
    res.satus(500).send({ mesage: error.message || "Error Occured" });
  }
};

// exports.uploadImageSuccess = async(req, res) => {

//   try {
//     const limitNumber = 20;
//     const image = await Image.find({}).sort({ _id: -1}).limit(limitNumber);
//     res.render('upload-images-success', { title: 'Cooking blog - Explore Random', image});
//   } catch (error) {
//     res.satus(500).send({mesage: error.message || "Error Occured"})
//   }
// }

/**
 * GET/explore-random
 * Explore Random as JSON
 */

exports.exploreRandom = async (req, res) => {
  try {
    let count = await Recipe.find().countDocuments();
    let random = Math.floor(Math.random() * count);
    let recipe = await Recipe.findOne().skip(random).exec();
    res.render("explore-random", {
      title: "Cooking blog - Explore Random",
      recipe,
    });
  } catch (error) {
    res.satus(500).send({ mesage: error.message || "Error Occured" });
  }
};

/**
 * GET/submit-recipe
 * Submit Recipe
 */

exports.submitRecipe = async (req, res) => {
  const infoErrorsObj = req.flash("infoErrors");
  const infoSubmitObj = req.flash("infoSubmit");
  res.render("submit-recipe", {
    title: "Cooking blog - Submit Recipe",
    infoErrorsObj,
    infoSubmitObj,
  });
};

/**
 * POST/submit-recipe
 * Submit Recipe
 */

exports.submitRecipeOnPost = async (req, res) => {
  /**
   * local upload
   */

  // try {
  //  Upload
  //   let imageUploadFile;
  //   let uploadPath;
  //   let newImageName;

  //   if(!req.files || Object.keys(req.files).length === 0){
  //     console.log('No files where uploaded');
  //   } else {
  //     imageUploadFile = req.files.image;
  //     newImageName = Date.now() + imageUploadFile.name;

  //     uploadPath = require('path').resolve('./') + '/public/uploads/' + newImageName;

  //     imageUploadFile.mv(uploadPath, function(err){
  //       if(err) return res.satus(500).send(err);
  //     })
  //   }
  /**
   * cloud upload
   */
  try {
    const result = await cloudinary.uploader.upload(req.file.path);

    const newRecipe = new Recipe({
      name: req.body.name,
      description: req.body.description,
      email: req.body.email,
      ingredients: req.body.ingredients,
      category: req.body.category,
      image_url: result.secure_url,
      cloudinary_id: result.public_id,
    });
    // Save recipe
    await newRecipe.save();
    req.flash("infoSubmit", "Recipe has been add.");
    res.redirect("/submit-recipe");
  } catch (error) {
    req.flash("infoErrors", error);
    res.redirect("/submit-recipe");
  }
};

/*test upload image to cloud*/
// exports.uploadImage = async(req, res) => {
//   res.render('upload-image', { title: 'Cooking blog - Submit Recipe'});
// }
// exports.uploadImageOnPost = async (req, res) => {
//   try {
//     const result = await cloudinary.uploader.upload(req.file.path);
//     let newImage = new Image({
//       name: req.body.name,
//       avatar: result.secure_url,
//       cloudinary_id: result.public_id,
//     });
//     // Save image
//     await newImage.save();
//     res.json(result);
//   } catch (error) {
//       console.log(error);
//   }
//   res.json();
// }
// exports.uploadImageSuccess = async(req, res) => {
//   try {
//     const limitNumber = 20;
//     const image = await Image.find({}).sort({ _id: -1}).limit(limitNumber);
//     res.render('upload-images-success', { title: 'Cooking blog - Explore Random', image});
//   } catch (error) {
//     res.satus(500).send({mesage: error.message || "Error Occured"})
//   }
// }

/**
 * Get/Login
 * Login
 */
exports.login = async (req, res) => {
  res.render("login", { title: "Cooking blog - Login page" });
};
/**
 * POST/login
 * Login On Post
 */
exports.loginOnPost = async (req, res) => {
  let email = req.body.email;
  let password = req.body.password;
  try {
    Login.findOne({
      email: email,
      password: password,
    }).then((data) => {
      if (data) {
        req.flash("infoSubmit", "Login successful");
        res.json("Dang nhap thanh cong");
        console.log("OK");
      } else {
        req.flash("Unknow", "Login unsuccessful");
        res.json("Dang nhap khong thanh cong");
        console.log("Faild");
      }
    });
  } catch (error) {
    res.status(500).json("Dang nhap that bai");
    console.log("Loi");
  }
};

/**
 * Get/register
 * Register
 */
exports.register = async (req, res) => {
  const infoErrorsObj = req.flash("infoErrors");
  const infoSubmitObj = req.flash("infoSubmit");
  res.render("register", {
    title: "Cooking blog - Register page",
    infoErrorsObj,
    infoSubmitObj,
  });
};
/**
 * POST/register
 * register On Post
 */
exports.registerOnPost = async (req, res) => {
  let email = req.body.email;
  let password = req.body.password;
  let name = req.body.name;
  let dob = req.body.dob;
  let tel = req.body.tel;
  try {
    User.findOne({
      email: email,
    }).then((data) => {
      if (data) {
        res.json("User da ton tai!");
      } else {
        Login.create({
          email: email,
          password: password,
        });
        User.create({
          email: email,
          name: name,
          dob: dob,
          tel: tel,
        });
        req.flash("infoSubmit", "Register successful");
        res.json("Dang ky thanh cong");
        console.log("OK");
      }
    });
  } catch (error) {
    res.status(500).json("Dang ky that bai");
    console.log("Loi");
  }
};

/**
 * test get
 */
exports.testGet = async (req, res) => {
  res.render("test", { title: "Cooking blog - test get" });
};
exports.exploreUserById = async (req, res) => {
  try {
    var userEmail = req.params.id;
    User.findOne({
      _email: userEmail,
    }).then((data) => {
      console.log(data._id);
      res.render("test", { title: "Cooking blog - Categories", data });
    });
  } catch (error) {
    res.status(500).send({ mesage: error.message || "Error Occured" });
    console.log("Loi2");
  }
};
exports.exploreUser = async (req, res) => {
  try {
    const limitNumber = 20;
    const users = await User.find({}).limit(limitNumber);
    res.render("test", { title: "Cooking blog - test user", users });
  } catch (error) {
    res.satus(500).send({ mesage: error.message || "Error Occured" });
  }
};

/**
 * test post
 */
/**
 * test put
 */
/**
 * test delete
 */

async function insertDymmyCategoryData() {
  try {
    await Category.insertMany([
      {
        name: "Viet Nam",
        image: "vietnam-food.jpg",
      },
    ]);
  } catch (error) {
    console.log("err", +error);
  }
}

//insertDymmyCategoryData();

async function insertDymmyRecipeData() {
  try {
    await Recipe.insertMany([
      {
        name: "Recipe Name Goes Here",
        description: `Recipe Description Goes Here`,
        email: "ttphong071016@gmail.com",
        ingredients: [
          "1 level teaspoon baking powder",
          "1 level teaspoon cayenne pepper",
          "1 level teaspoon hot smoked paprika",
        ],
        category: "American",
        image: "southern-friend-chicken.jpg",
      },
    ]);
  } catch (error) {
    console.log("err", +error);
  }
}

//insertDymmyRecipeData();

async function updateRecipe() {
  try {
    const res = await Recipe.updateOne(
      { name: "Naan" },
      { name: "Indian Naan" }
    );
    res.n;
    res.nModified;
  } catch (error) {
    console.log(error);
  }
}

//updateRecipe();

async function deleteRecipe() {
  try {
    const res = await Recipe.deleteOne({ name: "Indian Naan" });
    res.n;
    res.nModified;
  } catch (error) {
    console.log(error);
  }
}

//deleteRecipe();
