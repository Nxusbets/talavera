import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('plans', (table) => {
    table.increments('id').primary();
    table.string('code').unique().notNullable(); // 'free', 'pro'
    table.string('name_en').notNullable();
    table.string('name_es').notNullable();
    table.integer('projects_quota').notNullable();
    table.decimal('price', 10, 2).defaultTo(0);
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('plans');
}
