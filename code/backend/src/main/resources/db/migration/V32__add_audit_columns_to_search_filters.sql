-- TaskFlow Migration V32: Add Audit Columns to Saved Search Filters
ALTER TABLE saved_search_filters ADD COLUMN IF NOT EXISTS created_by UUID;
ALTER TABLE saved_search_filters ADD COLUMN IF NOT EXISTS updated_by UUID;
