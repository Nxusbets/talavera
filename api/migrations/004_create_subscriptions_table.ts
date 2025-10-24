import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('subscriptions', (table) => {
    table.increments('id').primary();
    table.integer('user_id').unsigned().notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.integer('plan_id').unsigned().notNullable().references('id').inTable('plans');
    table.string('status').defaultTo('active'); // active, cancelled, expired
    table.timestamp('started_at').defaultTo(knex.fn.now());
    table.timestamp('expires_at').nullable();
    table.timestamps(true, true);
    table.index('user_id');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('subscriptions');
}
