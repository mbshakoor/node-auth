exports.up = function (knex) {
  return knex.schema.createTable("mobile_verifications", (table) => {
    table.increments();
    table.string("phone_number");
    table.string("otp");
    table.boolean("is_used").defaultTo(false);
    table.timestamps(true, true);
    table.boolean("is_deleted").defaultTo(false);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("mobile_verifications");
};
