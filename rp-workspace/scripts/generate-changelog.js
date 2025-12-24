#!/usr/bin/env node

/**
 * Changelog Generator Script
 * 
 * Generates CHANGELOG.md from git commits
 * Usage: node scripts/generate-changelog.js [version]
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function getGitCommits(sinceTag) {
  try {
    const command = sinceTag
      ? `git log ${sinceTag}..HEAD --pretty=format:"%s|%h|%an"`
      : `git log --pretty=format:"%s|%h|%an"`;
    
    const output = execSync(command, { encoding: 'utf-8' });
    return output.trim().split('\n').filter(Boolean);
  } catch (error) {
    return [];
  }
}

function categorizeCommit(message) {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('feat') || lowerMessage.includes('add')) {
    return 'Added';
  }
  if (lowerMessage.includes('fix') || lowerMessage.includes('bug')) {
    return 'Fixed';
  }
  if (lowerMessage.includes('refactor') || lowerMessage.includes('improve')) {
    return 'Changed';
  }
  if (lowerMessage.includes('remove') || lowerMessage.includes('delete')) {
    return 'Removed';
  }
  if (lowerMessage.includes('docs')) {
    return 'Documentation';
  }
  if (lowerMessage.includes('test')) {
    return 'Tests';
  }
  
  return 'Other';
}

function generateChangelog(version, sinceTag = null) {
  const commits = getGitCommits(sinceTag);
  const categorized = {};
  
  commits.forEach(commit => {
    const [message, hash, author] = commit.split('|');
    const category = categorizeCommit(message);
    
    if (!categorized[category]) {
      categorized[category] = [];
    }
    
    categorized[category].push({
      message: message.trim(),
      hash: hash.substring(0, 7),
      author
    });
  });
  
  const date = new Date().toISOString().split('T')[0];
  let changelog = `## [${version}] - ${date}\n\n`;
  
  const order = ['Added', 'Changed', 'Fixed', 'Removed', 'Documentation', 'Tests', 'Other'];
  
  order.forEach(category => {
    if (categorized[category] && categorized[category].length > 0) {
      changelog += `### ${category}\n\n`;
      categorized[category].forEach(({ message, hash }) => {
        changelog += `- ${message} (${hash})\n`;
      });
      changelog += '\n';
    }
  });
  
  return changelog;
}

function main() {
  const version = process.argv[2] || 'Unreleased';
  
  // Get last tag
  let lastTag = null;
  try {
    lastTag = execSync('git describe --tags --abbrev=0', { encoding: 'utf-8' }).trim();
  } catch (error) {
    console.log('No previous tags found, generating full changelog');
  }
  
  const changelogEntry = generateChangelog(version, lastTag);
  const changelogPath = path.join(__dirname, '../docs/CHANGELOG.md');
  
  let existingChangelog = '';
  if (fs.existsSync(changelogPath)) {
    existingChangelog = fs.readFileSync(changelogPath, 'utf-8');
    // Remove the "Unreleased" section if it exists
    existingChangelog = existingChangelog.replace(/## \[Unreleased\].*?(?=## |$)/s, '');
  }
  
  const header = `# Changelog\n\nAll notable changes to this project will be documented in this file.\n\nThe format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),\nand this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).\n\n`;
  
  const fullChangelog = header + changelogEntry + '\n' + existingChangelog.replace(/^# Changelog\n\n.*?\n\n/, '');
  
  fs.writeFileSync(changelogPath, fullChangelog);
  console.log(`✅ Changelog generated for version ${version}`);
  console.log(`📝 Updated ${changelogPath}`);
}

main();

