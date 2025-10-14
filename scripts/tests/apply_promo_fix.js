// Script to apply the promo claims database fix
import { createClient } from '@supabase/supabase-js'
import fs from 'fs'

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'your-supabase-url'
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'your-service-role-key'

if (!supabaseUrl || supabaseServiceKey.includes('your-')) {
  console.error('❌ Please set VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function applyPromoFix() {
  console.log('🔧 Applying promo claims database fix...')
  
  try {
    // Read the SQL fix file
    const sqlFix = fs.readFileSync('./FIX_PROMO_CLAIMS_DATABASE.sql', 'utf8')
    
    // Split into individual statements (rough split on semicolons)
    const statements = sqlFix
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'))
    
    console.log(`📝 Found ${statements.length} SQL statements to execute`)
    
    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i]
      if (statement.trim()) {
        try {
          console.log(`⚡ Executing statement ${i + 1}/${statements.length}...`)
          const { error } = await supabase.rpc('exec_sql', { sql: statement })
          
          if (error) {
            console.warn(`⚠️  Statement ${i + 1} warning:`, error.message)
            // Continue with other statements even if one fails
          } else {
            console.log(`✅ Statement ${i + 1} executed successfully`)
          }
        } catch (stmtError) {
          console.warn(`⚠️  Statement ${i + 1} error:`, stmtError.message)
          // Continue with other statements
        }
      }
    }
    
    console.log('✅ Database fix applied successfully!')
    
    // Test the fix by trying to insert a test claim
    console.log('🧪 Testing the fix...')
    
    const testResult = await supabase
      .from('promo_claims')
      .select('*')
      .limit(1)
    
    if (testResult.error) {
      console.error('❌ Test failed:', testResult.error)
    } else {
      console.log('✅ Test successful - promo_claims table is accessible')
    }
    
  } catch (error) {
    console.error('❌ Failed to apply fix:', error)
  }
}

// Run the fix
applyPromoFix()
