import { Router } from 'express';
import { promises as fs } from 'fs';
import os from 'os';
import path from 'path';
import { spawn } from 'child_process';
import { pool } from '../db.js';

export const generateVideoRouter = Router();

type GenerateVideoRequestBody = {
  imageBase64?: string;
  imageMimeType?: string;
  duration?: number;
  soundtrackUri?: string;
  width?: number;
  height?: number;
  title?: string;
  templateId?: string;
  fileName?: string;
};

const runFfmpeg = (args: string[]) =>
  new Promise<void>((resolve, reject) => {
    const ffmpeg = spawn('ffmpeg', args, { stdio: 'pipe' });

    let stderr = '';
    ffmpeg.stderr.on('data', (chunk: Buffer) => {
      stderr += chunk.toString();
    });

    ffmpeg.on('error', (error: Error) => {
      reject(new Error(`ffmpeg failed to start: ${error.message}`));
    });

    ffmpeg.on('close', (code: number | null) => {
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
  const body = req.body as GenerateVideoRequestBody;
  const imageBase64 = typeof body.imageBase64 === 'string' ? body.imageBase64.trim() : '';
  const imageMimeType = typeof body.imageMimeType === 'string' ? body.imageMimeType : 'image/png';
  const title = typeof body.title === 'string' && body.title.trim() ? body.title.trim() : 'Generated Reel';
  const templateId = typeof body.templateId === 'string' && body.templateId.trim() ? body.templateId.trim() : 'generated';
  const fileName = typeof body.fileName === 'string' && body.fileName.trim() ? body.fileName.trim() : `generated-reel-${Date.now()}.mp4`;
  const duration = Number(body.duration ?? 15);
  const width = Number(body.width ?? 1080);
  const height = Number(body.height ?? 1920);
  const soundtrackUri = typeof body.soundtrackUri === 'string' ? body.soundtrackUri.trim() : '';

  if (!imageBase64) {
    return res.status(400).json({ error: 'imageBase64 is required' });
  }

  if (!Number.isFinite(duration) || duration <= 0 || duration > 60) {
    return res.status(400).json({ error: 'duration must be a positive number up to 60' });
  }

  if (!Number.isFinite(width) || width <= 0 || !Number.isFinite(height) || height <= 0) {
    return res.status(400).json({ error: 'width and height must be positive numbers' });
  }

  const normalizedImageBase64 = imageBase64.includes(',') ? imageBase64.split(',')[1] : imageBase64;
  const frameBuffer = Buffer.from(normalizedImageBase64, 'base64');
  if (frameBuffer.length === 0) {
    return res.status(400).json({ error: 'imageBase64 is invalid' });
  }

  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'absence-video-'));
  const framePath = path.join(tempDir, 'frame.png');
  const audioPath = path.join(tempDir, 'audio.m4a');
  const outputPath = path.join(tempDir, 'output.mp4');
  const thumbnailPath = path.join(tempDir, 'thumbnail.png');

  try {
    await fs.writeFile(framePath, frameBuffer);

    const args = [
      '-y',
      '-loop',
      '1',
      '-i',
      framePath,
      '-t',
      String(duration),
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

    await runFfmpeg([
      '-y',
      '-i',
      outputPath,
      '-frames:v',
      '1',
      '-vf',
      'scale=360:-1:force_original_aspect_ratio=decrease',
      thumbnailPath,
    ]);

    const outputBuffer = await fs.readFile(outputPath);
    const thumbnailBuffer = await fs.readFile(thumbnailPath);
    const videoBase64 = outputBuffer.toString('base64');
    const thumbnailUri = `data:${imageMimeType};base64,${thumbnailBuffer.toString('base64')}`;

    const result = await pool.query(
      'INSERT INTO videos (title, file_name, template_id, duration, thumbnail_uri, content_base64) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, title, file_name AS "fileName", template_id AS "templateId", duration, thumbnail_uri AS "thumbnailUri", content_base64 AS "contentBase64", created_at AS "createdAt"',
      [title, fileName, templateId, Math.round(duration), thumbnailUri, videoBase64]
    );

    res.status(201).json({
      ...result.rows[0],
      videoBase64,
      mimeType: 'video/mp4',
      size: outputBuffer.byteLength,
      thumbnailUri,
    });
  } catch (error) {
    console.error('Error generating video:', error);
    const message = error instanceof Error ? error.message : 'Unable to generate video';
    res.status(500).json({ error: message });
  } finally {
    await Promise.allSettled([fs.rm(tempDir, { recursive: true, force: true })]);
  }
});
