// X-Ray Storage Layer
// File-based storage for traces using the .xray directory

import { promises as fs } from 'fs';
import path from 'path';
import type { XRayTrace, XRayTraceListItem } from './types';

const XRAY_DIR = path.join(process.cwd(), '.xray');
const TRACES_DIR = path.join(XRAY_DIR, 'traces');

async function ensureDirectories(): Promise<void> {
  try {
    await fs.mkdir(TRACES_DIR, { recursive: true });
  } catch (error) {
    console.error('Error ensuring directories:', error);
  }
}

export async function saveTrace(trace: XRayTrace): Promise<void> {
  await ensureDirectories();
  const filePath = path.join(TRACES_DIR, `${trace.id}.json`);
  await fs.writeFile(filePath, JSON.stringify(trace, null, 2), 'utf-8');
}

export async function getTrace(id: string): Promise<XRayTrace | null> {
  try {
    const filePath = path.join(TRACES_DIR, `${id}.json`);
    const content = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(content) as XRayTrace;
  } catch (error) {
    console.error('Error reading trace file:', error);
    return null;
  }
}

export async function listTraces(): Promise<XRayTraceListItem[]> {
  await ensureDirectories();
  
  try {
    const files = await fs.readdir(TRACES_DIR);
    const jsonFiles = files.filter(f => f.endsWith('.json'));
    
    const traces: XRayTraceListItem[] = [];
    
    for (const file of jsonFiles) {
      try {
        const filePath = path.join(TRACES_DIR, file);
        const content = await fs.readFile(filePath, 'utf-8');
        const trace = JSON.parse(content) as XRayTrace;
        
        traces.push({
          id: trace.id,
          name: trace.name,
          status: trace.status,
          startTime: trace.startTime,
          duration: trace.duration,
          stepsCount: trace.steps.length,
        });
      } catch (error) {
        console.error(`Error reading trace file ${file}:`, error);
      }
    }
    
    // Sort by startTime descending (newest first)
    return traces.sort((a, b) => 
      new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
    );
  } catch (error) {
    console.error('Error listing traces:', error);
    return [];
  }
}

export async function deleteTrace(id: string): Promise<boolean> {
  try {
    const filePath = path.join(TRACES_DIR, `${id}.json`);
    await fs.unlink(filePath);
    return true;
  } catch (error) {
    return false;
  }
}

export async function clearAllTraces(): Promise<void> {
  try {
    const files = await fs.readdir(TRACES_DIR);
    for (const file of files) {
      if (file.endsWith('.json')) {
        await fs.unlink(path.join(TRACES_DIR, file));
      }
    }
  } catch (error) {
    console.error('Error clearing traces:', error);
  }
}
