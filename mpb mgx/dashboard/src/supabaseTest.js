// Test script to verify Supabase connection
import { supabase, getTables, getTableData, listEndpoints, queryTablesDirectly } from './lib/supabase'

console.log('Testing Supabase connection...')

async function testConnection() {
  try {
    console.log('Attempting to list all endpoints...')
    const endpoints = await listEndpoints()
    console.log('Available endpoints:', endpoints)
    
    console.log('Attempting direct query...')
    const directQuery = await queryTablesDirectly()
    console.log('Direct query result:', directQuery)
    
    // Try to access some known tables
    const tables = ['users', 'products', 'orders', 'categories', 'customers', 'sales']
    
    for (const table of tables) {
      console.log(`Attempting to query ${table} table...`)
      const data = await getTableData(table, 5)
      console.log(`${table} data:`, data)
    }
  } catch (error) {
    console.error('Error testing Supabase connection:', error)
  }
}

// This will run when this module is imported
testConnection()
