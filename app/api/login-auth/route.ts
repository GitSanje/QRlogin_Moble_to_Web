import { NextRequest, NextResponse } from 'next/server';
import Pusher from 'pusher';

const pusher = new Pusher({
    appId: process.env.PUSHER_APP_ID!,
    key: process.env.NEXT_PUBLIC_PUSHER_KEY!,
    secret: process.env.PUSHER_SECRET!,
    cluster: 'mt1',
    useTLS: true,
});

export async function POST(req: NextRequest) {
    const { channel, token, user_id } = await req.json();
    try {
        const resp = await pusher.trigger(channel, "login-event", { token, user_id });
        return NextResponse.json({ success: true, msg: "", data: resp });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ success: false, msg: "Failed to trigger event" });
    }
}
