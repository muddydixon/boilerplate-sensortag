
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTableIfNotExists("users", table =>{
      table.increments();
      table.string("username", 64).notNullable().unique();
      table.string("shadow",   64).notNullable();
      table.string("salt",     64).notNullable();
      table.timestamps();
    }),
    knex.schema.createTableIfNotExists("maps", table =>{
      table.increments();
      table.integer("user_id").unsigned().notNullable();
      table.string("name", 64).notNullable();
      table.text("path").notNullable();
      table.timestamps();
    })
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTableIfExists("users"),
    knex.schema.dropTableIfExists("maps"),
  ]);
};
