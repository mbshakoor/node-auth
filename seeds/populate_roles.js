exports.seed = function (knex) {
    // Inserts seed entries
    return knex('roles').insert([
      { id: 1, name: 'admin' },
      { id: 2, name: 'vendor' },
    ]);
  };