
'use client'
import Head from 'next/head'
// import styles from '../styles/Home.module.css'
import {useEffect, useState} from "react";

import axios from "axios"
// import apis from "../apis/auth"
import QRCode from "react-qr-code";
import {useCookies} from "react-cookie";
import Router from 'next/router';

import Pusher from "pusher-js"


const initPusher = () => {
    Pusher.logToConsole = false;
    return new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
       // Specify the Pusher cluster (in this case, Asia Pacific 2)
       cluster: 'mt1',
       // Configure channel authorization
        // channelAuthorization: {
        //     // Specify an endpoint for authorizing private/presence channels
        //     endpoint: 
        // },
    })
}

const Login = () => {

    const [qr_data, setQrData] = useState(null)
    const [isLoading, setLoading] = useState(false)

    const getQRCode = async () => {
        try {
            let res = await axios.get('api/generate-qr');
            setQrData(res.data.data)
            console.log(res.data.data,'');
            
            return res.data.data
        } catch (e) {
            alert("Cannot fetch QR Data")
        }
        return null
    }

    const handleLogin = async (data: any)=>{
        const token = data.token
        const user_id = data.user_id
        try {
            let res = await axios.post('/api/verify-token', { token, user_id });
            await Router.replace('/profile')
            return res.data.data
        } catch (e) {
            console.error(e)
        }
        return null;
    }

    const showQrCode = ()=>{
        let pusher = initPusher();
        getQRCode().then((res) => {
            setLoading(false)
            if(res){
                const channel = pusher.subscribe('private-' + res.channel);
                console.log("CHANNEL=", res.channel)
                channel.bind('login-event', function (data:any) {
                    handleLogin(data)
                });
            }
        })
    }

    useEffect(() => {
        setLoading(true)
        showQrCode();
        setInterval(() => {
            showQrCode()
        }, 80000);
    }, [])
    if (isLoading) return <div>
        <h2>Loading...</h2>
    </div>

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
    <main className="flex flex-col items-center justify-center p-8 bg-white shadow-md rounded-md">
      <h1 className="text-2xl font-bold text-gray-800">Please Scan Login Authenticate</h1>
      <div className="mt-12 p-4 bg-white rounded-lg shadow-md">
        {qr_data ? (
          <QRCode value={qr_data.channel} size={320} />
        ) : (
          <p className="text-gray-500">Loading QR Code...</p>
        )}
      </div>
    </main>
  </div>
  

  )
}

export default Login
