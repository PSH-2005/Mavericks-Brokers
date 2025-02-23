import React from 'react'
import { useState, useRef,useEffect} from 'react';
import axios from 'axios';
// type UseAudioHookReturn = [
//     boolean, // isRecording
//     React.Dispatch<React.SetStateAction<boolean>>, // setIsRecording
//     string, // transcript
//     React.Dispatch<React.SetStateAction<string>>, // setTranscript
//     () => Promise<void>, // startRecording
//     () => void // stopRecording
//   ];
const useAudioHook = ()=>{
    const [isRecording, setIsRecording] = useState(false);
    const [transcript, setTranscript] = useState('');
    const mediaRecorder = useRef(null);
    const audioChunks = useRef([]);
  
    const startRecording = async () => {
      console.log("Started")
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      mediaRecorder.current = recorder;
      audioChunks.current = [];
  
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunks.current.push(event.data);
      };
  
      recorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks.current, { type: 'audio/webm' });
        const formData = new FormData();
        formData.append('file', audioBlob, 'recording.webm');
        console.log("Hello there")
        try {
          const { data } = await axios.post(
            'https://fastapi-backend-z25y.onrender.com/transcribe/',
            formData,
            { headers: { 'Content-Type': 'multipart/form-data' } }
          );
          setTranscript(data.transcription);
          console.log(data.transcription)
        } catch (error) {
          console.log(error.message,"here")
          console.error('Error during transcription:', error);
        }
      };
  
      recorder.start();
      setIsRecording(true);
    };
  
    const stopRecording = () => {
      mediaRecorder.current?.stop();
      setIsRecording(false);
    };
  return [isRecording,setIsRecording,transcript,setTranscript,startRecording,stopRecording]
}

export default useAudioHook