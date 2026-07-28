import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Healthcheck endpoint
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', app: 'CalmReader', timestamp: new Date().toISOString() });
  });

  // API Route: Download Package
  app.post('/api/download-package', (req, res) => {
    try {
      const { bookId, userId } = req.body || {};
      
      // Simulate/Generate download link
      const downloadUrl = `https://calmreader.app/api/assets/${bookId || 'package-001'}.epub`;
      
      res.json({
        success: true,
        bookId: bookId || 'pkg_default',
        userId: userId || 'anonymous',
        downloadUrl,
        expiresIn: 3600, // 1 hour
      });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error?.message || 'Server error' });
    }
  });

  // API Route: Verify License
  app.post('/api/verify-license', (req, res) => {
    try {
      const { bookId, userId, deviceId } = req.body || {};
      
      res.json({
        success: true,
        isValid: true,
        canRegister: true,
        deviceCount: 1,
        maxDevices: 5,
        licenseKey: `LIC-${(bookId || 'CALM').toUpperCase()}-2026-X892`,
        userId: userId || 'usr_default',
        deviceId: deviceId || 'dev_companion'
      });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error?.message || 'Server error' });
    }
  });

  // API Route: Register Device
  app.post('/api/device-register', (req, res) => {
    try {
      const { userId, deviceId, deviceName, deviceType } = req.body || {};
      
      res.json({
        success: true,
        device: {
          id: deviceId || `dev_${Date.now()}`,
          userId: userId || 'usr_default',
          name: deviceName || 'CalmReader Companion',
          type: deviceType || 'mobile',
          registeredAt: new Date().toISOString(),
          status: 'active'
        }
      });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error?.message || 'Server error' });
    }
  });

  // Mock API Route: Download Package (Testing for Flutter/Web)
  app.post('/api/mock/download-package', (_req, res) => {
    res.json({
      success: true,
      downloadUrl: 'https://example.com/sample-book.pdf',
      expiresIn: 3600,
      isMock: true
    });
  });

  // Vite Middleware for development mode
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`CalmReader server active at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start CalmReader server:', err);
});
