
import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import yaml from 'js-yaml';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

const GO2RTC_CONFIG_PATH = '/root/AegisView/studio/go2rtc.yaml';

interface Go2RtcConfig {
    streams: {
        [key: string]: string | { url: string };
    };
    api?: {
        listen: string;
    }
}

async function readGo2RtcConfig(): Promise<Go2RtcConfig> {
    try {
        const file = await fs.readFile(GO2RTC_CONFIG_PATH, 'utf-8');
        return yaml.load(file) as Go2RtcConfig || { streams: {} };
    } catch (error: any) {
        if (error.code === 'ENOENT') {
            return { streams: {} }; // File doesn't exist, return empty config
        }
        throw error;
    }
}

async function writeGo2RtcConfig(config: Go2RtcConfig) {
    const yamlString = yaml.dump(config, { indent: 2 });
    await fs.writeFile(GO2RTC_CONFIG_PATH, yamlString, 'utf-8');
}

async function restartGo2Rtc() {
    try {
        await execAsync('sudo systemctl restart go2rtc.service');
    } catch (error) {
        console.error('Failed to restart go2rtc service:', error);
        throw new Error('Could not restart go2rtc service.');
    }
}

export async function POST(request: Request) {
    try {
        const { id, name, rtspUrl } = await request.json();

        if (!id || !name || !rtspUrl) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const config = await readGo2RtcConfig();
        
        // Use a simple sanitized name for the stream key
        const streamKey = id.replace(/[^a-zA-Z0-9]/g, '');

        config.streams[streamKey] = rtspUrl;

        await writeGo2RtcConfig(config);
        await restartGo2Rtc();

        return NextResponse.json({ message: 'Camera added and go2rtc configured successfully.' });

    } catch (error: any) {
        console.error(error);
        return NextResponse.json({ error: error.message || 'An internal server error occurred.' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
     try {
        const { id } = await request.json();

        if (!id) {
            return NextResponse.json({ error: 'Missing camera ID' }, { status: 400 });
        }

        const config = await readGo2RtcConfig();
        
        const streamKey = id.replace(/[^a-zA-Z0-9]/g, '');

        if (config.streams && config.streams[streamKey]) {
            delete config.streams[streamKey];
            await writeGo2RtcConfig(config);
            await restartGo2Rtc();
        }

        return NextResponse.json({ message: 'Camera removed and go2rtc reconfigured.' });

    } catch (error: any) {
        console.error(error);
        return NextResponse.json({ error: error.message || 'An internal server error occurred.' }, { status: 500 });
    }
}
