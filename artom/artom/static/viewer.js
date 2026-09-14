import * as THREE from "three";

const modelInfo = document.getElementById("modelInfo");
const modelList = document.getElementById("modelList");
const apiStatus = document.getElementById("apiStatus");

const viewerContainer = document.getElementById("viewerContainer");
const canvas = document.getElementById("threeCanvas");

let isDragging = false;

let previousMouse = {
    x: 0,
    y: 0
};


const scene = new THREE.Scene();
scene.background = new THREE.Color(0x111827);

const camera = new THREE.PerspectiveCamera(
    45,
    viewerContainer.clientWidth / viewerContainer.clientHeight,
    0.1,
    1000
);
camera.position.set(5, 5, 8);

camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
});

renderer.setSize(
    viewerContainer.clientWidth,
    viewerContainer.clientHeight
);

const ambientLight = new THREE.AmbientLight(
    0xffffff,
    1.5
);

scene.add(ambientLight);


const directionalLight = new THREE.DirectionalLight(
    0xffffff,
    2
);

directionalLight.position.set(
    5,
    10,
    5
);

scene.add(directionalLight);

const grid = new THREE.GridHelper(
    20,
    20
);

scene.add(grid);


let currentMesh = null;

async function loadModels(){
    try{
        const response = await fetch('/api/models');
        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }
        const data = await  response.json();

        renderModelList(data.models);
    } catch (error){
        modelList.innerHTML = `
            <p>모델 데이터를 불러오지 못했습니다.</p>
        `;
    }
}

function renderModelList(models){
    modelList.innerHTML = "";

    models.forEach((model) => {

        const item = document.createElement("div");

        item.className = "model-item";

        item.innerHTML = `
            <strong>${model.name}</strong>

            <div class="model-id-row">

                <span>
                    ID: ${model.id}
                </span>

                <button
                    type="button"
                    class="render-button"
                >
                    Render
                </button>
                <button
                type="button"
                class="delete-button"
                >
                Delete
            </button>
            </div>

            <div>
                Width: ${model.width}
            </div>

            <div>
                Height: ${model.height}
            </div>

            <div>
                Depth: ${model.depth}
            </div>

            <div>
                Position:
                (${model.position.x},
                ${model.position.y},
                ${model.position.z})
            </div>

        `;
        //버튼
        const renderButton =
            item.querySelector(
                ".render-button"
            );

        const deleteButton =
            item.querySelector(
                ".delete-button"
            );

        renderButton.addEventListener(
            "click",
            () => {

                renderSelectedModel(
                    model
                );

            }
        );

        deleteButton.addEventListener(
        "click",
        async () => {

            const result =
                confirm(
                    `${model.name} 모델을 삭제하시겠습니까?`
                );

            if (!result) {
                return;
            }

        await deleteModel(
            model.id
        );
    }
);


        modelList.appendChild(item);
    });
}

async function deleteModel(modelId) {

    try {

        const response = await fetch(
            `/api/models/${modelId}/delete/`,
            {
                method: "POST",

                headers: {
                    "X-CSRFToken": getCsrfToken()
                }
            }
        );


        if (!response.ok) {

            throw new Error(
                `HTTP error: ${response.status}`
            );

        }


        const data =
            await response.json();


        if (data.success) {

            console.log(
                "삭제 완료:",
                data.id
            );


            // 현재 렌더링 중인 모델이면 화면에서도 제거
            if (
                currentMesh &&
                currentMesh.userData.id === modelId
            ) {

                scene.remove(
                    currentMesh
                );

                currentMesh.geometry.dispose();
                currentMesh.material.dispose();

                currentMesh = null;

                modelInfo.innerHTML =
                    "Click a model to see its DB values.";
            }


            // 모델 목록 다시 불러오기
            loadModels();

        }

    } catch (error) {

        console.error(
            "삭제 실패:",
            error
        );

        alert(
            "삭제에 실패했습니다."
        );
    }
}

function getCsrfToken() {

    const name =
        "csrftoken=";

    const decodedCookie =
        decodeURIComponent(
            document.cookie
        );

    const cookies =
        decodedCookie.split(";");


    for (let cookie of cookies) {

        cookie =
            cookie.trim();

        if (
            cookie.indexOf(name) === 0
        ) {

            return cookie.substring(
                name.length
            );
        }
    }


    return "";
}

//모델 렌더링

function renderSelectedModel(model) {

    // 기존 모델이 있으면 제거
    if (currentMesh) {

        scene.remove(
            currentMesh
        );

        currentMesh.geometry.dispose();

        currentMesh.material.dispose();

        currentMesh = null;
    }
    //모델 생성
    const geometry = new THREE.BoxGeometry(
        model.width,
        model.height,
        model.depth
    );
    const material = new THREE.MeshStandardMaterial({
        roughness: 0.5,
        metalness: 0.1
    });
    const mesh = new THREE.Mesh(
        geometry,
        material
    );
    mesh.userData.id = model.id;

    mesh.position.set(
        model.position.x,
        model.position.y,
        model.position.z
    )

    scene.add(
        mesh
    )
    currentMesh = mesh;

        // 카메라가 모델을 바라보도록 설정
    camera.lookAt(
        mesh.position
    );

    // Selected Model 정보 갱신
    modelInfo.innerHTML = `

        <strong>
            ${model.name}
        </strong>

        <br>

        ID:
        ${model.id}

        <br>

        Width:
        ${model.width}

        <br>

        Height:
        ${model.height}

        <br>

        Depth:
        ${model.depth}

        <br>

        Position:
        (${model.position.x},
        ${model.position.y},
        ${model.position.z})

        <br>

    `;

}

///랜더링
function animate() {

    requestAnimationFrame(
        animate
    );

    renderer.render(
        scene,
        camera
    );
}

animate();
window.addEventListener(
    "resize",
    () => {

        const width =
            viewerContainer.clientWidth;

        const height =
            viewerContainer.clientHeight;


        camera.aspect =
            width / height;

        camera.updateProjectionMatrix();


        renderer.setSize(
            width,
            height
        );
    }
);
//마우스 휠
canvas.addEventListener(
    "wheel",
    (event) =>{
                event.preventDefault();

                const zoomSpeed = 0.8;
                const target = currentMesh.position;
                const direction = new THREE.Vector3();

                camera.getWorldDirection(direction);

                const distance = camera.position.distanceTo(target);

                // 모델을 뚫지 않도록 최소 거리 설정
                const minDistance = 4;

                if (event.deltaY < 0) {
                    // Zoom in
                    if(distance > minDistance){
                        camera.position.addScaledVector(direction, zoomSpeed);
                    }
                } else {
                    // Zoom out
                    camera.position.addScaledVector(direction, -zoomSpeed);
                }

    },
);

//회전, 이동
//마우스 누름
canvas.addEventListener("mousedown", (event)=>{
    if(!currentMesh){
        return;
    }
    isDragging = true;
    previousMouse.x = event.clientX;
    previousMouse.y = event.clientY;
})
//땜
canvas.addEventListener("mouseup", () => {
    isDragging = false;
});
canvas.addEventListener("mouseleave", () => {
    isDragging = false;
});
//마우스 이동
canvas.addEventListener("mousemove", (event) => {
    if (!isDragging || !currentMesh) {
        return;
    }
    const dx =
        event.clientX - previousMouse.x;
    const dy =
        event.clientY - previousMouse.y;

    // Ctrl + Drag = 회전
    if (event.ctrlKey) {
        currentMesh.rotation.y +=
            dx * 0.01;
        currentMesh.rotation.x +=
            dy * 0.01;

    }
    // 그냥 Drag = 이동
    else {
        currentMesh.position.x +=
            dx * 0.01;
        currentMesh.position.y -=
            dy * 0.01;
    }
    previousMouse.x =
        event.clientX;
    previousMouse.y =
        event.clientY;
});
loadModels();
