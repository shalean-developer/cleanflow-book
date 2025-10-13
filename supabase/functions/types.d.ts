// Deno global types
declare const Deno: {
  env: {
    get(key: string): string | undefined;
  };
};

// Global fetch is available in Deno
declare const fetch: typeof globalThis.fetch;

// Global Response is available in Deno
declare const Response: typeof globalThis.Response;

// Global Request is available in Deno
declare const Request: typeof globalThis.Request;

// Global Headers is available in Deno
declare const Headers: typeof globalThis.Headers;

// Module declarations for Deno imports
declare module "https://deno.land/std@0.168.0/http/server.ts" {
  export function serve(handler: (req: Request) => Promise<Response> | Response): void;
}

declare module "https://esm.sh/@supabase/supabase-js@2.38.4" {
  export function createClient(url: string, key: string): any;
}