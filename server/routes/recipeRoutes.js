const express = require('express');
const router = express.Router();
const recipeController = require('../controllers/recipeController');
const cloudinary = require("../utils/cloudinary");
const upload = require("../utils/multer");


/**
 * App routes
*/
router.get('/',recipeController.homepage);
router.get('/recipe/:id',recipeController.exploreRecipe);
router.get('/categories',recipeController.exploreCategories);
router.get('/categories/:id',recipeController.exploreCategoriesById);
router.post('/search',recipeController.serachRecipe);
router.get('/explore-latest',recipeController.exploreLatest);
router.get('/explore-random',recipeController.exploreRandom);
router.get('/submit-recipe',recipeController.submitRecipe);
router.post('/submit-recipe',upload.single('image'), recipeController.submitRecipeOnPost);
// router.get('/upload-image',recipeController.uploadImage);
// router.post('/upload-image',upload.single('image'), recipeController.uploadImageOnPost);
// router.get('/upload-image-success',recipeController.uploadImageSuccess);
router.get('/login', recipeController.login);
router.post('/login', recipeController.loginOnPost);
router.get('/register', recipeController.register);
router.post('/register', recipeController.registerOnPost);
// router.get('/categories',recipeController.exploreCategories);
// router.get('/categories/:id',recipeController.exploreCategoriesById);
router.get('/test',recipeController.exploreUser);
router.get('/test/:id',recipeController.exploreUserById);

//test
router.get('/test', recipeController.testGet);
module.exports = router;