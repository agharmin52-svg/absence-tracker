import { Router } from 'express';
import { promises as fs } from 'fs';
import os from 'os';
import path from 'path';
import { spawn } from 'child_process';

export const generateVideoRouter = Router();

const runFfmpeg = (args: string[]) =>
  new Promise<void>((resolve, reject) => {
    const ffmpeg = spawn('ffmpeg', args, { stdio: 'pipe' });

    let stderr = '';
    ffmpeg.stderr.on('data', (chunk) => {
      stderr += chunk.toString();
    });

    ffmpeg.on('error', (error) => {
      reject(new Error(`ffmpeg failed to start: ${error.message}`));
    });

    ffmpeg.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`ffmpeg exited with code ${code}: ${stderr}`));
      }
    });
  });

const readAudioBuffer = async (soundtrackUri: string) => {
  if (soundtrackUri.startsWith('data:')) {
    const [, payload] = soundtrackUri.split(',');
    return Buffer.from(payload, 'base64');
  }

  const response = await fetch(soundtrackUri);
  if (!response.ok) {
    throw new Error(`Unable to download audio from ${soundtrackUri}`);
  }

  return Buffer.from(await response.arrayBuffer());
};

generateVideoRouter.post('/', async (req, res) => {
  const {
    imageBase64,
    imageMimeType = 'image/png',
    duration = 15,
    soundtrackUri,
    width = 1080,
    height = 1920,
  } = req.body as {
    imageBase64?: string;
    imageMimeType?: string;
    duration?: number;
    soundtrackUri?: string;
    width?: number;
    height?: number;
  };

  if (!imageBase64) {
    return res.status(400).json({ error: 'imageBase64 is required' });
  }

  const parsedDuration = Number(duration);
  if (!Number.isFinite(parsedDuration) || parsedDuration <= 0) {
    return res.status(400).json({ error: 'duration must be a positive number' });
  }

  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'absence-video-'));
  const framePath = path.join(tempDir, 'frame.png');
  const audioPath = path.join(tempDir, 'audio.m4a');
  const outputPath = path.join(tempDir, 'output.mp4');

  try {
    const frameBuffer = Buffer.from(imageBase64, 'base64');
    await fs.writeFile(framePath, frameBuffer);

    const args = [
      '-y',
      '-loop',
      '1',
      '-i',
      framePath,
      '-t',
      String(parsedDuration),
      '-vf',
      `scale=${width}:${height}:force_original_aspect_ratio=decrease,pad=${width}:${height}:(ow-iw)/2:(oh-ih)/2`,
      '-c:v',
      'libx264',
      '-pix_fmt',
      'yuv420p',
      '-movflags',
      '+faststart',
      outputPath,
    ];

    if (soundtrackUri) {
      const audioBuffer = await readAudioBuffer(soundtrackUri);
      await fs.writeFile(audioPath, audioBuffer);
      args.splice(args.length - 1, 0, '-i', audioPath, '-c:a', 'aac', '-shortest');
    }

    await runFfmpeg(args);

    const outputBuffer = await fs.readFile(outputPath);
    res.json({
      videoBase64: outputBuffer.toString('base64'),
      fileName: 'generated-video.mp4',
      mimeType: 'video/mp4',
      size: outputBuffer.byteLength,
      imageMimeType,
    });
  } catch (error) {
    console.error('Error generating video:', error);
    const message = error instanceof Error ? error.message : 'Unable to generate video';
    res.status(500).json({ error: message });
  } finally {
    await Promise.allSettled([
      fs.rm(tempDir, { recursive: true, force: true }),
    ]);
  }
});
