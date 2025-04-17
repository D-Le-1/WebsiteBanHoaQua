import React, { useEffect, useState } from "react";
import mqtt from "mqtt";

const topic = "r2s";
const mqttConfig = {
  hostname: "devapi.uniscore.vn",
  port: 443,
  protocol: "wss",
  username: "football",
  password: "football123",
  path: "/mqtt"
};

const ChatPage =()=>{
    const[message, setMessage]=useState("")
    const[client, setClient]=useState(null)

    useEffect(()=>{
        const mqttUrl=`${mqttConfig.protocol}://${mqttConfig.hostname}:${mqttConfig.port}${mqttConfig.path}`
        const mqttClient = mqtt.connect(mqttUrl, {
            username: mqttConfig.username,
            password: mqttConfig.password
        })
        mqttClient.on("connect",()=>{
            console.log("Connected to MQTT broker");
            mqttClient.subscribe(topic, (err)=>{
                if(!err){
                    console.log(`Subscribed to topic: ${topic}`)
                } else{
                    console.error("Subscription error:", err);
                }
            })
        })
        mqttClient.on("message", (receivedTopic, payload) => {
            console.log(`Message received from ${receivedTopic}: ${payload.toString()}`);
            setMessage(payload.toString());
          });
        mqttClient.on("error", (err) => {
            console.error("MQTT Error:", err);
          });
      
          setClient(mqttClient);
      
          return () => {
            mqttClient.end();
          };
    }, [])

    const sendMessage = () => {
        if (client) {
          client.publish(topic, "Dsadasd");
        }
      };
    return(
        <div>
            <h2>MQTT with React</h2>
            <p>Received Message: {message}</p>
            <button onClick={sendMessage}>Send Message</button>
        </div>
    )
}

export default ChatPage