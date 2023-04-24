const socket = io("/")
const videoGrid = document.getElementById("vidio-grid")
const myPeer =  new Peer(undefined,{
    host:"/",
    port:4001
})


const myVideo = document.createElement("video")
myVideo.muted = true

navigator.mediaDevices.getUserMedia({
    video:true,
    audio:true
}).then(stream=>{
    addVideoStream(myVideo,stream)
    myPeer.on('call',call=>{
        call.answer(stream)
        const userVideo = document.createElement('video')
        call.on("stream",userStream=>addVideoStream(userVideo,userStream))
    })    
    socket.on("user-connected",(user_id)=>{
        connectToNewUser(user_id,stream)
    })
})
myPeer.on("open",id=>{
    socket.emit("join-room",ROOM_ID,id)
})




function addVideoStream(video,stream){
    video.srcObject = stream
    video.addEventListener("loadedmetadata",()=>{
        video.play()
    })
    videoGrid.append(video)
}

function connectToNewUser(userId,stream){
    const call = myPeer.call(userId,stream)
    const userVideo = document.createElement("video")
    call.on("stream",userVideoStream=>{
        addVideoStream(userVideo,userVideoStream) 
    })
    call.on("close",()=>{
        userVideo.remove()
    })
}