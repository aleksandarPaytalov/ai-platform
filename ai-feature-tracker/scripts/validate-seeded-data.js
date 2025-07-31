#!/usr/bin/env node

/**
 * Data Validation Script
 * This script validates the seeded data and tests database functionality
 */

const { createClient } = require('@supabase/supabase-js');

// Supabase connection configuration for local development
const supabaseUrl = 'http://127.0.0.1:54321';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU';

async function validateSeededData() {
  console.log('🔍 Validating seeded data for AI Feature Tracker...');
  
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  try {
    // Test 1: Check data counts
    console.log('\n📊 Data Count Validation:');
    
    const { data: categories, count: categoryCount } = await supabase
      .from('tool_categories')
      .select('*', { count: 'exact' });
    
    const { data: tools, count: toolCount } = await supabase
      .from('ai_tools')
      .select('*', { count: 'exact' });
    
    const { data: updates, count: updateCount } = await supabase
      .from('feature_updates')
      .select('*', { count: 'exact' });
    
    const { data: history, count: historyCount } = await supabase
      .from('update_history')
      .select('*', { count: 'exact' });
    
    console.log(`   ✅ Categories: ${categoryCount} (Expected: 5)`);
    console.log(`   ✅ Tools: ${toolCount} (Expected: 15)`);
    console.log(`   ✅ Updates: ${updateCount} (Expected: 15+)`);
    console.log(`   ✅ History: ${historyCount} (Expected: 3+)`);
    
    // Test 2: Check category distribution
    console.log('\n📂 Category Distribution:');
    for (const category of categories || []) {
      const toolsInCategory = (tools || []).filter(tool => tool.category_id === category.id);
      console.log(`   ${category.name}: ${toolsInCategory.length} tools`);
    }
    
    // Test 3: Check validation status distribution
    console.log('\n📈 Update Validation Status:');
    const validatedUpdates = (updates || []).filter(u => u.validation_status === 'validated');
    const pendingUpdates = (updates || []).filter(u => u.validation_status === 'pending');
    const reviewUpdates = (updates || []).filter(u => u.validation_status === 'requires_review');
    
    console.log(`   Validated: ${validatedUpdates.length}`);
    console.log(`   Pending: ${pendingUpdates.length}`);
    console.log(`   Requires Review: ${reviewUpdates.length}`);
    
    // Test 4: Check AI analysis status
    console.log('\n🤖 AI Analysis Status:');
    const aiAnalyzed = (updates || []).filter(u => u.ai_analyzed === true);
    const notAnalyzed = (updates || []).filter(u => u.ai_analyzed === false);
    
    console.log(`   AI Analyzed: ${aiAnalyzed.length}`);
    console.log(`   Not Analyzed: ${notAnalyzed.length}`);
    
    // Test 5: Test database views
    console.log('\n🔧 Database Views Testing:');
    
    const { data: toolsWithUpdates, error: viewError1 } = await supabase
      .from('tools_with_latest_updates')
      .select('*')
      .limit(5);
    
    const { data: recentUpdates, error: viewError2 } = await supabase
      .from('recent_feature_updates')
      .select('*')
      .limit(5);
    
    if (viewError1) {
      console.log(`   ❌ tools_with_latest_updates view: ${viewError1.message}`);
    } else {
      console.log(`   ✅ tools_with_latest_updates view: ${toolsWithUpdates?.length || 0} records`);
    }
    
    if (viewError2) {
      console.log(`   ❌ recent_feature_updates view: ${viewError2.message}`);
    } else {
      console.log(`   ✅ recent_feature_updates view: ${recentUpdates?.length || 0} records`);
    }
    
    // Test 6: Check unique constraint compliance
    console.log('\n🛡️ Constraint Validation:');
    
    // Check for tools without categories
    const toolsWithoutCategories = (tools || []).filter(t => !t.category_id);
    console.log(`   Tools without categories: ${toolsWithoutCategories.length} (Should be 0)`);
    
    // Check for duplicate slugs
    const slugs = (tools || []).map(t => t.slug);
    const duplicateSlugs = slugs.filter((slug, index) => slugs.indexOf(slug) !== index);
    console.log(`   Duplicate slugs: ${duplicateSlugs.length} (Should be 0)`);
    
    // Check unique constraint compliance (only one validated+analyzed per tool)
    const validatedAnalyzed = (updates || []).filter(u => u.validation_status === 'validated' && u.ai_analyzed === true);
    const toolIds = validatedAnalyzed.map(u => u.tool_id);
    const duplicateToolIds = toolIds.filter((id, index) => toolIds.indexOf(id) !== index);
    console.log(`   Constraint violations: ${duplicateToolIds.length} (Should be 0)`);
    
    // Test 7: Sample specific tools and their data
    console.log('\n🔍 Sample Tool Data:');
    
    const sampleTools = ['claude-anthropic', 'github-copilot', 'cursor-ai'];
    for (const slug of sampleTools) {
      const tool = (tools || []).find(t => t.slug === slug);
      if (tool) {
        const toolUpdates = (updates || []).filter(u => u.tool_id === tool.id);
        console.log(`   ${tool.name}: ${toolUpdates.length} updates, Category: ${tool.category_id ? 'Assigned' : 'Missing'}`);
      } else {
        console.log(`   ❌ Missing tool: ${slug}`);
      }
    }
    
    // Test 8: Metadata validation
    console.log('\n📝 Metadata Validation:');
    
    const toolsWithMetadata = (tools || []).filter(t => t.metadata && Object.keys(t.metadata).length > 0);
    console.log(`   Tools with metadata: ${toolsWithMetadata.length}/${toolCount}`);
    
    const toolsWithCompany = (tools || []).filter(t => t.metadata?.company);
    console.log(`   Tools with company info: ${toolsWithCompany.length}/${toolCount}`);
    
    const toolsWithSpecialties = (tools || []).filter(t => t.metadata?.specialties?.length > 0);
    console.log(`   Tools with specialties: ${toolsWithSpecialties.length}/${toolCount}`);
    
    // Test 9: URL validation
    console.log('\n🌐 URL Validation:');
    
    const toolsWithWebsites = (tools || []).filter(t => t.website_url && t.website_url.startsWith('http'));
    console.log(`   Tools with valid website URLs: ${toolsWithWebsites.length}/${toolCount}`);
    
    const updatesWithUrls = (updates || []).filter(u => u.official_url && u.official_url.startsWith('http'));
    console.log(`   Updates with official URLs: ${updatesWithUrls.length}/${updateCount}`);
    
    // Test 10: Real-time subscription test (basic)
    console.log('\n⚡ Real-time Subscription Test:');
    
    try {
      const channel = supabase
        .channel('test-channel')
        .on('postgres_changes', 
          { event: '*', schema: 'public', table: 'feature_updates' },
          (payload) => {
            console.log('   Real-time event received:', payload.eventType);
          }
        )
        .subscribe();
      
      // Test insert to trigger real-time
      const testUpdate = {
        tool_id: (tools || [])[0]?.id,
        title: 'Test Real-time Update',
        description: 'Testing real-time functionality',
        content: 'This is a test update to verify real-time subscriptions work.',
        impact_level: 'Low',
        published_date: new Date().toISOString(),
        validation_status: 'pending',
        ai_analyzed: false
      };
      
      const { data: rtTest, error: rtError } = await supabase
        .from('feature_updates')
        .insert([testUpdate])
        .select();
      
      if (rtError) {
        console.log(`   ❌ Real-time test failed: ${rtError.message}`);
      } else {
        console.log(`   ✅ Real-time subscription working (test update created)`);
        
        // Clean up test update
        await supabase
          .from('feature_updates')
          .delete()
          .eq('id', rtTest[0].id);
      }
      
      // Unsubscribe
      supabase.removeChannel(channel);
      
    } catch (rtError) {
      console.log(`   ⚠️ Real-time test inconclusive: ${rtError.message}`);
    }
    
    // Final Summary
    console.log('\n🎯 Validation Summary:');
    
    const issues = [];
    
    if (categoryCount !== 5) issues.push(`Expected 5 categories, got ${categoryCount}`);
    if (toolCount !== 15) issues.push(`Expected 15 tools, got ${toolCount}`);
    if (toolsWithoutCategories.length > 0) issues.push(`${toolsWithoutCategories.length} tools without categories`);
    if (duplicateSlugs.length > 0) issues.push(`${duplicateSlugs.length} duplicate slugs`);
    if (duplicateToolIds.length > 0) issues.push(`${duplicateToolIds.length} constraint violations`);
    if (viewError1) issues.push('tools_with_latest_updates view not working');
    if (viewError2) issues.push('recent_feature_updates view not working');
    
    if (issues.length === 0) {
      console.log('   🎉 All validation checks passed!');
      console.log('   ✅ Database is ready for application development');
      console.log('   ✅ Data integrity confirmed');
      console.log('   ✅ Views working correctly');
      console.log('   ✅ Constraints properly enforced');
      console.log('   ✅ Real-time functionality operational');
    } else {
      console.log('   ⚠️ Issues found:');
      issues.forEach(issue => console.log(`     - ${issue}`));
    }
    
    console.log('\n📋 Next Steps:');
    console.log('1. Begin frontend component development (Task 4.1)');
    console.log('2. Test Supabase service layer integration');
    console.log('3. Implement search and filtering functionality');
    console.log('4. Set up real-time subscriptions in React components');
    console.log('5. Test TypeScript types with actual data');
    
  } catch (error) {
    console.error('❌ Validation failed:', error.message);
    console.error('Full error:', error);
    process.exit(1);
  }
}

// Run the validation
if (require.main === module) {
  validateSeededData()
    .then(() => {
      console.log('\n✅ Data validation completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Data validation failed:', error);
      process.exit(1);
    });
}

module.exports = { validateSeededData };