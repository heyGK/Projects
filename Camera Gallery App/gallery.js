setTimeout(() => {
    if (db) {
        // video retrieval
        let videoDBTransaction = db.transaction("video", "readonly");
        let videoStore = videoDBTransaction.objectStore("video");
        let videoRequest = videoStore.getAll();
        videoRequest.onsuccess = (e) => {
            let videoResult = videoRequest.result;
            let galleryCont = document.querySelector(".gallery-cont");
            videoResult.forEach((videoObj) => {
                let mediaEle = document.createElement("div");
                mediaEle.setAttribute("class", "media-cont");
                mediaEle.setAttribute("id", videoObj.id);

                let url =  URL.createObjectURL(videoObj.blobData);

                mediaEle.innerHTML = `
                <div class="media">
                <video autoplay src="${url}"></video>
                    </div>
                <div class="delete action-btn">DELETE</div>
                <div class="download action-btn">DOWNLOAD</div>
                `;

                galleryCont.appendChild(mediaEle);

                let deleteBtn = mediaEle.querySelector(".delete");
                deleteBtn.addEventListener("click", deleteListener);
                let downloadBtn = mediaEle.querySelector(".download");
                downloadBtn.addEventListener("click", downloadListener);
            })
        }

        // image retrieval
        let imageDBTransaction = db.transaction("image", "readonly");
        let imageStore = imageDBTransaction.objectStore("image");
        let imageRequest = imageStore.getAll();
        imageRequest.onsuccess = (e) => {
            let imageResult = imageRequest.result;
            let galleryCont = document.querySelector(".gallery-cont");
            imageResult.forEach((imageObj) => {
                let mediaEle = document.createElement("div");
                mediaEle.setAttribute("class", "media-cont");
                mediaEle.setAttribute("id", imageObj.id);

                let url =  imageObj.url;

                mediaEle.innerHTML = `
                <div class="media">
                <img autoplay src="${url}" />
                    </div>
                <div class="delete action-btn">DELETE</div>
                <div class="download action-btn">DOWNLOAD</div>
                `;

                galleryCont.appendChild(mediaEle);

                let deleteBtn = mediaEle.querySelector(".delete");
                deleteBtn.addEventListener("click", deleteListener);
                let downloadBtn = mediaEle.querySelector(".download");
                downloadBtn.addEventListener("click", downloadListener);
            })
        }
    }
}, 100)

// UI remove, DB remove
function deleteListener(e) {
    // DB removal
    let id = e.target.parentElement.getAttribute("id");
    if (id.slice(0, 3) === "vid") {
        let videoDBTransaction = db.transaction("video", "readwrite");
        let videoStore = videoDBTransaction.objectStore("video");
        videoStore.delete(id);
    }
    else if (id.slice(0, 3) === "img") {
        let imageDBTransaction = db.transaction("image", "readwrite");
        let imageStore = imageDBTransaction.objectStore("image");
        imageStore.delete(id);
    }

    // UI removal
    e.target.parentElement.remove();
}

function downloadListener() {
    let id = e.target.parentElement.getAttribute("id");
    let type = id.slice(0, 3);

    if (type === "vid") {
        let videoDBTransaction = db.transaction("video", "readwrite");
        let videoStore = videoDBTransaction.objectStore("video");
        let videoRequest = videoStore.get(id);
        videoRequest.onsuccess = (e) => {
            let videoResult = videoRequest.result;

            let videoURL = URL.createObjectURL(videoResult.blobData);

            let a = document.createElement("a");
            a.href = videoURL;
            a.download = "stream.mp4";
            a.click();
        }
    }
    else if (type === "img") {
        let imageDBTransaction = db.transaction("image", "readwrite");
        let imageStore = imageDBTransaction.objectStore("image");
        let imageRequest = imageStore.get(id);
        imageRequest.onsuccess = (e) => {
            let imageResult = imageRequest.result;

            let a = document.createElement("a");
            a.href = imageResult.url;
            a.download = "image.jpg";
            a.click();
        }
    }
}