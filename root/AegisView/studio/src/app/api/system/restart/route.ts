
import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs/promises';

const execAsync = promisify(exec);

export async function POST(request: Request) {
    try {
        const { service } = await request.json();

        if (service === 'go2rtc') {
            await execAsync('sudo systemctl restart go2rtc.service');
            return NextResponse.json({ message: 'go2rtc service is restarting.' });
        }
        
        if (service === 'webapp') {
            // This is a common way to trigger a restart with process managers like PM2 or nodemon.
            // In a production environment, a more robust method might be needed.
            await fs.utimes('package.json', new Date(), new Date());
            return NextResponse.json({ message: 'Web app is restarting. The page will reload shortly.' });
        }

        return NextResponse.json({ error: 'Invalid service specified' }, { status: 400 });

    } catch (error: any) {
        console.error(`Failed to restart service:`, error);
        return NextResponse.json({ error: error.message || `Failed to restart service.` }, { status: 500 });
    }
}
