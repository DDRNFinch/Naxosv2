# QR Code Course Generator

The QR Code Course Generator adds scannable QR code functionality to Naxosv2, enabling Evia-Claude to enroll learners in courses simply by scanning a code.

## Features

- **QR Code Generation**: Generate PNG or SVG QR codes for each course
- **Batch Processing**: Generate QR codes for all courses at once
- **API Integration**: RESTful API endpoints for dynamic QR generation
- **CLI Tool**: Command-line interface for generating and managing QR codes
- **Enrollment Webhook**: Handle enrollment when Evia-Claude scans a QR code

## Installation

Ensure the `qrcode` package is installed:

```bash
npm install qrcode
```

## Usage

### Command Line Interface

#### Generate QR codes for all courses:
```bash
node src/qr-cli.js
```

#### Generate QR code for a specific course:
```bash
node src/qr-cli.js --course ST0095
```

#### Custom options:
```bash
node src/qr-cli.js \
  --base-url https://my-evia.app \
  --output ./public/qr-codes \
  --metadata ./data/course-metadata.json
```

### API Endpoints

Include the QR router in your Express app:

```javascript
const express = require('express');
const { createQRRouter } = require('./src/qr-api');
const courseMetadata = require('./data/course-metadata.json');

const app = express();
const qrRouter = createQRRouter(courseMetadata, {
  baseUrl: 'https://naxosv2.app'
});

app.use(qrRouter);
app.listen(3000);
```

#### Available Endpoints

**GET `/api/qr/:courseId`**
- Returns QR code as PNG image
- Query params: `format=png|svg`
- Example: `GET /api/qr/ST0095?format=png`

**GET `/api/qr/info/:courseId`**
- Returns QR metadata and URLs without generating image
- Example: `GET /api/qr/info/ST0095`
- Response:
```json
{
  "courseId": "ST0095",
  "title": "Bricklayer",
  "version": "1.2",
  "level": 2,
  "enrollUrl": "https://naxosv2.app/enroll?action=enroll&courseId=ST0095&source=qr&title=Bricklayer&version=1.2&level=2",
  "qrCodeUrl": "/api/qr/ST0095?format=png",
  "qrCodeSvgUrl": "/api/qr/ST0095?format=svg"
}
```

**GET `/api/qr/all`**
- Returns QR metadata for all courses
- Response:
```json
{
  "total": 4,
  "generated": "2026-09-09T12:30:00Z",
  "courses": [
    {
      "courseId": "ST0095",
      "title": "Bricklayer",
      "version": "1.2",
      "level": 2,
      "courseType": "standard",
      "enrollUrl": "...",
      "qrCodeUrl": "/api/qr/ST0095?format=png",
      "qrCodeSvgUrl": "/api/qr/ST0095?format=svg"
    },
    ...
  ]
}
```

**POST `/api/qr/enroll`**
- Handle enrollment when QR code is scanned
- Request body:
```json
{
  "courseId": "ST0095",
  "userId": "learner123",
  "learnerName": "John Smith",
  "metadata": {
    "deviceId": "mobile-001",
    "timestamp": "2026-09-09T12:30:00Z"
  }
}
```
- Response:
```json
{
  "success": true,
  "message": "Enrollment initiated",
  "courseId": "ST0095",
  "courseTitle": "Bricklayer",
  "courseData": {
    "id": "ST0095",
    "title": "Bricklayer",
    "version": "1.2",
    "level": 2,
    "courseType": "standard",
    "learnerPackCount": 12
  },
  "sourceUrl": "https://skillsengland.education.gov.uk/..."
}
```

**GET `/api/qr/health`**
- Health check for QR service
- Response:
```json
{
  "status": "healthy",
  "service": "QR Code Generator",
  "courseCount": 4,
  "baseUrl": "https://naxosv2.app",
  "timestamp": "2026-09-09T12:30:00Z"
}
```

## Integration with Evia-Claude

### QR Code Scanning Flow

1. **Generate**: Create QR codes via CLI or API
2. **Display**: Show QR code to learner (printed, on screen, etc.)
3. **Scan**: Evia-Claude scans the QR code with device camera
4. **Decode**: QR contains enrollment URL: `https://naxosv2.app/enroll?action=enroll&courseId=ST0095&source=qr&...`
5. **Enroll**: POST to `/api/qr/enroll` with learner details
6. **Confirm**: System confirms enrollment and returns course data

### URL Structure

Each QR code encodes an enrollment URL with the structure:
```
{baseUrl}/enroll?action=enroll&courseId={id}&source=qr&title={title}&version={version}&level={level}
```

This URL is parsed by Evia-Claude to:
- Identify the course
- Prepare enrollment data
- Send to enrollment endpoint

## Courses

Available courses in Naxosv2:
- **ST0095** - Bricklayer (v1.2, Level 2)
- **ST0264-SITE** - Site Carpenter (v1.4, Level 2)
- **ST0264-AJ** - Architectural Joiner (v1.4, Level 2)
- **6570-05** - Trowel Occupations (v1.1, Level 3)

## Output

### CLI Generation

When generating QR codes via CLI:
- PNG files saved to `qr-codes/` directory (default)
- Files named: `{courseId}-qr.png`
- Manifest file: `qr-codes/manifest.json`

Example directory structure:
```
qr-codes/
├── ST0095-qr.png
├── ST0264-SITE-qr.png
├── ST0264-AJ-qr.png
├── 6570-05-qr.png
└── manifest.json
```

### Manifest File

Contains metadata about generated QR codes:
```json
{
  "generated": "2026-09-09T12:30:00Z",
  "baseUrl": "https://naxosv2.app",
  "totalCourses": 4,
  "successCount": 4,
  "courses": {
    "ST0095": {
      "success": true,
      "filepath": "./qr-codes/ST0095-qr.png",
      "url": "https://naxosv2.app/enroll?...",
      "title": "Bricklayer"
    },
    ...
  }
}
```

## Configuration

### Environment Variables

- `NAXOS_BASE_URL` - Base URL for enrollment links (default: `https://naxosv2.app`)
- `NAXOS_QR_OUTPUT` - Output directory for QR codes (default: `./qr-codes`)

### Programmatic Usage

```javascript
const CourseQRGenerator = require('./src/qr-generator');

const generator = new CourseQRGenerator(
  'https://my-evia.app',  // baseUrl
  './output/qr-codes'      // outputDir
);

// Generate single QR code
const qrBuffer = await generator.generateQRCode('ST0095');

// Save to file
await generator.saveQRCode('ST0095', qrBuffer);

// Generate all courses
const courseMetadata = require('./data/course-metadata.json');
const results = await generator.generateAllCourseQRs(courseMetadata);

// Create manifest
await generator.generateManifest(results);

// Generate as SVG string (for embedding)
const svgQR = await generator.generateQRCodeSVG('ST0095');
```

## Troubleshooting

### QR Code not scanning
- Ensure sufficient contrast (white background, black QR code)
- Check QR size is at least 2x2 cm (0.8x0.8 inches)
- Verify URL in QR is accessible

### Enrollment fails
- Check `/api/qr/health` endpoint responds with status "healthy"
- Verify `courseId` in QR matches course in metadata
- Check network connectivity between Evia-Claude and Naxosv2 server

### File permission errors
- Ensure output directory has write permissions
- Create directory manually if needed: `mkdir -p qr-codes`

## Future Enhancements

- Dynamic QR code sizing based on error correction level
- Batch enrollment support (one QR for multiple courses)
- Analytics tracking for QR scans
- Custom branding/logos in QR codes
- Push notifications on successful enrollment
- Expiring QR codes with time-limited enrollment
