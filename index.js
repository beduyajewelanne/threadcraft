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

    let savedPanel = document.getElementById("saved-panel");
    if (!savedPanel) {
        savedPanel = document.createElement("div");
        savedPanel.id = "saved-panel";
        savedPanel.className = "studio-hidden";
        savedPanel.style.cssText = "position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.5); display:flex; justify-content:center; align-items:center; z-index:1000;";
        savedPanel.innerHTML = `
            <div style="background:#FDFBF7; color:#1E232A; padding:30px; border-radius:12px; width:400px; max-height:80vh; overflow-y:auto; position:relative;">
                <h3>Your Cart / Saved Designs</h3>
                <div id="saved-list" style="margin-top:15px;"></div>
                <button type="button" id="close-saved" style="margin-top:20px; padding:8px 16px; cursor:pointer;">Close</button>
            </div>
        `;
        document.body.appendChild(savedPanel);
    }

    const savedList = document.getElementById("saved-list");
    const closeSavedBtn = document.getElementById("close-saved");
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
            'image/white hoodie/white_hoodie_front.png',
            'image/white hoodie/white_hoodie_front_right.png',
            'image/white hoodie/white_hoodie_right.png',
            'image/white hoodie/white_hoodie_back_right.png',
            'image/white hoodie/white_hoodie_back.png',
            'image/white hoodie/white_hoodie_back_left.png',
            'image/white hoodie/white_hoodie_left.png',
            'image/white hoodie/white_hoodie_front_left.png'
        ]
    };

    let currentProductType = 'tshirt';
    let currentIndex = 0;
    let currentSize = 'S';
    let currentColor = 'white';
    
    let viewData = {};
    const initViewData = () => {
        viewData = {};
        const count = viewPaths[currentProductType].length;
        for (let i = 0; i < count; i++) {
            viewData[i] = { text: '', position: 'center', y: 250, graphic: '', graphicSrc: '' };
        }
    };
    initViewData();

    const updatePriceDisplay = () => {
        const base = prices[currentProductType] || 350;
        const sizeAddon = sizePrices[currentSize] || 0;
        const colorAddon = colorPrices[currentColor] || 0;
        
        let totalTextCharCount = Object.values(viewData).reduce((sum, v) => sum + (v.text ? v.text.trim().length : 0), 0);
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
        return views[currentIndex] || views[0];
    };

    const resolveGraphicPath = (graphicType, savedSrc) => {
        if (savedSrc) return savedSrc;
        const matchingBtn = document.querySelector(`.graphic-option[data-graphic="${graphicType}"] img`);
        if (matchingBtn) return matchingBtn.getAttribute("src");
        if (graphicType === 'design_1') return 'image/graphic/graphic_design_1.png';
        if (graphicType === 'design_2') return 'image/graphic/graphic_design_2.png';
        if (graphicType === 'design_3') return 'image/graphic/Futuristic Sneakers.png';
        return '';
    };

    const syncUIWithCurrentView = () => {
        const currentViewObj = viewData[currentIndex] || { text: '', position: 'center', y: 250, graphic: '', graphicSrc: '' };

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
            summaryText.textContent = !currentViewObj.text || currentViewObj.text.trim() === "" ? "None" : currentViewObj.text;
        }

        if (graphicPreview) {
            if (currentViewObj.graphic) {
                const path = resolveGraphicPath(currentViewObj.graphic, currentViewObj.graphicSrc);
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

    const getSavedDesigns = () => {
        try {
            return JSON.parse(localStorage.getItem(designsKey)) || [];
        } catch {
            return [];
        }
    };

    const updateCartCount = () => {
        const badge = document.getElementById("cart-count") || (cartBtn ? cartBtn.querySelector("span") : null);
        if (badge) {
            badge.textContent = getSavedDesigns().length;
        }
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
            currentIndex = 0;
            initViewData();

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
            if (!viewData[currentIndex]) viewData[currentIndex] = { text: '', position: 'center', y: 250, graphic: '', graphicSrc: '' };
            viewData[currentIndex].text = textVal;
            if (customTextPreview) customTextPreview.textContent = textVal;
            if (summaryText) summaryText.textContent = textVal.trim() === "" ? "None" : textVal;
            updatePriceDisplay();
        });
    }

    if (textPositionSelect && customTextPreview) {
        textPositionSelect.addEventListener("change", (e) => {
            const pos = e.target.value;
            if (!viewData[currentIndex]) viewData[currentIndex] = { text: '', position: 'center', y: 250, graphic: '', graphicSrc: '' };
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
                const imgElem = btn.querySelector("img");
                const path = imgElem ? imgElem.getAttribute("src") : resolveGraphicPath(graphicType, '');

                if (!viewData[currentIndex]) viewData[currentIndex] = { text: '', position: 'center', y: 250, graphic: '', graphicSrc: '' };
                viewData[currentIndex].graphic = graphicType;
                viewData[currentIndex].graphicSrc = path;
                
                graphicButtons.forEach(b => {
                    b.classList.remove("active");
                    b.style.borderColor = "transparent";
                });
                btn.classList.add("active");
                btn.style.borderColor = "#E06D53";

                if (graphicPreview) {
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
            if (viewData[currentIndex]) {
                viewData[currentIndex].graphic = '';
                viewData[currentIndex].graphicSrc = '';
            }

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

    const openSavedDesign = (index) => {
        const designs = getSavedDesigns();
        const state = designs[index];
        if (!state) return;

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

        if (drawingCanvas && drawingCtx) {
            drawingCtx.clearRect(0, 0, drawingCanvas.width, drawingCanvas.height);
            if (state.drawingData) {
                const img = new Image();
                img.onload = () => {
                    drawingCtx.drawImage(img, 0, 0);
                    saveDrawingState();
                    syncDrawingToGarment();
                };
                img.src = state.drawingData;
            } else {
                saveDrawingState();
                syncDrawingToGarment();
            }
        }

        if (catalogView) catalogView.classList.add("studio-hidden");
        if (customizationStudio) customizationStudio.classList.remove("studio-hidden");
        if (savedPanel) savedPanel.classList.add("studio-hidden");

        currentIndex = 0;
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
                viewData: viewData,
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
            currentIndex = 0;
            initViewData();

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
            showToast("Design reset to default.");
        });
    }

    updatePriceDisplay();
});