/**
 * Express API endpoints for QR code generation
 * Integrates with Naxosv2 web server
 */

const express = require('express');
const CourseQRGenerator = require('./qr-generator');

/**
 * Create QR code API router
 * @param {object} courseMetadata - Course metadata from course-metadata.json
 * @param {object} config - Configuration object
 * @returns {express.Router} Configured Express router
 */
function createQRRouter(courseMetadata, config = {}) {
  const router = express.Router();
  
  const baseUrl = config.baseUrl || process.env.NAXOS_BASE_URL || 'https://naxosv2.app';
  const qrGenerator = new CourseQRGenerator(baseUrl);

  /**
   * GET /api/qr/:courseId
   * Returns QR code image PNG for a specific course
   */
  router.get('/api/qr/:courseId', async (req, res) => {
    const { courseId } = req.params;
    const { format = 'png' } = req.query;

    // Validate course ID
    if (!courseMetadata.courses[courseId]) {
      return res.status(404).json({
        error: 'Course not found',
        courseId,
        availableCourses: Object.keys(courseMetadata.courses)
      });
    }

    try {
      const courseData = courseMetadata.courses[courseId];
      const metadata = {
        title: courseData.title,
        version: courseData.version,
        level: courseData.level
      };

      if (format === 'svg') {
        const svgQR = await qrGenerator.generateQRCodeSVG(courseId, { metadata });
        res.type('svg');
        res.send(svgQR);
      } else {
        // Default to PNG
        const qrBuffer = await qrGenerator.generateQRCode(courseId, { metadata });
        res.type('png');
        res.send(qrBuffer);
      }
    } catch (error) {
      console.error(`QR generation error for ${courseId}:`, error);
      res.status(500).json({
        error: 'Failed to generate QR code',
        courseId,
        message: error.message
      });
    }
  });

  /**
   * GET /api/qr/info/:courseId
   * Returns QR code metadata without generating image
   */
  router.get('/api/qr/info/:courseId', (req, res) => {
    const { courseId } = req.params;

    if (!courseMetadata.courses[courseId]) {
      return res.status(404).json({
        error: 'Course not found',
        courseId,
        availableCourses: Object.keys(courseMetadata.courses)
      });
    }

    const courseData = courseMetadata.courses[courseId];
    const enrollUrl = qrGenerator.generateCourseUrl(courseId, {
      title: courseData.title,
      version: courseData.version,
      level: courseData.level
    });

    res.json({
      courseId,
      title: courseData.title,
      version: courseData.version,
      level: courseData.level,
      enrollUrl,
      qrCodeUrl: `/api/qr/${courseId}?format=png`,
      qrCodeSvgUrl: `/api/qr/${courseId}?format=svg`
    });
  });

  /**
   * GET /api/qr/all
   * Returns QR code URLs for all courses
   */
  router.get('/api/qr/all', (req, res) => {
    const courses = Object.entries(courseMetadata.courses).map(([courseId, courseData]) => {
      const enrollUrl = qrGenerator.generateCourseUrl(courseId, {
        title: courseData.title,
        version: courseData.version,
        level: courseData.level
      });

      return {
        courseId,
        title: courseData.title,
        version: courseData.version,
        level: courseData.level,
        courseType: courseData.courseType,
        enrollUrl,
        qrCodeUrl: `/api/qr/${courseId}?format=png`,
        qrCodeSvgUrl: `/api/qr/${courseId}?format=svg`
      };
    });

    res.json({
      total: courses.length,
      generated: new Date().toISOString(),
      courses
    });
  });

  /**
   * POST /api/qr/enroll
   * Enrollment webhook - Evia-Claude scans QR and calls this endpoint
   */
  router.post('/api/qr/enroll', (req, res) => {
    const { courseId, userId, learnerName, metadata = {} } = req.body;

    if (!courseId) {
      return res.status(400).json({
        error: 'Missing courseId',
        required: ['courseId']
      });
    }

    if (!courseMetadata.courses[courseId]) {
      return res.status(404).json({
        error: 'Course not found',
        courseId
      });
    }

    try {
      const courseData = courseMetadata.courses[courseId];
      
      // Log enrollment event (can be extended with database/webhook integration)
      console.log(`📝 Enrollment initiated:`, {
        courseId,
        courseTitle: courseData.title,
        userId,
        learnerName,
        timestamp: new Date().toISOString(),
        metadata
      });

      res.json({
        success: true,
        message: 'Enrollment initiated',
        courseId,
        courseTitle: courseData.title,
        courseData: {
          id: courseData.id,
          title: courseData.title,
          version: courseData.version,
          level: courseData.level,
          courseType: courseData.courseType,
          learnerPackCount: courseData.learnerPackCount
        },
        sourceUrl: courseData.sourceUrl
      });
    } catch (error) {
      console.error('Enrollment error:', error);
      res.status(500).json({
        error: 'Enrollment failed',
        message: error.message
      });
    }
  });

  /**
   * GET /api/qr/health
   * Health check endpoint for QR service
   */
  router.get('/api/qr/health', (req, res) => {
    res.json({
      status: 'healthy',
      service: 'QR Code Generator',
      courseCount: Object.keys(courseMetadata.courses).length,
      baseUrl,
      timestamp: new Date().toISOString()
    });
  });

  return router;
}

module.exports = { createQRRouter };
