import React, { useState } from 'react';
import { useSocketStore } from '../../store/useSocketStore';
import { useNavigate } from 'react-router-dom';

const Create = () => {
    const [name_, setName_] = useState("");
    const [room_, setRoom_] = useState("");
    const { socket } = useSocketStore();
    const navigate = useNavigate();

    const handleSend = () => {
        if (!name_ || !room_) {
            alert("Please enter both name and room.");
            return;
        }

        console.log("Sending:", name_, room_);
        socket.emit("join_room", { name: name_, room: room_ });

        socket.on('room_joined', (msg) => {
            console.log("Room joined:", msg);
            navigate(`/user/home?room=${room_}`);
        }
        );

        socket.on("new_user", (name) => {
            console.log("New user joined:", name);
        });
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
            <div style={{ display: 'flex', gap: '10px' }}>
                <input 
                    type="text" 
                    placeholder="Name" 
                    value={name_} 
                    onChange={(e) => setName_(e.target.value)} 
                />
                <input 
                    type="text" 
                    placeholder="Room" 
                    value={room_} 
                    onChange={(e) => setRoom_(e.target.value)} 
                />
                <button onClick={handleSend}>Send</button>
            </div>
        </div>
    );
};

export default Create;
