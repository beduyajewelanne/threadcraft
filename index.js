document.addEventListener("DOMContentLoaded", () => {
    const catalogView = document.getElementById("product-catalog");
    const customizationStudio = document.getElementById("customization-studio");
    const selectButtons = document.querySelectorAll(".select-product-btn");
    const backButton = document.getElementById("back-to-catalog");
    const garmentBase = document.getElementById("garment-base");
    
    let garmentPattern = document.getElementById("garment-pattern");
    if (!garmentPattern) {
        garmentPattern = document.createElementNS("http://www.w3.org/2000/svg", "image");
        garmentPattern.id = "garment-pattern";
        garmentPattern.setAttribute("x", "0");
        garmentPattern.setAttribute("y", "0");
        garmentPattern.setAttribute("width", "400");
        garmentPattern.setAttribute("height", "500");
        garmentPattern.setAttribute("preserveAspectRatio", "xMidYMid meet");
        garmentPattern.style.display = "none";
        
        const designLayer = document.getElementById("design-layer");
        if (designLayer) designLayer.insertBefore(garmentPattern, designLayer.firstChild);
    }
    
    const currentPriceElem = document.getElementById("current-price");
    const basePriceElem = document.getElementById("base-price");
    const sizePriceElem = document.getElementById("size-price");
    const colorPriceElem = document.getElementById("color-price");
    const textPriceElem = document.getElementById("text-price");
    const graphicPriceElem = document.getElementById("graphic-price");
    const totalPriceElem = document.getElementById("total-price");
    
    const summaryApparel = document.getElementById("summary-apparel");
    const summarySize = document.getElementById("summary-size");
    const summaryColor = document.getElementById("summary-color");
    const summaryText = document.getElementById("summary-text");
    const summaryGraphic = document.getElementById("summary-graphic");
    const summaryPrice = document.getElementById("summary-price");

    const rotateBtn = document.getElementById("rotate-btn");
    const sizeButtons = document.querySelectorAll(".size-card-btn");
    const colorButtons = document.querySelectorAll(".color-option");
    const customTextInput = document.getElementById("custom-text");
    const textPositionSelect = document.getElementById("text-position");
    const customTextPreview = document.getElementById("custom-text-preview");
    const graphicButtons = document.querySelectorAll(".graphic-option");
    const removeGraphicBtn = document.getElementById("remove-graphic");
    const graphicPreview = document.getElementById("graphic-preview");
    const drawingPreview = document.getElementById("drawing-preview");

    const drawingCanvas = document.getElementById("drawing-canvas");
    const drawingCtx = drawingCanvas ? drawingCanvas.getContext("2d") : null;
    const brushSizeInput = document.getElementById("brush-size");
    const clearDrawingBtn = document.getElementById("clear-drawing");
    const undoDrawingBtn = document.getElementById("undo-drawing");

    const saveDesignBtn = document.getElementById("save-design");
    const loadDesignBtn = document.getElementById("load-design");
    const resetDesignBtn = document.getElementById("reset-design");

    let drawingHistory = [];
    let isDrawing = false;

    const saveDrawingState = () => {
        if (!drawingCanvas || !drawingCtx) return;
        if (drawingHistory.length > 20) drawingHistory.shift();
        drawingHistory.push(drawingCtx.getImageData(0, 0, drawingCanvas.width, drawingCanvas.height));
    };

    const syncDrawingToGarment = () => {
        if (!drawingCanvas || !drawingPreview) return;
        const dataURL = drawingCanvas.toDataURL("image/png");
        drawingPreview.setAttributeNS("http://www.w3.org/1999/xlink", "href", dataURL);
        drawingPreview.setAttribute("href", dataURL);
    };

    if (drawingCanvas && drawingCtx) {
        drawingCanvas.width = drawingCanvas.offsetWidth || 350;
        drawingCanvas.height = 180;

        drawingCtx.lineCap = "round";
        drawingCtx.lineJoin = "round";
        saveDrawingState();

        const getPos = (e) => {
            const rect = drawingCanvas.getBoundingClientRect();
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const clientY = e.touches ? e.touches[0].clientY : e.clientY;
            return {
                x: clientX - rect.left,
                y: clientY - rect.top
            };
        };

        const startDraw = (e) => {
            isDrawing = true;
            const pos = getPos(e);
            drawingCtx.beginPath();
            drawingCtx.moveTo(pos.x, pos.y);
        };

        const draw = (e) => {
            if (!isDrawing) return;
            e.preventDefault();
            const pos = getPos(e);
            drawingCtx.lineWidth = brushSizeInput ? brushSizeInput.value : 5;
            drawingCtx.strokeStyle = "#1E232A";
            drawingCtx.lineTo(pos.x, pos.y);
            drawingCtx.stroke();
        };

        const stopDraw = () => {
            if (isDrawing) {
                isDrawing = false;
                saveDrawingState();
                syncDrawingToGarment();
            }
        };

        drawingCanvas.addEventListener("mousedown", startDraw);
        drawingCanvas.addEventListener("mousemove", draw);
        drawingCanvas.addEventListener("mouseup", stopDraw);
        drawingCanvas.addEventListener("mouseleave", stopDraw);

        drawingCanvas.addEventListener("touchstart", startDraw, { passive: false });
        drawingCanvas.addEventListener("touchmove", draw, { passive: false });
        drawingCanvas.addEventListener("touchend", stopDraw);

        if (clearDrawingBtn) {
            clearDrawingBtn.addEventListener("click", () => {
                drawingCtx.clearRect(0, 0, drawingCanvas.width, drawingCanvas.height);
                saveDrawingState();
                syncDrawingToGarment();
            });
        }

        if (undoDrawingBtn) {
            undoDrawingBtn.addEventListener("click", () => {
                if (drawingHistory.length > 1) {
                    drawingHistory.pop();
                    const prevImage = drawingHistory[drawingHistory.length - 1];
                    drawingCtx.putImageData(prevImage, 0, 0);
                } else if (drawingHistory.length === 1) {
                    drawingCtx.clearRect(0, 0, drawingCanvas.width, drawingCanvas.height);
                    saveDrawingState();
                }
                syncDrawingToGarment();
            });
        }
    }

    const prices = { tshirt: 350.00, hoodie: 650.00 };
    const sizePrices = { S: 0.00, M: 15.00, L: 25.00, XL: 30.00, "2XL": 50.00 };
    const colorPrices = { white: 0.00, black: 0.00, red: 15.00, blue: 15.00, green: 15.00, yellow: 20.00, purple: 20.00 };

    const colorFilters = {
        white: "brightness(1) saturate(1)",
        black: "brightness(0.15) grayscale(100%)",
        red: "brightness(0.8) sepia(1) hue-rotate(310deg) saturate(7)",
        blue: "brightness(0.8) sepia(1) hue-rotate(170deg) saturate(6)",
        green: "brightness(0.8) sepia(1) hue-rotate(75deg) saturate(6)",
        yellow: "brightness(1.1) sepia(1) hue-rotate(10deg) saturate(7)",
        purple: "brightness(0.75) sepia(1) hue-rotate(240deg) saturate(6)"
    };

    const viewPaths = {
        tshirt: [
            'image/white t-shirt/white_t-shirt_front.png',
            'image/white t-shirt/white_t-shirt_right.png',
            'image/white t-shirt/white_t-shirt_back.png',
            'image/white t-shirt/white_t-shirt_left.png'
        ],
        hoodie: [
            'image/hoodie/hoodie_front.png',
            'image/hoodie/hoodie_right.png',
            'image/hoodie/hoodie_back.png',
            'image/hoodie/hoodie_left.png'
        ]
    };

    let currentProductType = 'tshirt';
    let currentIndex = 0;
    let currentSize = 'S';
    let currentColor = 'white';
    
    let viewData = {
        0: { text: '', position: 'center', y: 250, graphic: '' },
        1: { text: '', position: 'center', y: 250, graphic: '' },
        2: { text: '', position: 'center', y: 250, graphic: '' },
        3: { text: '', position: 'center', y: 250, graphic: '' }
    };

    const updatePriceDisplay = () => {
        const base = prices[currentProductType] || 350;
        const sizeAddon = sizePrices[currentSize] || 0;
        const colorAddon = colorPrices[currentColor] || 0;
        
        let totalTextCharCount = Object.values(viewData).reduce((sum, v) => sum + v.text.trim().length, 0);
        const textAddon = totalTextCharCount > 0 ? 50.00 : 0.00;

        let hasAnyGraphic = Object.values(viewData).some(v => v.graphic !== '');
        const graphicAddon = hasAnyGraphic ? 75.00 : 0.00;

        const total = base + sizeAddon + colorAddon + textAddon + graphicAddon;

        const formattedTotal = `₱${total.toFixed(2)}`;
        const formattedBase = `₱${base.toFixed(2)}`;
        const formattedSize = `₱${sizeAddon.toFixed(2)}`;
        const formattedColor = `₱${colorAddon.toFixed(2)}`;
        const formattedText = `₱${textAddon.toFixed(2)}`;
        const formattedGraphic = `₱${graphicAddon.toFixed(2)}`;

        if (currentPriceElem) currentPriceElem.textContent = formattedTotal;
        if (basePriceElem) basePriceElem.textContent = formattedBase;
        if (sizePriceElem) sizePriceElem.textContent = formattedSize;
        if (colorPriceElem) colorPriceElem.textContent = formattedColor;
        if (textPriceElem) textPriceElem.textContent = formattedText;
        if (graphicPriceElem) graphicPriceElem.textContent = formattedGraphic;
        if (totalPriceElem) totalPriceElem.textContent = formattedTotal;
        if (summaryPrice) summaryPrice.textContent = formattedTotal;
    };

    const getGarmentImagePath = () => {
        const views = viewPaths[currentProductType] || viewPaths['tshirt'];
        return views[currentIndex];
    };

    const syncUIWithCurrentView = () => {
        const currentViewObj = viewData[currentIndex];

        if (customTextInput) {
            customTextInput.value = currentViewObj.text;
        }
        if (customTextPreview) {
            customTextPreview.textContent = currentViewObj.text;
            customTextPreview.setAttribute("y", currentViewObj.y);
        }
        if (textPositionSelect) {
            textPositionSelect.value = currentViewObj.position;
        }
        if (summaryText) {
            summaryText.textContent = currentViewObj.text.trim() === "" ? "None" : currentViewObj.text;
        }

        if (graphicPreview) {
            if (currentViewObj.graphic) {
                let path = '';
                if (currentViewObj.graphic === 'design_1') path = 'image/graphic/graphic_design_1.png';
                else if (currentViewObj.graphic === 'design_2') path = 'image/graphic/graphic_design_2.png';
                else if (currentViewObj.graphic === 'design_3') path = 'image/graphic/graphic_design_3.png';

                graphicPreview.setAttributeNS("http://www.w3.org/1999/xlink", "href", path);
                graphicPreview.setAttribute("href", path);
            } else {
                graphicPreview.setAttributeNS("http://www.w3.org/1999/xlink", "href", "");
                graphicPreview.removeAttribute("href");
            }
        }
        if (summaryGraphic) {
            summaryGraphic.textContent = currentViewObj.graphic ? `Design ${currentViewObj.graphic.replace('design_', '')}` : "None";
        }
    };

    const applyGarmentStyles = () => {
        if (garmentBase) {
            const imagePath = getGarmentImagePath();
            garmentBase.setAttributeNS("http://www.w3.org/1999/xlink", "href", imagePath);
            garmentBase.setAttribute("href", imagePath);
            garmentBase.style.filter = colorFilters[currentColor] || colorFilters['white'];
        }

        if (garmentPattern) {
            garmentPattern.style.display = "none";
        }

        syncUIWithCurrentView();
    };

    selectButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            currentProductType = btn.getAttribute("data-type");
            currentIndex = 0;
            
            viewData = {
                0: { text: '', position: 'center', y: 250, graphic: '' },
                1: { text: '', position: 'center', y: 250, graphic: '' },
                2: { text: '', position: 'center', y: 250, graphic: '' },
                3: { text: '', position: 'center', y: 250, graphic: '' }
            };

            if (catalogView) catalogView.classList.add("studio-hidden");
            if (customizationStudio) customizationStudio.classList.remove("studio-hidden");

            applyGarmentStyles();
            updatePriceDisplay();

            if (summaryApparel) {
                summaryApparel.textContent = currentProductType === "hoodie" ? "Pullover Hoodie" : "Classic T-Shirt";
            }
        });
    });

    sizeButtons.forEach(btn => {
        btn.addEventListener("click", (e) => {
            const targetBtn = e.currentTarget;
            currentSize = targetBtn.getAttribute("data-size");

            sizeButtons.forEach(b => b.classList.remove("active"));
            targetBtn.classList.add("active");

            if (summarySize) summarySize.textContent = currentSize;

            const hiddenSizeInput = document.getElementById("selected-size");
            if (hiddenSizeInput) hiddenSizeInput.value = currentSize;

            updatePriceDisplay();
        });
    });

    colorButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            colorButtons.forEach(b => b.style.borderColor = "transparent");
            btn.style.borderColor = "#E06D53";
            
            currentColor = btn.getAttribute("data-color") || "white";
            if (summaryColor) summaryColor.textContent = btn.textContent.trim();

            applyGarmentStyles();
            updatePriceDisplay();
        });
    });

    if (customTextInput) {
        customTextInput.addEventListener("input", (e) => {
            const textVal = e.target.value;
            viewData[currentIndex].text = textVal;
            if (customTextPreview) customTextPreview.textContent = textVal;
            if (summaryText) summaryText.textContent = textVal.trim() === "" ? "None" : textVal;
            updatePriceDisplay();
        });
    }

    if (textPositionSelect && customTextPreview) {
        textPositionSelect.addEventListener("change", (e) => {
            const pos = e.target.value;
            viewData[currentIndex].position = pos;
            let yVal = 250;
            if (pos === "top") yVal = 150;
            else if (pos === "bottom") yVal = 350;
            
            viewData[currentIndex].y = yVal;
            customTextPreview.setAttribute("y", yVal);
        });
    }

    graphicButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            const graphicType = btn.getAttribute("data-graphic");
            if (graphicType) {
                viewData[currentIndex].graphic = graphicType;
                
                graphicButtons.forEach(b => {
                    b.classList.remove("active");
                    b.style.borderColor = "transparent";
                });
                btn.classList.add("active");
                btn.style.borderColor = "#E06D53";

                if (graphicPreview) {
                    let path = '';
                    if (graphicType === 'design_1') path = 'image/graphic/graphic_design_1.png';
                    else if (graphicType === 'design_2') path = 'image/graphic/graphic_design_2.png';
                    else if (graphicType === 'design_3') path = 'image/graphic/graphic_design_3.png';
                    
                    graphicPreview.setAttributeNS("http://www.w3.org/1999/xlink", "href", path);
                    graphicPreview.setAttribute("href", path);
                }
                if (summaryGraphic) summaryGraphic.textContent = `Design ${graphicType.replace('design_', '')}`;
                updatePriceDisplay();
            }
        });
    });

    if (removeGraphicBtn) {
        removeGraphicBtn.addEventListener("click", () => {
            viewData[currentIndex].graphic = '';

            graphicButtons.forEach(b => {
                b.classList.remove("active");
                b.style.borderColor = "transparent";
            });

            if (graphicPreview) {
                graphicPreview.setAttributeNS("http://www.w3.org/1999/xlink", "href", "");
                graphicPreview.removeAttribute("href");
            }
            if (summaryGraphic) summaryGraphic.textContent = "None";
            updatePriceDisplay();
        });
    }

    if (rotateBtn) {
        rotateBtn.addEventListener('click', () => {
            const views = viewPaths[currentProductType] || viewPaths['tshirt'];
            currentIndex = (currentIndex + 1) % views.length;
            applyGarmentStyles();
        });
    }

    if (backButton) {
        backButton.addEventListener("click", () => {
            if (customizationStudio) customizationStudio.classList.add("studio-hidden");
            if (catalogView) catalogView.classList.remove("studio-hidden");
        });
    }

    if (saveDesignBtn) {
        saveDesignBtn.addEventListener("click", () => {
            const designState = {
                productType: currentProductType,
                size: currentSize,
                color: currentColor,
                viewData: viewData,
                drawingData: drawingCanvas ? drawingCanvas.toDataURL() : null
            };
            localStorage.setItem("threadcraft_saved_design", JSON.stringify(designState));
            alert("Design saved successfully!");
        });
    }

    if (loadDesignBtn) {
        loadDesignBtn.addEventListener("click", () => {
            const saved = localStorage.getItem("threadcraft_saved_design");
            if (!saved) {
                alert("No saved design found.");
                return;
            }
            const state = JSON.parse(saved);
            currentProductType = state.productType;
            currentSize = state.size;
            currentColor = state.color;
            viewData = state.viewData;

            sizeButtons.forEach(b => {
                if (b.getAttribute("data-size") === currentSize) b.classList.add("active");
                else b.classList.remove("active");
            });

            colorButtons.forEach(b => {
                if (b.getAttribute("data-color") === currentColor) b.style.borderColor = "#E06D53";
                else b.style.borderColor = "transparent";
            });

            if (state.drawingData && drawingCanvas && drawingCtx) {
                const img = new Image();
                img.onload = () => {
                    drawingCtx.clearRect(0, 0, drawingCanvas.width, drawingCanvas.height);
                    drawingCtx.drawImage(img, 0, 0);
                    saveDrawingState();
                    syncDrawingToGarment();
                };
                img.src = state.drawingData;
            }

            currentIndex = 0;
            applyGarmentStyles();
            updatePriceDisplay();
            alert("Design loaded successfully!");
        });
    }

    if (resetDesignBtn) {
        resetDesignBtn.addEventListener("click", () => {
            currentSize = 'S';
            currentColor = 'white';
            currentIndex = 0;
            viewData = {
                0: { text: '', position: 'center', y: 250, graphic: '' },
                1: { text: '', position: 'center', y: 250, graphic: '' },
                2: { text: '', position: 'center', y: 250, graphic: '' },
                3: { text: '', position: 'center', y: 250, graphic: '' }
            };

            if (drawingCanvas && drawingCtx) {
                drawingCtx.clearRect(0, 0, drawingCanvas.width, drawingCanvas.height);
                saveDrawingState();
                syncDrawingToGarment();
            }

            sizeButtons.forEach((b, idx) => {
                if (idx === 0) b.classList.add("active");
                else b.classList.remove("active");
            });

            colorButtons.forEach(b => {
                if (b.getAttribute("data-color") === "white") b.style.borderColor = "#E06D53";
                else b.style.borderColor = "transparent";
            });

            graphicButtons.forEach(b => {
                b.classList.remove("active");
                b.style.borderColor = "transparent";
            });

            applyGarmentStyles();
            updatePriceDisplay();
            alert("Design reset to default.");
        });
    }

    updatePriceDisplay();
});