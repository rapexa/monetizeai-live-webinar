# Video Files Directory

This directory contains video files that will be streamed by the backend server.

## Supported Formats
- MP4 (recommended)
- WebM
- OGV

## File Naming
- `video1.mp4` - Default video (before 6 PM)
- `video2.mp4` - Alternative video (after 6 PM)

## How to Add Videos

1. Place your video files in this directory
2. Name them according to the convention above
3. Ensure the files are in MP4 format for best compatibility
4. The backend will automatically serve them via streaming

## Streaming Features

The backend provides:
- **Range requests** - Supports seeking and partial content
- **CORS headers** - Allows frontend to access videos
- **Security** - Prevents directory traversal attacks
- **Efficient streaming** - 32KB buffer for optimal performance

## Access URLs

- `http://localhost:8081/video/video1.mp4` - Stream video1
- `http://localhost:8081/video/video2.mp4` - Stream video2
- `http://localhost:8081/video/` - Stream default video

## Example Video Files

You can add sample videos here for testing:
- `video1.mp4` - Main webinar video
- `video2.mp4` - Alternative content
- `intro.mp4` - Introduction video
- `outro.mp4` - Closing video 