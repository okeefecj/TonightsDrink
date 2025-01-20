import bodyParser from "body-parser";
import {dirname} from "node:path"
import { fileURLToPath } from "node:url";
import express from "express"
import axios from "axios";

const port = 3000;
const app = express();
const __dirname = dirname(fileURLToPath(import.meta.url));
const baseURL = `http://thecocktaildb.com/api/json/v1/1/`;

const categories = {"drinks":[{"strCategory":"Cocktail"},{"strCategory":"Ordinary Drink"},{"strCategory":"Punch / Party Drink"},{"strCategory":"Shake"},{"strCategory":"Other / Unknown"},{"strCategory":"Cocoa"},{"strCategory":"Shot"},{"strCategory":"Coffee / Tea"},{"strCategory":"Homemade Liqueur"},{"strCategory":"Beer"},{"strCategory":"Soft Drink"}]};
const glasses = {"drinks":[{"strGlass":"Highball glass"},{"strGlass":"Old-fashioned glass"},{"strGlass":"Cocktail glass"},{"strGlass":"Copper Mug"},{"strGlass":"Whiskey Glass"},{"strGlass":"Collins glass"},{"strGlass":"Pousse cafe glass"},{"strGlass":"Champagne flute"},{"strGlass":"Whiskey sour glass"},{"strGlass":"Brandy snifter"},{"strGlass":"White wine glass"},{"strGlass":"Nick and Nora Glass"},{"strGlass":"Hurricane glass"},{"strGlass":"Coffee mug"},{"strGlass":"Shot glass"},{"strGlass":"Jar"},{"strGlass":"Irish coffee cup"},{"strGlass":"Punch bowl"},{"strGlass":"Pitcher"},{"strGlass":"Pint glass"},{"strGlass":"Cordial glass"},{"strGlass":"Beer mug"},{"strGlass":"Margarita/Coupette glass"},{"strGlass":"Beer pilsner"},{"strGlass":"Beer Glass"},{"strGlass":"Parfait glass"},{"strGlass":"Wine Glass"},{"strGlass":"Mason jar"},{"strGlass":"Margarita glass"},{"strGlass":"Martini Glass"},{"strGlass":"Balloon Glass"},{"strGlass":"Coupe Glass"}]};
const alcohol = {"drinks":[{"strAlcoholic":"Alcoholic"},{"strAlcoholic":"Non alcoholic"},{"strAlcoholic":"Optional alcohol"}]};
const ingredient = {"drinks":[{"strIngredient1":"Light rum"},{"strIngredient1":"Bourbon"},{"strIngredient1":"Vodka"},{"strIngredient1":"Gin"},{"strIngredient1":"Blended whiskey"},{"strIngredient1":"Tequila"},{"strIngredient1":"Sweet Vermouth"},{"strIngredient1":"Apricot brandy"},{"strIngredient1":"Triple sec"},{"strIngredient1":"Southern Comfort"},{"strIngredient1":"Orange bitters"},{"strIngredient1":"Brandy"},{"strIngredient1":"Lemon vodka"},{"strIngredient1":"Dry Vermouth"},{"strIngredient1":"Dark rum"},{"strIngredient1":"Amaretto"},{"strIngredient1":"Tea"},{"strIngredient1":"Applejack"},{"strIngredient1":"Champagne"},{"strIngredient1":"Scotch"},{"strIngredient1":"Coffee liqueur"},{"strIngredient1":"A\u00f1ejo rum"},{"strIngredient1":"Bitters"},{"strIngredient1":"Sugar"},{"strIngredient1":"Kahlua"},{"strIngredient1":"Dubonnet Rouge"},{"strIngredient1":"Lime juice"},{"strIngredient1":"Irish whiskey"},{"strIngredient1":"Apple brandy"},{"strIngredient1":"Carbonated water"},{"strIngredient1":"Cherry brandy"},{"strIngredient1":"Creme de Cacao"},{"strIngredient1":"Grenadine"},{"strIngredient1":"Port"},{"strIngredient1":"Coffee brandy"},{"strIngredient1":"Red wine"},{"strIngredient1":"Rum"},{"strIngredient1":"Grapefruit juice"},{"strIngredient1":"Ricard"},{"strIngredient1":"Sherry"},{"strIngredient1":"Cognac"},{"strIngredient1":"Sloe gin"},{"strIngredient1":"Strawberry schnapps"},{"strIngredient1":"Apple juice"},{"strIngredient1":"Pineapple juice"},{"strIngredient1":"Lemon juice"},{"strIngredient1":"Sugar syrup"},{"strIngredient1":"Milk"},{"strIngredient1":"Strawberries"},{"strIngredient1":"Chocolate syrup"},{"strIngredient1":"Yoghurt"},{"strIngredient1":"Mango"},{"strIngredient1":"Ginger"},{"strIngredient1":"Lime"},{"strIngredient1":"Cantaloupe"},{"strIngredient1":"Berries"},{"strIngredient1":"Grapes"},{"strIngredient1":"Kiwi"},{"strIngredient1":"Tomato juice"},{"strIngredient1":"Cocoa powder"},{"strIngredient1":"Chocolate"},{"strIngredient1":"Heavy cream"},{"strIngredient1":"Galliano"},{"strIngredient1":"Peach Vodka"},{"strIngredient1":"Ouzo"},{"strIngredient1":"Coffee"},{"strIngredient1":"Spiced rum"},{"strIngredient1":"Water"},{"strIngredient1":"Espresso"},{"strIngredient1":"Angelica root"},{"strIngredient1":"Orange"},{"strIngredient1":"Cranberries"},{"strIngredient1":"Johnnie Walker"},{"strIngredient1":"Apple cider"},{"strIngredient1":"Everclear"},{"strIngredient1":"Cranberry juice"},{"strIngredient1":"Egg yolk"},{"strIngredient1":"Egg"},{"strIngredient1":"Grape juice"},{"strIngredient1":"Peach nectar"},{"strIngredient1":"Lemon"},{"strIngredient1":"Firewater"},{"strIngredient1":"Lemonade"},{"strIngredient1":"Lager"},{"strIngredient1":"Whiskey"},{"strIngredient1":"Absolut Citron"},{"strIngredient1":"Pisco"},{"strIngredient1":"Irish cream"},{"strIngredient1":"Ale"},{"strIngredient1":"Chocolate liqueur"},{"strIngredient1":"Midori melon liqueur"},{"strIngredient1":"Sambuca"},{"strIngredient1":"Cider"},{"strIngredient1":"Sprite"},{"strIngredient1":"7-Up"},{"strIngredient1":"Blackberry brandy"},{"strIngredient1":"Peppermint schnapps"},{"strIngredient1":"Creme de Cassis"},{"strIngredient1":"Jack Daniels"},{"strIngredient1":"Baileys irish cream"}]};
app.use(express.static("public"));

app.use(bodyParser.urlencoded({extended : false}));

//Get random recipe from API
app.get("/", async (req,res) => {

    try{
        var response = await axios.get(`${baseURL}/random.php`);
        var recipe = response.data.drinks[0];

        let ingredients = [];

        const entries = Object.entries(recipe);
        
        for (const [key, value] of entries) {
            if(value != null && key.includes("Ingredient")){
                ingredients.push(value);
            }
        };
    
        res.render(__dirname + "/views/partials/index.ejs", {
            data : recipe,
            ingredientList : ingredients,
            categoryFilters: categories,
            glassFilters: glasses,
            alcoholFilters : alcohol,
            ingredientFilters: ingredient
        });
    }
    catch(error){
        console.log(`${error}`);
        res.status(500).send('Oopsies from my code!');
    }
});

app.post("/filterDrinks", async (req,res) => {

    try{
        let reqIngredient = req.body.ingredient;
        
        let response = await axios.get(`${baseURL}filter.php?i=${reqIngredient}`);
        let index = Math.floor((Math.random() * response.data.drinks.length) +1);
        let randomDrinkFromResponse = response.data.drinks[index];

        response = await axios.get(`${baseURL}lookup.php?i=${randomDrinkFromResponse.idDrink}`);
        let actualDrink = response.data.drinks[0];
        
        const entries = Object.entries(actualDrink);

        let ingredients = [];
        
        for (const [key, value] of entries) {
            if(value != null && key.includes("Ingredient")){
                ingredients.push(value);
            }
        };
        res.render(__dirname + "/views/partials/index.ejs", {
            data : actualDrink,
            ingredientList : ingredients,
            categoryFilters: categories,
            glassFilters: glasses,
            alcoholFilters : alcohol,
            ingredientFilters: ingredient
        })

    }catch(Error){
        console.log(`${Error}`);
        res.status(500).send("I fucked up, idk");
    }

});

app.listen(port, () => {
    console.log(`Listening on port ${port}.`);
});




