import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';


const SECRET_KEY = process.env.JWT_SECRET_KEY
const mockUserDatabase = {
    'user_123': { id: 'user_123', name: 'John Doe', email: 'john.doe@example.com' },
  };

export async function POST(request: Request) {

    try {
        // Parse the request body
        const { token, user_id } = await request.json();
    
        if (!token || !user_id) {
          return NextResponse.json(
            { success: false, msg: 'Token and user_id are required' },
            { status: 400 }
          );
        }
    
        // Verify the token
        let decoded;
        try {
          decoded = jwt.verify(token, SECRET_KEY!);
        } catch (err) {
          return NextResponse.json(
            { success: false, msg: 'Invalid token' },
            { status: 401 }
          );
        }
    
        // Validate user existence
        const user = mockUserDatabase[user_id ];
        if (!user) {
          return NextResponse.json(
            { success: false, msg: 'User not found' },
            { status: 404 }
          );
        }
    
        // Cross-check user_id with decoded token
        if (decoded.user_id !== user_id) {
          return NextResponse.json(
            { success: false, msg: 'Token does not match user' },
            { status: 403 }
          );
        }
    
        // Respond with success
        return NextResponse.json(
          { success: true, msg: 'Token verified successfully', data: user },
          { status: 200 }
        );
      } catch (error) {
        return NextResponse.json(
          { success: false, msg: 'Error verifying token', error, 'Unknown error' },
          { status: 500 }
        );
      }


}