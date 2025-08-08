-- Add summary column to campaigns table
ALTER TABLE campaigns ADD COLUMN summary TEXT;

-- Update the updated_at trigger to include the new column
-- (The existing trigger should already handle this automatically)
