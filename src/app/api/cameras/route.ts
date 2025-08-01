
import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

const GO2RTC_CONFIG_PATH = '/root/AegisView/studio/go2rtc.yaml';

async function getGo2RtcConfig() {
    try {
        await fs.access(GO2RTC_CONFIG_PATH);
        return await fs.readFile(GO2RTC_CONFIG_PATH, 'utf-8');
    } catch (error) {
        // If file doesn't exist, create it with a default structure
        const defaultConfig = `streams:\n\napi:\n  listen: ":1984"\n`;
        await fs.writeFile(GO2RTC_CONFIG_PATH, defaultConfig, 'utf-8');
        return defaultConfig;
    }
}

async function writeGo2RtcConfig(content: string) {
    await fs.writeFile(GO2RTC_CONFIG_PATH, content, 'utf-8');
}

async function restartGo2Rtc() {
    try {
        await execAsync('sudo systemctl restart go2rtc.service');
    } catch (error) {
        console.error('Failed to restart go2rtc service:', error);
        throw new Error('Could not restart go2rtc service. Check server logs and sudoers configuration.');
    }
}

export async function POST(request: Request) {
    try {
        const { id, rtspUrl } = await request.json();

        if (!id || !rtspUrl) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }
        
        const streamKey = id.replace(/[^a-zA-Z0-9]/g, '');

        let configContent = await getGo2RtcConfig();
        
        const streamLine = `  ${streamKey}: ${rtspUrl}\n`;

        // Check if streams section exists
        if (!configContent.includes('streams:')) {
            configContent = 'streams:\n' + configContent;
        }

        // Add the new stream line
        const lines = configContent.split('\n');
        const streamsIndex = lines.findIndex(line => line.trim().startsWith('streams:'));
        
        // Check if stream already exists to avoid duplicates
        const streamExists = lines.some(line => line.trim().startsWith(`${streamKey}:`));

        if (!streamExists) {
          lines.splice(streamsIndex + 1, 0, streamLine);
          configContent = lines.join('\n');
          await writeGo2RtcConfig(configContent);
        }

        await restartGo2Rtc();

        return NextResponse.json({ message: 'Camera added and go2rtc configured successfully.' });

    } catch (error: any) {
        console.error('API POST Error:', error);
        return NextResponse.json({ error: error.message || 'An internal server error occurred.' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
     try {
        const { id } = await request.json();

        if (!id) {
            return NextResponse.json({ error: 'Missing camera ID' }, { status: 400 });
        }

        const streamKey = id.replace(/[^a-zA-Z0-9]/g, '');
        let configContent = await getGo2RtcConfig();
        
        const lines = configContent.split('\n');
        const updatedLines = lines.filter(line => !line.trim().startsWith(`${streamKey}:`));
        
        if (lines.length !== updatedLines.length) {
          configContent = updatedLines.join('\n');
          await writeGo2RtcConfig(configContent);
          await restartGo2Rtc();
        }

        return NextResponse.json({ message: 'Camera removed and go2rtc reconfigured.' });

    } catch (error: any) {
        console.error('API DELETE Error:', error);
        return NextResponse.json({ error: error.message || 'An internal server error occurred.' }, { status: 500 });
    }
}
