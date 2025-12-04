#!/usr/bin/env node

/**
 * Security MD Tracker PR Automation
 * 
 * This script:
 * 1. Runs the security-md-tracker
 * 2. Commits any changes to data.json
 * 3. Creates a PR with details of what changed
 */

const { execSync } = require('child_process')
const path = require('path')
const fs = require('fs')
const securityMdTracker = require('../../tools/security-md-tracker')

// Constants
const BRANCH_NAME = `security-md-update-${new Date().toISOString().split('T')[0]}`
const PR_TITLE = 'Update Security.md tracking data'

// Helper to run shell commands
function runCommand(command) {
  console.log(`Running: ${command}`)
  return execSync(command, { encoding: 'utf8', stdio: 'inherit' })
}

// Helper to create a formatted PR description with changed URLs
function createPRDescription(changedUrls) {
  if (!changedUrls || changedUrls.length === 0) {
    return 'Routine security.md tracking update - no content changes detected.'
  }

  const urlList = changedUrls
    .map(url => `- **${url.project}**: [${url.url}](${url.url})`)
    .join('\n')

  return `## Security.md Content Changes Detected

The following security.md files have changed:

${urlList}

This PR updates the tracking data to reflect these changes.`
}

async function main() {
  try {
    // Configure Git for GitHub Actions
    runCommand('git config --global user.name "github-actions"')
    runCommand('git config --global user.email "github-actions@github.com"')
    
    // Create a new branch
    console.log(`Creating branch: ${BRANCH_NAME}`)
    runCommand(`git checkout -b ${BRANCH_NAME}`)
    
    // Run the security-md-tracker
    console.log('Running security-md-tracker...')
    const changedUrls = await securityMdTracker()
    
    // Check if data.json was modified
    const hasChanges = !!execSync('git status --porcelain', { encoding: 'utf8' }).trim()
    
    if (!hasChanges) {
      console.log('No changes detected. Exiting without creating PR.')
      return
    }
    
    // Commit changes
    console.log('Committing changes...')
    runCommand('git add .')
    runCommand(`git commit -m "${PR_TITLE}"`)
    
    // Push branch to remote
    console.log('Pushing branch...')
    runCommand(`git push -u origin ${BRANCH_NAME}`)
    
    // Create PR using GitHub CLI or API
    if (process.env.GITHUB_TOKEN) {
      console.log('Creating PR...')
      const prDescription = createPRDescription(changedUrls)
      
      // Using GitHub CLI if available
      try {
        runCommand(`gh pr create --title "${PR_TITLE}" --body "${prDescription}" --base main`)
        console.log('PR created successfully using GitHub CLI!')
      } catch (error) {
        console.log('GitHub CLI failed, falling back to GitHub API...')
        try {
          // Fallback to GitHub API
          const prData = JSON.stringify({
            title: PR_TITLE,
            body: prDescription,
            head: BRANCH_NAME,
            base: 'main'
          })
          
          const repoPath = process.env.GITHUB_REPOSITORY
          
          // Use curl but capture the output to check for errors
          const response = execSync(`curl -X POST -H "Authorization: token ${process.env.GITHUB_TOKEN}" \
            -H "Accept: application/vnd.github.v3+json" \
            https://api.github.com/repos/${repoPath}/pulls \
            -d '${prData}'`, { encoding: 'utf8' })
          
          // Check if the response contains an error
          if (response.includes('"message":') && (response.includes('"status":"403"') || response.includes('"status": "403"'))) {
            console.error('Error creating PR: Permission denied')
            console.error(response)
            throw new Error('GitHub API returned a 403 error. Permission denied for PR creation.')
          }
          
          console.log('PR created successfully using GitHub API!')
        } catch (apiError) {
          console.error('Error creating PR:', apiError.message)
          console.log('Failed to create PR. Please check workflow permissions and token access.')
          console.log('Changes have been committed locally. You may need to create the PR manually.')
          process.exit(1) // Exit with error code
        }
      }
      
      // Only log success if we actually got here without errors
      console.log('PR created successfully!')
    } else {
      console.log('GITHUB_TOKEN not found. Skipping PR creation.')
      console.log('Branch has been pushed. Create PR manually.')
    }
    
  } catch (error) {
    console.error('Error:', error)
    process.exit(1)
  }
}

main()
