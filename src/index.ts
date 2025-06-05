import path from "path";
import * as fs from "fs";
import { getAllProducts, getProductId, updateProductDescription } from "./database/database";
import { exit } from "process";
import { indexExists, createIndex, add, getDocumentIdOrUndefined, update, dropIndex } from "./searchengine/searchengine";

let index_name = "products-28";


await dropIndex(index_name); // ta bort indexet om det finns, annars skapar vi ett nytt
//exit();
// 1. Finns det ett index i betasearch.systementor.se som har mitt namn?
if(await indexExists(index_name) == false){
  createIndex(index_name,"english"); //swedish

}
// 2. Om inte - skapa !


const products = await getAllProducts();
for(const product of  products){
  // finns det ett id i betasearch som matchar produktens id?
  // om ja - update
  // else - create
  // create new!
   const searchObject = {
      "webid": product.id,
      "title": product.name,
      "description": product.description,
      "combinedsearchtext" : product.name + " " + product.description + " " + product.color + " " + product.categoryName,
      "price": product.price,
      "categoryName": product.categoryName,
      "color": product.color2,
      "categoryid": product.categoryId,
      "string_facet": [
        {
          "facet_name": "Color",
          "facet_value": product.color
        },
        {
          "facet_name": "Category",
          "facet_value": product.categoryName
        }
      ]
    };
    // om produlkten finns - update annars add
    const docId = await getDocumentIdOrUndefined(index_name, product.id.toString());
    if(docId != undefined){
      update(index_name,docId, searchObject); // DOC ID SKA SKICKAS IN inte product.id
      // UPDATE
    }else{
      add(index_name,searchObject)
    }
 

  //  console.log(product.id, product.title, product.categoryName);
};


