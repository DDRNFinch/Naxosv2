/**
 * QR Code Course Generator for Naxosv2
 * Generates scannable QR codes that point to course data for Evia-Claude
 */

const QRCode = require('qrcode');
const fs = require('fs').promises;
const path = require('path');

class CourseQRGenerator {
  /**
   * Initialize the QR generator
   * @param {string} baseUrl - Base URL for generated links (e.g., https://naxosv2.app)
   * @param {string} outputDir - Directory to save QR codes
   */
  constructor(baseUrl = 'https://naxosv2.app', outputDir = './qr-codes') {
    this.baseUrl = baseUrl;
    this.outputDir = outputDir;
  }

  /**
   * Generate course enrollment URL
   * @param {string} courseId - Course ID (e.g., ST0095, ST0264-SITE, 6570-05)
   * @param {object} metadata - Optional metadata to encode
   * @returns {string} Encoded course URL
   */
  generateCourseUrl(courseId, metadata = {}) {
    const params = new URLSearchParams({
      action: 'enroll',
      courseId: courseId,
      source: 'qr',
      ...metadata
    });
    return `${this.baseUrl}/enroll?${params.toString()}`;
  }

  /**
   * Generate QR code image for a course
   * @param {string} courseId - Course ID
   * @param {object} options - QR code options
   * @returns {Promise<Buffer>} QR code image buffer
   */
  async generateQRCode(courseId, options = {}) {
    const courseUrl = this.generateCourseUrl(courseId, options.metadata || {});
    
    const qrOptions = {
      errorCorrectionLevel: 'H',
      type: 'image/png',
      quality: 0.95,
      margin: 1,
      width: 300,
      ...options.qrSettings
    };

    try {
      return await QRCode.toBuffer(courseUrl, qrOptions);
    } catch (error) {
      console.error(`Error generating QR code for course ${courseId}:`, error);
      throw error;
    }
  }

  /**
   * Save QR code to file
   * @param {string} courseId - Course ID
   * @param {Buffer} qrBuffer - QR code image buffer
   * @returns {Promise<string>} Path to saved file
   */
  async saveQRCode(courseId, qrBuffer) {
    await fs.mkdir(this.outputDir, { recursive: true });
    const filename = `${courseId}-qr.png`;
    const filepath = path.join(this.outputDir, filename);
    await fs.writeFile(filepath, qrBuffer);
    return filepath;
  }

  /**
   * Generate and save QR codes for all courses
   * @param {object} courseMetadata - Course metadata from course-metadata.json
   * @returns {Promise<object>} Map of courseId to QR code file paths
   */
  async generateAllCourseQRs(courseMetadata) {
    const results = {};
    
    for (const [courseId, courseData] of Object.entries(courseMetadata.courses)) {
      try {
        const metadata = {
          title: courseData.title,
          version: courseData.version,
          level: courseData.level
        };

        const qrBuffer = await this.generateQRCode(courseId, { metadata });
        const filepath = await this.saveQRCode(courseId, qrBuffer);
        
        results[courseId] = {
          success: true,
          filepath: filepath,
          url: this.generateCourseUrl(courseId, metadata),
          title: courseData.title
        };

        console.log(`✓ Generated QR code for ${courseId}: ${courseData.title}`);
      } catch (error) {
        results[courseId] = {
          success: false,
          error: error.message
        };
        console.error(`✗ Failed to generate QR code for ${courseId}:`, error.message);
      }
    }

    return results;
  }

  /**
   * Generate QR code manifest (JSON index of all QR codes)
   * @param {object} results - Results from generateAllCourseQRs
   * @returns {Promise<string>} Path to manifest file
   */
  async generateManifest(results) {
    const manifest = {
      generated: new Date().toISOString(),
      baseUrl: this.baseUrl,
      totalCourses: Object.keys(results).length,
      successCount: Object.values(results).filter(r => r.success).length,
      courses: results
    };

    const manifestPath = path.join(this.outputDir, 'manifest.json');
    await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2));
    return manifestPath;
  }

  /**
   * Generate SVG QR code (for embedding in documents)
   * @param {string} courseId - Course ID
   * @param {object} options - SVG options
   * @returns {Promise<string>} SVG string
   */
  async generateQRCodeSVG(courseId, options = {}) {
    const courseUrl = this.generateCourseUrl(courseId, options.metadata || {});
    
    try {
      return await QRCode.toString(courseUrl, {
        errorCorrectionLevel: 'H',
        type: 'svg',
        width: 10,
        ...options.qrSettings
      });
    } catch (error) {
      console.error(`Error generating SVG QR code for course ${courseId}:`, error);
      throw error;
    }
  }
}

module.exports = CourseQRGenerator;
