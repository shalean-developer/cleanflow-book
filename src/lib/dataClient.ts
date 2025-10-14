import { supabase } from '@/lib/supabase'

export type Page<T> = { rows: T[]; nextCursor: string | null }

/**
 * Fetch a paginated page of data from Supabase with cursor-based pagination
 * @param from - Table name
 * @param options - Query options including select, filters, ordering, limit, and cursor
 * @returns Page object with rows and nextCursor for pagination
 */
export async function sbPage<T>(
  from: string,
  { select = '*', eq, order = 'created_at', asc = false, limit = 20, cursor }: {
    select?: string;
    eq?: Record<string, string | number | boolean | null>;
    order?: string;
    asc?: boolean;
    limit?: number;
    cursor?: string | null;
  }
): Promise<Page<T>> {
  let q = supabase
    .from(from)
    .select(select, { count: 'exact' })
    .order(order, { ascending: asc })
    .limit(limit + 1);

  // Apply cursor for pagination (forward cursor pagination)
  if (cursor) {
    if (asc) {
      q = q.gt(order, cursor);
    } else {
      q = q.lt(order, cursor);
    }
  }

  // Apply equality filters
  if (eq) {
    Object.entries(eq).forEach(([k, v]) => {
      q = q.eq(k, v as any);
    });
  }

  const { data, error } = await q;
  if (error) throw error;

  const rows = data ?? [];
  const hasMore = rows.length > limit;
  
  return {
    rows: hasMore ? rows.slice(0, limit) : rows,
    nextCursor: hasMore ? (rows[limit][order] as any) : null
  };
}

/**
 * Fetch a single record by ID
 * @param from - Table name
 * @param id - Record ID
 * @param fields - Fields to select (default: '*')
 * @returns Single record or null
 */
export async function sbSingle<T>(from: string, id: string, fields = '*'): Promise<T | null> {
  const { data, error } = await supabase
    .from(from)
    .select(fields)
    .eq('id', id)
    .maybeSingle();

  if (error) throw error;
  return data as T | null;
}

/**
 * Fetch all records matching filters (use with caution on large tables)
 * @param from - Table name
 * @param options - Query options
 * @returns Array of records
 */
export async function sbAll<T>(
  from: string,
  { select = '*', eq, order = 'created_at', asc = false }: {
    select?: string;
    eq?: Record<string, string | number | boolean | null>;
    order?: string;
    asc?: boolean;
  } = {}
): Promise<T[]> {
  let q = supabase
    .from(from)
    .select(select)
    .order(order, { ascending: asc });

  // Apply equality filters
  if (eq) {
    Object.entries(eq).forEach(([k, v]) => {
      q = q.eq(k, v as any);
    });
  }

  const { data, error } = await q;
  if (error) throw error;

  return (data ?? []) as T[];
}

