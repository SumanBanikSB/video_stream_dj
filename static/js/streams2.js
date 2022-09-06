const APP_ID = '408720f9bece448c98d216d8418baa4e';
const CHANNEL = "main";
const TOKEN = "006f00034e2a51840459458286e4559da26IAAoPcAEJlX33g5uePrzFcXA3QZwA1lazJk1yA090ga0YmTNKL8AAAAAEAAtDEjTW5PeYgEAAQBak95i";
let uid
const client = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' })

let localTracks = [] // list of all the audio/video tracks.
let remoteUsers = {} // objects of all the user joining the stream.

console.log("The stream is published!!!")

let joinAndDisplayLocalSteam = async () => {

    client.on("user-published", handleUserJoined);
    client.on("user-left", handleUserLeft);



    uid = await client.join(APP_ID, CHANNEL, TOKEN, null)
    localTracks = await AgoraRTC.createMicrophoneAndCameraTracks() // stores the camera and video track

    // creating a user/player.

    localTracks[1].play(`user-${uid}`) // plays the video for a specific user 

    await client.publish([localTracks[0], localTracks[1]]); // publish the localTracks, so other users can see the video.

}


let handleUserJoined = async (user, mediaType) => {
    remoteUsers[user.id] = user
    await client.subscribe(user, mediaType) // subscribing to the stream.
    if (mediaType === 'video') {
        let player = document.getElementById(`.user-container-${user.uid}`)
        if (player != null) {
            player.remove();
        }

        player = `<div class="video-container" id="user-container-${user.uid}">
        <div class="video-player" id="user-${user.uid}"></div> 
        <div class="username-wrapper"><span class="user-name">Paul</span></div>
    </div>  `

        document.getElementById("video-streams").insertAdjacentHTML("beforeend", player)
        user.videoTrack.play(`user-${user.uid}`)
    }

    if (mediaType == "audio") {
        user.audioTrack.play();
    }
}

let handleUserLeft = async (user) => {
    delete remoteUsers[user.uid];
    document.getElementById(`user-container-${user.uid}`).remove();
}

let leaveAndRemoveLocalStream = async () => {
    for(let i = 0; localTracks.length > i; i++) {
        localTracks[i].stop();
        localTracks[i].close()
    } 

    await client.leave();
    window.open('/lobby','_self');
}

let toggleCamera = async (e) => {
    console.log('TOGGLE CAMERA TRIGGERED')
    if(localTracks[1].muted){
        await localTracks[1].setMuted(false)
        e.target.style.backgroundColor = '#fff'
    }else{
        await localTracks[1].setMuted(true)
        e.target.style.backgroundColor = 'rgb(255, 80, 80, 1)'
    }
}
let toggleMic = async (e) => {
    console.log('TOGGLE MIC TRIGGERED')
    if(localTracks[0].muted){
        await localTracks[0].setMuted(false)
        e.target.style.backgroundColor = '#fff'
    }else{
        await localTracks[0].setMuted(true)
        e.target.style.backgroundColor = 'rgb(255, 80, 80, 1)'
    }
}

document.getElementById('leave-btn').addEventListener("click",leaveAndRemoveLocalStream);
document.getElementById('camera-btn').addEventListener("click",toggleCamera);
document.getElementById('mic-btn').addEventListener("click",toggleMic);

joinAndDisplayLocalSteam()
