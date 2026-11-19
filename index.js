document.addEventListener("DOMContentLoaded", () => {
    const currentUser = JSON.parse(localStorage.getItem("threadcraft_current_user"));
    const isCustomerPage = document.body.classList.contains("customer-page");

    if (isCustomerPage && !currentUser) {
        window.location.href = "index.html";
        return;
    }

    const catalogView = document.getElementById("product-catalog");
    const customizationStudio = document.getElementById("customization-studio");
    const selectButtons = document.querySelectorAll(".select-product-btn");
    const backButton = document.getElementById("back-to-catalog");
    const garmentContainer = document.getElementById("garment-container") || document.querySelector(".studio-preview-area");

    let modelViewer = document.getElementById("garment-3d-model");
    if (!modelViewer && garmentContainer) {
        modelViewer = document.createElement("model-viewer");
        modelViewer.id = "garment-3d-model";
        modelViewer.setAttribute("camera-controls", "");
        modelViewer.setAttribute("auto-rotate", "");
        modelViewer.setAttribute("interaction-prompt", "auto");
        modelViewer.style.width = "100%";
        modelViewer.style.height = "100%";
        modelViewer.style.minHeight = "400px";
        modelViewer.style.backgroundColor = "transparent";
        garmentContainer.appendChild(modelViewer);
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
    const graphicButtons = document.querySelectorAll(".graphic-option");
    const removeGraphicBtn = document.getElementById("remove-graphic");

    const drawingCanvas = document.getElementById("drawing-canvas");
    const drawingCtx = drawingCanvas ? drawingCanvas.getContext("2d") : null;
    const brushSizeInput = document.getElementById("brush-size");
    const clearDrawingBtn = document.getElementById("clear-drawing");
    const undoDrawingBtn = document.getElementById("undo-drawing");

    let overlayContainer = document.getElementById("model-overlay-container");
    if (!overlayContainer && garmentContainer) {
        garmentContainer.style.position = "relative";
        overlayContainer = document.createElement("div");
        overlayContainer.id = "model-overlay-container";
        overlayContainer.style.cssText = "position:absolute; top:50%; left:50%; transform:translate(-50%, -50%); width:180px; height:240px; pointer-events:none; display:flex; flex-direction:column; justify-content:center; align-items:center; z-index:10; text-align:center;";
        
        overlayContainer.innerHTML = `
            <div id="overlay-text" style="position:absolute; width:100%; font-weight:bold; font-size:16px; color:#1E232A; text-shadow:0 1px 2px rgba(255,255,255,0.9); word-break:break-all; top:50%; transform:translateY(-50%); transition: top 0.2s ease;"></div>
            <img id="overlay-graphic" src="" style="max-width:90px; max-height:90px; object-fit:contain; display:none; position:absolute; top:40%; transform:translateY(-50%);" />
            <img id="overlay-drawing" src="" style="max-width:90px; max-height:90px; object-fit:contain; display:none; position:absolute; top:65%; transform:translateY(-50%);" />
        `;
        garmentContainer.appendChild(overlayContainer);
    }

    const overlayText = document.getElementById("overlay-text");
    const overlayGraphic = document.getElementById("overlay-graphic");
    const overlayDrawing = document.getElementById("overlay-drawing");

    const saveDesignBtn = document.getElementById("save-design");
    const loadDesignBtn = document.getElementById("load-design");
    const resetDesignBtn = document.getElementById("reset-design");

    let savedPanel = document.getElementById("saved-panel") || document.getElementById("saved-designs-panel");
    const savedList = document.getElementById("saved-list") || document.getElementById("saved-designs-list");
    const closeSavedBtn = document.getElementById("close-saved") || document.getElementById("close-saved-panel");
    const cartBtn = document.getElementById("cart-btn") || document.querySelector(".cart-btn");
    const logoutBtn = document.getElementById("logout-btn") || document.querySelector(".logout-btn");

    const designsKey = currentUser ? `threadcraft_designs_${currentUser.email}` : "threadcraft_guest_cart";

    let drawingHistory = [];
    let isDrawing = false;

    const saveDrawingState = () => {
        if (!drawingCanvas || !drawingCtx) return;
        if (drawingHistory.length > 20) drawingHistory.shift();
        drawingHistory.push(drawingCtx.getImageData(0, 0, drawingCanvas.width, drawingCanvas.height));
    };

    const syncDrawingToOverlay = () => {
        if (!drawingCanvas || !overlayDrawing) return;
        const dataURL = drawingCanvas.toDataURL("image/png");
        const isEmpty = isCanvasBlank(drawingCanvas);
        if (isEmpty) {
            overlayDrawing.style.display = "none";
            overlayDrawing.src = "";
        } else {
            overlayDrawing.style.display = "block";
            overlayDrawing.src = dataURL;
        }
    };

    const isCanvasBlank = (canvas) => {
        const blank = document.createElement('canvas');
        blank.width = canvas.width;
        blank.height = canvas.height;
        return canvas.toDataURL() === blank.toDataURL();
    };

    if (drawingCanvas && drawingCtx) {
        drawingCanvas.width = 350;
        drawingCanvas.height = 200;
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
                syncDrawingToOverlay();
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
                syncDrawingToOverlay();
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
                syncDrawingToOverlay();
            });
        }
    }

    const prices = { tshirt: 350.00, hoodie: 650.00 };
    const sizePrices = { S: 0.00, M: 15.00, L: 25.00, XL: 30.00, "2XL": 50.00 };
    const colorPrices = { white: 0.00, black: 0.00, red: 15.00, blue: 15.00, green: 15.00, yellow: 20.00, purple: 20.00 };

    const modelPaths = {
        tshirt: "3d model t-shirt/base_basic_shaded.glb",
        hoodie: "3d model hoodie/base_basic_shaded.glb"
    };

    let currentProductType = 'tshirt';
    let currentSize = 'S';
    let currentColor = 'white';
    let currentCustomization = { text: '', position: 'center', graphic: '', graphicSrc: '' };

    const updatePriceDisplay = () => {
        const base = prices[currentProductType] || 350;
        const sizeAddon = sizePrices[currentSize] || 0;
        const colorAddon = colorPrices[currentColor] || 0;
        
        let textAddon = currentCustomization.text && currentCustomization.text.trim().length > 0 ? 50.00 : 0.00;
        let graphicAddon = currentCustomization.graphic ? 75.00 : 0.00;

        const total = base + sizeAddon + colorAddon + textAddon + graphicAddon;

        if (currentPriceElem) currentPriceElem.textContent = `₱${total.toFixed(2)}`;
        if (basePriceElem) basePriceElem.textContent = `₱${base.toFixed(2)}`;
        if (sizePriceElem) sizePriceElem.textContent = `₱${sizeAddon.toFixed(2)}`;
        if (colorPriceElem) colorPriceElem.textContent = `₱${colorAddon.toFixed(2)}`;
        if (textPriceElem) textPriceElem.textContent = `₱${textAddon.toFixed(2)}`;
        if (graphicPriceElem) graphicPriceElem.textContent = `₱${graphicPriceElem.textContent = `₱${graphicAddon.toFixed(2)}`}`;
        if (totalPriceElem) totalPriceElem.textContent = `₱${total.toFixed(2)}`;
        if (summaryPrice) summaryPrice.textContent = `₱${total.toFixed(2)}`;
    };

    const applyGarmentStyles = () => {
    if (modelViewer) {
        const modelSrc = modelPaths[currentProductType] || modelPaths['tshirt'];
        modelViewer.setAttribute("src", modelSrc);

        const colorFiltersMap = {
            white: "brightness(1) saturate(1)",
            black: "brightness(0.25) grayscale(100%)",
            red: "brightness(0.25) sepia(1) hue-rotate(310deg) saturate(7)",
            blue: "brightness(0.25) sepia(1) hue-rotate(170deg) saturate(6)",
            green: "brightness(0.25) sepia(1) hue-rotate(75deg) saturate(6)",
            yellow: "brightness(0.25) sepia(1) hue-rotate(10deg) saturate(7)",
            purple: "brightness(0.25) sepia(1) hue-rotate(240deg) saturate(6)"
        };

        modelViewer.style.filter = colorFiltersMap[currentColor] || "none";
    }

    syncUIWithCurrentView();
};

    const syncUIWithCurrentView = () => {
        if (customTextInput) customTextInput.value = currentCustomization.text;
        
        if (overlayText) {
            overlayText.textContent = currentCustomization.text;
        }

        if (textPositionSelect && overlayText) {
            currentCustomization.position = textPositionSelect.value;
            if (currentCustomization.position === 'top') {
                overlayText.style.top = "20%";
            } else if (currentCustomization.position === 'bottom') {
                overlayText.style.top = "80%";
            } else {
                overlayText.style.top = "50%";
            }
        }

        if (overlayGraphic) {
            if (currentCustomization.graphic && currentCustomization.graphicSrc) {
                overlayGraphic.style.display = "block";
                overlayGraphic.src = currentCustomization.graphicSrc;
            } else {
                overlayGraphic.style.display = "none";
                overlayGraphic.src = "";
            }
        }

        if (summaryText) summaryText.textContent = !currentCustomization.text || currentCustomization.text.trim() === "" ? "None" : currentCustomization.text;
        if (summaryGraphic) summaryGraphic.textContent = currentCustomization.graphic ? `Design ${currentCustomization.graphic.replace('design_', '')}` : "None";
    };

    const getSavedDesigns = () => {
        try {
            return JSON.parse(localStorage.getItem(designsKey)) || [];
        } catch {
            return [];
        }
    };

    const updateCartCount = () => {
        const badge = document.getElementById("cart-count") || (cartBtn ? cartBtn.querySelector("span") : null);
        if (badge) badge.textContent = getSavedDesigns().length;
    };

    const showToast = (message) => {
        let toast = document.getElementById("toast");
        if (!toast) {
            toast = document.createElement("div");
            toast.id = "toast";
            document.body.appendChild(toast);
        }
        toast.style.cssText = "position:fixed; bottom:30px; right:30px; background:#E06D53; color:#FDFBF7; padding:14px 24px; border-radius:8px; z-index:9999; font-weight:600; font-size:15px; box-shadow:0 6px 16px rgba(0,0,0,0.2); transition:opacity 0.3s ease;";
        toast.textContent = message;
        toast.style.display = "block";
        toast.style.opacity = "1";
        setTimeout(() => {
            toast.style.opacity = "0";
            setTimeout(() => { toast.style.display = "none"; }, 300);
        }, 3500);
    };

    selectButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            currentProductType = btn.getAttribute("data-type");
            
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
            currentCustomization.text = e.target.value;
            syncUIWithCurrentView();
            updatePriceDisplay();
        });
    }

    if (textPositionSelect) {
        textPositionSelect.addEventListener("change", (e) => {
            currentCustomization.position = e.target.value;
            syncUIWithCurrentView();
        });
    }

    graphicButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            const graphicType = btn.getAttribute("data-graphic");
            if (graphicType) {
                const imgElem = btn.querySelector("img");
                const path = imgElem ? imgElem.getAttribute("src") : '';

                currentCustomization.graphic = graphicType;
                currentCustomization.graphicSrc = path;
                
                graphicButtons.forEach(b => {
                    b.classList.remove("active");
                    b.style.borderColor = "transparent";
                });
                btn.classList.add("active");
                btn.style.borderColor = "#E06D53";

                syncUIWithCurrentView();
                updatePriceDisplay();
            }
        });
    });

    if (removeGraphicBtn) {
        removeGraphicBtn.addEventListener("click", () => {
            currentCustomization.graphic = '';
            currentCustomization.graphicSrc = '';

            graphicButtons.forEach(b => {
                b.classList.remove("active");
                b.style.borderColor = "transparent";
            });

            syncUIWithCurrentView();
            updatePriceDisplay();
        });
    }

    if (rotateBtn && modelViewer) {
        rotateBtn.addEventListener('click', () => {
            const isAutoRotating = modelViewer.hasAttribute("auto-rotate");
            if (isAutoRotating) {
                modelViewer.removeAttribute("auto-rotate");
                showToast("Auto-rotate disabled. You can now freely drag to inspect.");
            } else {
                modelViewer.setAttribute("auto-rotate", "");
                showToast("Auto-rotate enabled.");
            }
        });
    }

    if (backButton) {
        backButton.addEventListener("click", () => {
            if (customizationStudio) customizationStudio.classList.add("studio-hidden");
            if (catalogView) catalogView.classList.remove("studio-hidden");
        });
    }

    const openSavedDesign = (index) => {
        const designs = getSavedDesigns();
        const state = designs[index];
        if (!state) return;

        currentProductType = state.productType;
        currentSize = state.size;
        currentColor = state.color;
        currentCustomization = state.customization || { text: '', position: 'center', graphic: '', graphicSrc: '' };

        sizeButtons.forEach(b => {
            if (b.getAttribute("data-size") === currentSize) b.classList.add("active");
            else b.classList.remove("active");
        });

        colorButtons.forEach(b => {
            if (b.getAttribute("data-color") === currentColor) b.style.borderColor = "#E06D53";
            else b.style.borderColor = "transparent";
        });

        if (drawingCanvas && drawingCtx) {
            drawingCtx.clearRect(0, 0, drawingCanvas.width, drawingCanvas.height);
            if (state.drawingData) {
                const img = new Image();
                img.onload = () => {
                    drawingCtx.drawImage(img, 0, 0);
                    saveDrawingState();
                    syncDrawingToOverlay();
                };
                img.src = state.drawingData;
            } else {
                saveDrawingState();
                syncDrawingToOverlay();
            }
        }

        if (catalogView) catalogView.classList.add("studio-hidden");
        if (customizationStudio) customizationStudio.classList.remove("studio-hidden");
        if (savedPanel) savedPanel.classList.add("studio-hidden");

        applyGarmentStyles();
        updatePriceDisplay();
        showToast("Design loaded.");
    };

    const renderSavedDesigns = () => {
        if (!savedList) return;
        const designs = getSavedDesigns();

        if (designs.length === 0) {
            savedList.innerHTML = "<p>No saved designs in cart yet.</p>";
            return;
        }

        savedList.innerHTML = designs.map((d, index) => `
            <div class="saved-item" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; border-bottom:1px solid #ddd; padding-bottom:8px;">
                <div>
                    <strong>${d.productType === "hoodie" ? "Pullover Hoodie" : "Classic T-Shirt"}</strong>
                    <p style="margin:4px 0; font-size:14px;">Size: ${d.size} | Color: ${d.color} | <strong>${d.price}</strong></p>
                </div>
                <div class="saved-item-actions">
                    <button type="button" class="saved-open-btn" data-index="${index}" style="margin-right:4px; padding:4px 8px; cursor:pointer;">Open</button>
                    <button type="button" class="saved-delete-btn" data-index="${index}" style="padding:4px 8px; background:#e74c3c; color:white; border:none; border-radius:4px; cursor:pointer;">Delete</button>
                </div>
            </div>
        `).join("");

        savedList.querySelectorAll(".saved-open-btn").forEach(btn => {
            btn.addEventListener("click", () => {
                openSavedDesign(Number(btn.getAttribute("data-index")));
            });
        });

        savedList.querySelectorAll(".saved-delete-btn").forEach(btn => {
            btn.addEventListener("click", () => {
                const list = getSavedDesigns();
                list.splice(Number(btn.getAttribute("data-index")), 1);
                localStorage.setItem(designsKey, JSON.stringify(list));
                renderSavedDesigns();
                updateCartCount();
                showToast("Design deleted.");
            });
        });
    };

    if (cartBtn && savedPanel) {
        cartBtn.addEventListener("click", () => {
            renderSavedDesigns();
            savedPanel.classList.toggle("studio-hidden");
        });
    }

    if (closeSavedBtn && savedPanel) {
        closeSavedBtn.addEventListener("click", () => {
            savedPanel.classList.add("studio-hidden");
        });
    }

    if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
            localStorage.removeItem("threadcraft_current_user");
            window.location.href = "index.html";
        });
    }

    if (saveDesignBtn) {
        saveDesignBtn.addEventListener("click", () => {
            const designs = getSavedDesigns();
            designs.push({
                productType: currentProductType,
                size: currentSize,
                color: currentColor,
                price: totalPriceElem ? totalPriceElem.textContent : "₱350.00",
                customization: currentCustomization,
                drawingData: drawingCanvas ? drawingCanvas.toDataURL() : null
            });
            localStorage.setItem(designsKey, JSON.stringify(designs));
            updateCartCount();
            alert("Success! Your custom design has been saved to your cart.");
            renderSavedDesigns();
            if (savedPanel) savedPanel.classList.remove("studio-hidden");
        });
    }

    if (loadDesignBtn) {
        loadDesignBtn.addEventListener("click", () => {
            renderSavedDesigns();
            if (savedPanel) savedPanel.classList.remove("studio-hidden");
        });
    }

    updateCartCount();

    if (resetDesignBtn) {
        resetDesignBtn.addEventListener("click", () => {
            currentSize = 'S';
            currentColor = 'white';
            currentCustomization = { text: '', position: 'center', graphic: '', graphicSrc: '' };

            if (drawingCanvas && drawingCtx) {
                drawingCtx.clearRect(0, 0, drawingCanvas.width, drawingCanvas.height);
                saveDrawingState();
                syncDrawingToOverlay();
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
            showToast("Design reset to default.");
        });
    }

    applyGarmentStyles();
    updatePriceDisplay();
});