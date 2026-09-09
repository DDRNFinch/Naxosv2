#!/usr/bin/env node

/**
 * CLI tool for generating QR codes from Naxosv2 courses
 * Usage: node src/qr-cli.js [options]
 */

const fs = require('fs').promises;
const path = require('path');
const CourseQRGenerator = require('./qr-generator');

async function main() {
  const args = process.argv.slice(2);
  
  // Parse command line arguments
  const options = {
    baseUrl: process.env.NAXOS_BASE_URL || 'https://naxosv2.app',
    outputDir: process.env.NAXOS_QR_OUTPUT || './qr-codes',
    metadataFile: './data/course-metadata.json',
    course: null
  };

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--base-url') options.baseUrl = args[++i];
    if (args[i] === '--output') options.outputDir = args[++i];
    if (args[i] === '--metadata') options.metadataFile = args[++i];
    if (args[i] === '--course') options.course = args[++i];
    if (args[i] === '--help') {
      printHelp();
      process.exit(0);
    }
  }

  try {
    // Load course metadata
    const metadataContent = await fs.readFile(options.metadataFile, 'utf-8');
    const courseMetadata = JSON.parse(metadataContent);

    // Initialize generator
    const generator = new CourseQRGenerator(options.baseUrl, options.outputDir);

    if (options.course) {
      // Generate QR for single course
      console.log(`\n📱 Generating QR code for course: ${options.course}\n`);
      
      if (!courseMetadata.courses[options.course]) {
        console.error(`❌ Course not found: ${options.course}`);
        console.error(`Available courses: ${Object.keys(courseMetadata.courses).join(', ')}`);
        process.exit(1);
      }

      const courseData = courseMetadata.courses[options.course];
      const metadata = {
        title: courseData.title,
        version: courseData.version,
        level: courseData.level
      };

      const qrBuffer = await generator.generateQRCode(options.course, { metadata });
      const filepath = await generator.saveQRCode(options.course, qrBuffer);
      const enrollUrl = generator.generateCourseUrl(options.course, metadata);

      console.log(`✅ QR code generated successfully!`);
      console.log(`📁 Saved to: ${filepath}`);
      console.log(`🔗 URL: ${enrollUrl}`);
    } else {
      // Generate QR codes for all courses
      console.log(`\n📱 Generating QR codes for all courses...\n`);
      
      const results = await generator.generateAllCourseQRs(courseMetadata);
      const manifestPath = await generator.generateManifest(results);

      const failedCount = Object.values(results).filter(r => !r.success).length;

      console.log(`\n✅ QR code generation complete!`);
      console.log(`📁 Saved to: ${options.outputDir}`);
      console.log(`📋 Manifest: ${manifestPath}`);
      console.log(`\nResults:`);
      console.log(`  ✓ Successful: ${Object.values(results).filter(r => r.success).length}`);
      console.log(`  ✗ Failed: ${failedCount}`);
      
      if (failedCount > 0) {
        console.log(`\nFailed courses:`);
        Object.entries(results).forEach(([courseId, result]) => {
          if (!result.success) {
            console.log(`  - ${courseId}: ${result.error}`);
          }
        });
      }
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

function printHelp() {
  console.log(`
🎓 QR Code Generator for Naxosv2 Courses

Usage:
  node src/qr-cli.js [options]

Options:
  --base-url <url>          Base URL for enrollment links
                            (default: https://naxosv2.app)
  --output <dir>            Output directory for QR codes
                            (default: ./qr-codes)
  --metadata <file>         Path to course metadata JSON
                            (default: ./data/course-metadata.json)
  --course <id>             Generate QR for specific course
                            (ST0095, ST0264-SITE, ST0264-AJ, 6570-05)
  --help                    Show this help message

Environment Variables:
  NAXOS_BASE_URL            Base URL for enrollment links
  NAXOS_QR_OUTPUT           Output directory for QR codes

Examples:
  # Generate QR codes for all courses
  node src/qr-cli.js

  # Generate QR code for single course
  node src/qr-cli.js --course ST0095

  # Use custom output directory
  node src/qr-cli.js --output ./public/qr-codes

  # Use custom base URL
  node src/qr-cli.js --base-url https://my-evia.app

  # All options together
  node src/qr-cli.js \\
    --course ST0264-SITE \\
    --base-url https://evia-claude.app \\
    --output ./qr-output
  `);
}

main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
