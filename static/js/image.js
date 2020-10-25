"use strict";

let imageRequestIsActive = false;

// <img id="image" class="image"></img>
function blobToImage(blob) {
    return new Promise((resolve) => {
        const url = URL.createObjectURL(blob);
        
        let img = new Image();
        
        img.onload = () => {
            URL.revokeObjectURL(url)
            resolve(img)
        };
        
        img.className = "image";
        img.src = url;
    });
}

function enableAll(){

}

function disableAll(){

}

async function reloadImage(){
    if(imageRequestIsActive){
        return;
    }

    imageRequestIsActive = true;

    let loadingText = document.querySelector("#status");
    let refreshButton = document.querySelector("#refresh_button");

    let shutterTimeField = document.querySelector("#shutter_time");
    let isoField = document.querySelector("#iso");
    let expoField = document.querySelector("#exposition_correction");

    let imagesContainer = document.querySelector("#images_container");

    // Remove all previous images
    while (imagesContainer.lastElementChild) {
        imagesContainer.removeChild(imagesContainer.lastElementChild);
    }

    refreshButton.disabled = true;
    shutterTimeField.disabled = true;
    isoField.disabled = true;
    expoField.disabled = true;

    loadingText.innerHTML = "Loading";

    // https://learn.javascript.ru/fetch
    const path = "/image_from_camera?shutter_time="+ shutterTimeField.value + 
                "&iso=" + isoField.value + 
                "&exposition_correction=" + expoField.value;
    let response = await fetch(path);
    if (response.ok) {
        let data = await response.blob();

        const image = await blobToImage(data);
        imagesContainer.appendChild(image);
        imagesContainer.appendChild(document.createElement("br"));
    } else {
        loadingText.innerHTML = "Loading failed";
    }

    refreshButton.disabled = false;

    imageRequestIsActive = false;
}

async function reloadImageClick(){
    console.log("Reload image clicked");
    reloadImage();
}

async function postRequest(addr, data){
    // https://developer.mozilla.org/ru/docs/Web/API/Fetch_API/Using_Fetch
    await fetch(addr, {
        method: "POST",
        cache: "no-cache",
        mode: "cors",
        credentials: "same-origin",
        redirect: "follow",
        referrerPolicy: "no-referrer", 
        headers: {
            "Content-Type": "application/json"
            //"Content-Type": "application/x-www-form-urlencoded",
        },
        body: JSON.stringify(data)
    });
}

async function lightOn(){
    console.log("Light on clicked");
    await postRequest("/light", {
        status: true
    });
}

async function lightOff(){
    console.log("Light off clicked");
    await postRequest("/light", {
        status: false
    });
}

function main(){
    reloadImage();
}

window.onload = main;