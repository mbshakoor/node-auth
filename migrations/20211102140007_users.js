exports.up = function (knex) {
  return knex.schema.createTable("users", (table) => {
    table.increments();
    table.string("username", 255);
    table.string("password", 255);
    table.string("phone_number").unique();
    table.timestamps(true, true);
    table.boolean("is_deleted").defaultTo(false);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("users");
};
