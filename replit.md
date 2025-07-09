# NurseScript - Voice-Enabled Nursing Handover Application

## Overview

NurseScript is a healthcare-focused Progressive Web Application (PWA) designed to streamline nursing handovers through voice-to-text technology. The application allows nurses to record voice handovers, automatically transcribe them, and generate structured ISBAR (Identify, Situation, Background, Assessment, Recommendation) reports using AI.

**Current Status**: Core application is built and functional with authentication, voice recording, patient management, and AI-powered transcription/reporting features.

## User Preferences

Preferred communication style: Simple, everyday language.

## Recent Changes (January 2025)

✓ Built complete mobile-first PWA with all core features  
✓ Implemented authentication system with JWT tokens  
✓ Created voice recording with MediaRecorder API  
✓ Integrated OpenAI Whisper for transcription  
✓ Added AI-powered ISBAR report generation  
✓ Set up PostgreSQL database with user/patient/handover tables  
✓ Added PWA support with service worker and manifest  
✓ Created registration system for new users  
✓ Built comprehensive handovers page with "My Recent" and "All Recent" tabs  
✓ Added handover export functionality (CSV download)  
✓ Created edit profile, change password, and reports pages  
✓ Enhanced search functionality with better error handling  
✓ Added sample data initialization endpoint  
✓ Fixed handover date expansion and null safety issues  
→ Core functionality complete, ready for testing

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript
- **Build Tool**: Vite for development and production builds
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query for server state management
- **UI Framework**: Radix UI components with Tailwind CSS for styling
- **Component Library**: ShadCN/UI components for consistent design

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **Database ORM**: Drizzle ORM with PostgreSQL
- **Authentication**: JWT-based authentication with bcrypt for password hashing
- **File Handling**: Multer for audio file uploads

### Mobile-First Design
- Progressive Web App (PWA) with service worker
- Responsive design optimized for mobile devices
- Touch-friendly interface with bottom navigation
- Offline-first capabilities with caching

## Key Components

### Authentication System
- JWT-based authentication with 24-hour token expiration
- Employee ID and password-based login
- Role-based access control (nurse, admin roles)
- Secure password hashing with bcrypt

### Audio Processing Pipeline
- **Recording**: Browser-based MediaRecorder API for audio capture
- **Upload**: Multer middleware for file handling (50MB limit)
- **Transcription**: OpenAI Whisper API for speech-to-text conversion
- **AI Analysis**: OpenAI GPT for generating structured ISBAR reports

### Database Schema
- **Users**: Employee information, credentials, departments, shifts
- **Patients**: Patient demographics, room assignments, status
- **Handovers**: Audio recordings, transcriptions, ISBAR reports, processing status

### User Interface Components
- **Dashboard**: Overview of recent handovers and statistics
- **Recording Modal**: Voice recording interface with real-time feedback
- **Patient Search**: Full-text search with filtering by ward and status
- **ISBAR Reports**: Structured display of generated reports
- **Settings**: App configuration and user preferences

## Data Flow

1. **User Authentication**: Employee logs in with ID and password
2. **Patient Selection**: Nurse searches and selects patient for handover
3. **Voice Recording**: Audio is captured using browser MediaRecorder API
4. **File Upload**: Audio file is uploaded to server via multipart form
5. **Transcription**: OpenAI Whisper converts audio to text
6. **ISBAR Generation**: GPT analyzes transcription and generates structured report
7. **Storage**: Handover data is stored in PostgreSQL database
8. **Retrieval**: Reports are accessible through dashboard and patient details

## External Dependencies

### AI Services
- **OpenAI API**: Whisper for transcription, GPT for ISBAR report generation
- **Configuration**: API key via environment variables

### Database
- **Neon Serverless PostgreSQL**: Cloud-hosted database
- **Connection**: Via DATABASE_URL environment variable
- **Migrations**: Drizzle Kit for schema management

### Third-Party Libraries
- **Authentication**: jsonwebtoken, bcrypt
- **File Processing**: multer for uploads
- **UI Components**: Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables
- **HTTP Client**: TanStack Query for API requests

## Deployment Strategy

### Development Environment
- **Dev Server**: Vite dev server with HMR
- **Backend**: tsx for TypeScript execution
- **Database**: Drizzle push for schema updates

### Production Build
- **Frontend**: Vite build to dist/public
- **Backend**: esbuild bundle to dist/index.js
- **Database**: Drizzle migrations applied via push command

### Environment Configuration
- **NODE_ENV**: Development/production mode switching
- **DATABASE_URL**: PostgreSQL connection string
- **OPENAI_API_KEY**: API authentication for AI services
- **JWT_SECRET**: Token signing secret

### Security Considerations
- Password hashing with bcrypt
- JWT token expiration and validation
- File upload restrictions and validation
- Environment variable protection
- CORS and request validation

The application is designed as a mobile-first PWA with offline capabilities, focusing on ease of use for healthcare professionals in fast-paced environments while maintaining security and data integrity standards required in healthcare settings.