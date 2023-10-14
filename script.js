const apiKey = "";

const maxImages = 4; // NUMBER OF IMAGS TO GENERATE FOR EACH PROMPT 
let selectedImageNumber = null;

// FUNCTION TO GENERATE A RANDOM NUMBER BETWEEN MIN AND MAX(INCLUSIVE)
function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// FUNCTION TO DISABLE THE GENERATE BUTTON DURING PROCESSING
function disableGenerateButton() {
    document.getElementById("generate").disabled = true;
}

// FUNCTION TO ENABLE THE GENERATE BUTTON AFTER POROCESS
function enableGenerateButton() {
    document.getElementById("generate").disabled = false;
}

// FUNCTION TO CLEAR IMAGE GRID
function clearImageGrid() {
    const imageGrid = document.getElementById("image-grid");
    imageGrid.innerHTML = "";
}

// FUNCTION TO GENERATE IMAGES
async function generateImages(input) {
    disableGenerateButton();
    clearImageGrid();

    const loading = document.getElementById("loading");
    loading.style.display = "block";

    const imageUrls = [];

    for (let i = 0; i < maxImages; i++) {
        // GENERATE A RANDOM NUMBER BETWEEN 1 AND 10000 AND APPEND IT TO THE PROMPT
        const randomNumber = getRandomNumber(1, 10000);
        const prompt = `${input} ${randomNumber}`;
        // WE ADDED RANDOM NUMBER TO PROMPR TO CREATE DIFFERENT RESULTS
        const response = await fetch(
            "https://api-inference.huggingface.co/models/prompthero/openjourney",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${apiKey}`,
                },
                body: JSON.stringify({ inputs: prompt }),
            }
        );

        if (!response.ok) {
            alert("Failed to generate image!");
        }

        const blob = await response.blob();
        const imgUrl = URL.createObjectURL(blob);
        imageUrls.push(imgUrl);

        const img = document.createElement("img");
        img.src = imgUrl;
        img.alt = `art-${i + 1}`;
        img.onclick = () => downloadImage(imgUrl, i);
        document.getElementById("image-grid").appendChild(img);
    }

    loading.style.display = "none";
    enableGenerateButton();

    selectedImageNumber = null; // RESET SELECTED IMAGE NUMBER
}

document.getElementById("generate").addEventListener('click', () => {
    const input = document.getElementById("user-prompt").value;
    generateImages(input);
});

function downloadImage(imgUrl, imageNumber) {
    const link = document.createElement("a");
    link.href = imgUrl;
    // SET FILENAME BASED ON THE SELECTED IMAGE
    link.download = `image-${imageNumber + 1}.jpg`;
    link.click();
}