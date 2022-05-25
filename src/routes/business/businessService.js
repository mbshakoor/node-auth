const db = require("../../library/db");
const appConfig = require("../../config/env");
const messages = require("../../messages");
const { response } = require("express");

const addBusiness = async (data) => {
  try {
    let { category,...body } = data.body;
    const { id: category_id } = await db("business_category")
      .select()
      .where({ name: category })
      .first()
      .then(async (data) => {
        if (!data) {
          let newCategory = await db("business_category")
            .insert({ name: category })
            .returning("*");
          if (newCategory.length) {
            newCategory = newCategory[0];
          }
          return newCategory;
        } else {
          console.log(data);
          return data;
        }
      })
      .catch((error) => {
        console.log(error.message);
      });
      body.category_id=category_id
      let business = await db("business_details").insert(body).returning("*");
    return business;
  } catch (error) {
    console.log(error);
  }
};
const searchBusinessByID = async (body) => {
  try {
    let business = await db("business_details")
      .select(["name", "category"])
      .where({ is_deleted: false, body });
    return business;
  } catch (error) {
    console.log(error);
  }
};
const searchBusiness = async () => {
  try {
    let business = await db("business_details")
      .select(["name"])
      .where({ is_deleted: false });
    return business;
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  addBusiness,
  searchBusinessByID,
  searchBusiness,
};
