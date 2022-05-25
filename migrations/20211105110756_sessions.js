exports.up = function (knex) {
  return knex.schema.createTable("sessions", (table) => {
    table.increments();
    table.text('session_id');
    table.text("device_id");
    table.text("token");
    table.text("refresh_token");
    table.string("device_type");
    table.jsonb("location");
    table.integer("user_id").references("users.id");
    table.timestamps(true, true);
    table.boolean("is_deleted").defaultTo(false);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("sessions");
};
