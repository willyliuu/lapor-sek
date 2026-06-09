import { pgTable, uuid, varchar, text, timestamp, numeric, integer, boolean, pgEnum } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Enums
export const categoryEnum = pgEnum('issue_category', [
  'road_damage',
  'flooding',
  'lighting',
  'waste',
  'facility',
  'other'
]);

export const statusEnum = pgEnum('issue_status', [
  'open',
  'in_progress',
  'resolved'
]);

// Issues Table
export const issues = pgTable('issues', {
  id: uuid('id').primaryKey().defaultRandom(),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  title: varchar('title', { length: 100 }).notNull(),
  description: text('description'),
  category: categoryEnum('category').notNull(),
  status: statusEnum('status').default('open').notNull(),
  lat: numeric('lat', { precision: 10, scale: 7 }).notNull(),
  lng: numeric('lng', { precision: 10, scale: 7 }).notNull(),
  address: text('address'),
  photo_url: text('photo_url'),
  upvote_count: integer('upvote_count').default(0).notNull(),
  is_flagged: boolean('is_flagged').default(false).notNull(),
});

// Upvotes Table
export const upvotes = pgTable('upvotes', {
  id: uuid('id').primaryKey().defaultRandom(),
  issue_id: uuid('issue_id')
    .references(() => issues.id, { onDelete: 'cascade' })
    .notNull(),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

// Reports Table
export const reports = pgTable('reports', {
  id: uuid('id').primaryKey().defaultRandom(),
  issue_id: uuid('issue_id')
    .references(() => issues.id, { onDelete: 'cascade' })
    .notNull(),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

// Relations
export const issuesRelations = relations(issues, ({ many }) => ({
  upvotes: many(upvotes),
  reports: many(reports),
}));

export const upvotesRelations = relations(upvotes, ({ one }) => ({
  issue: one(issues, {
    fields: [upvotes.issue_id],
    references: [issues.id],
  }),
}));

export const reportsRelations = relations(reports, ({ one }) => ({
  issue: one(issues, {
    fields: [reports.issue_id],
    references: [issues.id],
  }),
}));
