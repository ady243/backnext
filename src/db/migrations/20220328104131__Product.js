export const up = async (knex) => {
  await knex.schema.createTable("produit", (table) => {
    table.increments();
    table.string("categories").notNullable();
    table.string("ref_categories");
    table.integer("comment").references("id").inTable("comment");
    table.integer("users").references("id").inTable("users");
  });
};
export const down = async (knex) => {
  await knex.schema.dropTable("produit");
};
