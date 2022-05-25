exports.up = function (knex) {
  return knex.schema.createTable("roles", (table) => {
    table.increments();
    table.string("name", 255);
    table.timestamps(true, true);
    table.boolean("is_deleted").defaultTo(false);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("roles");
};
