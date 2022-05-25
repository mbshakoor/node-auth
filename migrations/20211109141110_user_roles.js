exports.up = function (knex) {
    return knex.schema.createTable("user_roles", (table) => {
      table.increments();
      table.integer("user_id").references("users.id");
      table.integer("role_id").references("roles.id");
      table.timestamps(true, true);
      table.boolean("is_deleted").defaultTo(false);
    });
  };
  
  exports.down = function (knex) {
    return knex.schema.dropTable("user_roles");
  };
  