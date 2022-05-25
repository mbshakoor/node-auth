exports.up = function (knex) {
    return knex.schema.createTable("refresh_token", (table) => {
      table.increments();
      table.string("token", 255);
      table.date('expires');
      table.string("created_by_IP", 255);
      table.date('revoked');
      table.string("revoked_by_IP", 255);
      table.string("replaced_by_token", 255);
      table.integer("user_id").references("users.id");
      table.timestamps(true, true);
      table.boolean("is_deleted").defaultTo(false);
    });
  };
  
  exports.down = function (knex) {
    return knex.schema.dropTable("refresh_token");
  };
  