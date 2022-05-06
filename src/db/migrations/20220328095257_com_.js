export const up = async (knex) => {
  await knex.schema.createTable("comment", (table) => {
    table.increments("id");
    table.string("message").notNullable();
    table.integer("users").references("id").inTable("users");
  });
};

export const down = async (knex) => {
  await knex.schema.dropTable("comment");
};
