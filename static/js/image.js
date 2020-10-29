"use strict";

let imageRequestIsActive = false;

let dayButton = null;
let middleButton = null;
let nightButton = null;
let shutterTimeField = null;
let isoField = null;
let expoField = null;
let refreshButton = null;


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

// TODO: Избавиться от постоянных запросов объектов

function onDaySettings(){
    shutterTimeField.value = 400;
    isoField.value = 200;
    expoField.value = 0;
}

function onMiddleSettings(){
    shutterTimeField.value = 1000;
    isoField.value = 500;
    expoField.value = 0;
}

function onNightSettings(){
    shutterTimeField.value = 1700;
    isoField.value = 800;
    expoField.value = 0;
}

function enableAll(){
    refreshButton.disabled = false;
    dayButton.disabled = false;
    middleButton.disabled = false;
    nightButton.disabled = false;
    shutterTimeField.disabled = false;
    isoField.disabled = false;
    expoField.disabled = false;
}

function disableAll(){
    refreshButton.disabled = true;
    dayButton.disabled = true;
    middleButton.disabled = true;
    nightButton.disabled = true;
    shutterTimeField.disabled = true;
    isoField.disabled = true;
    expoField.disabled = true;
}

async function reloadImage(){
    if(imageRequestIsActive){
        return;
    }

    imageRequestIsActive = true;

    let loadingText = document.querySelector("#status");
    let imagesContainer = document.querySelector("#images_container");

    // Remove all previous images
    while (imagesContainer.lastElementChild) {
        imagesContainer.removeChild(imagesContainer.lastElementChild);
    }

    disableAll();

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

    enableAll();

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
    refreshButton = document.querySelector("#refresh_button");
    dayButton = document.querySelector("#day_button");
    middleButton = document.querySelector("#middle_button");
    nightButton = document.querySelector("#night_button");
    shutterTimeField = document.querySelector("#shutter_time");
    isoField = document.querySelector("#iso");
    expoField = document.querySelector("#exposition_correction");

    reloadImage();
}

window.onload = main;