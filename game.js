/* ===========================
   WAKE — Game Engine
   =========================== */

(function () {
    'use strict';

    // ─── State ───
    const state = {
        currentRoom: null,
        inventory: [],
        journal: [],
        flags: {},
        deathCounts: {},
        totalDeaths: 0,
        visitCounts: {},
        mirrorTimer: null,
        mirrorStartTime: null,
        mirrorStareBar: null,
        wardrobeAttempts: 0,
        started: false,

        hasItem(id) {
            return this.inventory.some(i => i.id === id);
        },
        addItem(id) {
            if (this.inventory.length >= 6) return;
            if (this.hasItem(id)) return;
            const item = ITEMS[id];
            if (item) this.inventory.push({ ...item });
            renderInventory();
        },
        removeItem(id) {
            this.inventory = this.inventory.filter(i => i.id !== id);
            renderInventory();
        },
        setFlag(key, val) {
            this.flags[key] = val;
        },
        addJournal(text) {
            if (this.journal.includes(text)) return;
            this.journal.push(text);
        },
        die(reason) {
            triggerDeath(reason);
        },
        goToRoom(roomId) {
            transitionToRoom(roomId);
        },
        showCodeInput() {
            openCodeInput();
        },
        showBottleSelection() {
            openBottleSelection();
        },
        showShowerPuzzle() {
            openShowerPuzzle();
        },
        showDemoEnd() {
            triggerDemoEnd();
        },
        startMirrorStare(room) {
            startMirrorTimer(room);
        },
        setRoomDark(dark) {
            const overlay = document.getElementById('room-overlay');
            if (dark) {
                overlay.classList.add('lights-off');
                document.getElementById('room-container').classList.remove('flickering');
            } else {
                overlay.classList.remove('lights-off');
                const room = ROOMS[state.currentRoom];
                if (room && room.flickering) {
                    document.getElementById('room-container').classList.add('flickering');
                }
            }
        }
    };

    // ─── DOM refs ───
    const $ = (id) => document.getElementById(id);

    // ─── Title Screen ───
    $('btn-start').addEventListener('click', () => {
        $('title-screen').classList.add('hidden');
        $('game-screen').classList.remove('hidden');
        state.started = true;
        enterRoom('bedroom');
    });

    // ─── Room Rendering ───
    function enterRoom(roomId) {
        const room = ROOMS[roomId];
        if (!room) return;

        state.currentRoom = roomId;
        state.visitCounts[roomId] = (state.visitCounts[roomId] || 0) + 1;

        // Background
        const bg = $('room-bg');
        bg.style.backgroundImage = `url('${room.background}')`;

        // Room name
        const nameEl = $('room-name-display');
        nameEl.textContent = room.name;
        nameEl.style.animation = 'none';
        nameEl.offsetHeight; // trigger reflow
        nameEl.style.animation = 'roomNameFade 3s ease-out forwards';

        // Flickering
        const container = $('room-container');
        container.classList.toggle('flickering', room.flickering && !state.flags.bathroom_lights_off);

        // Lights
        const overlay = $('room-overlay');
        if (roomId === 'bathroom' && state.flags.bathroom_lights_off) {
            overlay.classList.add('lights-off');
        } else {
            overlay.classList.remove('lights-off');
        }

        // Render hotspots
        renderHotspots(room);

        // Close any popups
        closeInteractionPopup();
    }

    function renderHotspots(room) {
        const layer = $('hotspots-layer');
        layer.innerHTML = '';

        room.hotspots.forEach(hs => {
            const el = document.createElement('div');
            el.className = 'hotspot';
            el.dataset.id = hs.id;
            el.dataset.label = hs.label;
            el.style.left = hs.x;
            el.style.top = hs.y;
            el.style.width = hs.w;
            el.style.height = hs.h;

            el.addEventListener('click', (e) => {
                e.stopPropagation();
                handleHotspotClick(hs);
            });

            layer.appendChild(el);
        });

        // Click on empty space closes popup
        layer.addEventListener('click', (e) => {
            if (e.target === layer) {
                closeInteractionPopup();
            }
        });
    }

    // ─── Hotspot Interaction ───
    function handleHotspotClick(hs) {
        stopMirrorTimer();

        // Find first matching interaction
        const interaction = hs.interactions.find(i => i.condition(state));
        if (!interaction) return;

        if (interaction.text === null && interaction.action) {
            // Direct action (no popup), e.g. room transition
            interaction.action(state);
            return;
        }

        if (interaction.choices) {
            showInteractionWithChoices(interaction.text, interaction.choices);
        } else {
            showInteraction(interaction.text, interaction.action);
        }
    }

    function showInteraction(text, action) {
        const popup = $('interaction-popup');
        $('interaction-text').textContent = text;
        const choicesDiv = $('interaction-choices');
        choicesDiv.innerHTML = '';

        if (action) {
            const btn = document.createElement('button');
            btn.className = 'btn-horror btn-small';
            btn.textContent = 'ตกลง';
            btn.addEventListener('click', () => {
                closeInteractionPopup();
                action(state);
            });
            choicesDiv.appendChild(btn);
        } else {
            const btn = document.createElement('button');
            btn.className = 'btn-horror btn-small';
            btn.textContent = 'ปิด';
            btn.addEventListener('click', () => closeInteractionPopup());
            choicesDiv.appendChild(btn);
        }

        popup.classList.remove('hidden');
    }

    function showInteractionWithChoices(text, choices) {
        const popup = $('interaction-popup');
        $('interaction-text').textContent = text;
        const choicesDiv = $('interaction-choices');
        choicesDiv.innerHTML = '';

        choices.forEach(choice => {
            const btn = document.createElement('button');
            btn.className = 'btn-horror btn-small';
            if (choice.text.includes('งัด') || choice.text.includes('เอื้อม')) {
                btn.classList.add('btn-danger');
            }
            btn.textContent = choice.text;
            btn.addEventListener('click', () => {
                closeInteractionPopup();
                if (choice.action) {
                    choice.action(state);
                }
            });
            choicesDiv.appendChild(btn);
        });

        popup.classList.remove('hidden');
    }

    function closeInteractionPopup() {
        $('interaction-popup').classList.add('hidden');
    }

    // ─── Room Transitions ───
    function transitionToRoom(roomId) {
        const overlay = $('transition-overlay');
        overlay.classList.add('active');

        setTimeout(() => {
            enterRoom(roomId);
            setTimeout(() => {
                overlay.classList.remove('active');
            }, 400);
        }, 600);
    }

    // ─── Inventory Rendering ───
    function renderInventory() {
        const slots = document.querySelectorAll('.inv-slot');
        slots.forEach((slot, i) => {
            slot.innerHTML = '';
            slot.classList.remove('has-item', 'selected');

            if (state.inventory[i]) {
                const item = state.inventory[i];
                slot.classList.add('has-item');
                slot.textContent = item.icon;

                const nameEl = document.createElement('span');
                nameEl.className = 'item-name';
                nameEl.textContent = item.name;
                slot.appendChild(nameEl);

                // Right-click to examine
                slot.addEventListener('contextmenu', (e) => {
                    e.preventDefault();
                    showItemDetail(item);
                });
            }
        });
    }

    function showItemDetail(item) {
        $('item-detail-icon').textContent = item.icon;
        $('item-detail-name').textContent = item.name;
        $('item-detail-desc').textContent = item.description;
        $('item-detail').classList.remove('hidden');
    }

    $('btn-close-detail').addEventListener('click', () => {
        $('item-detail').classList.add('hidden');
    });

    // ─── Journal ───
    $('btn-journal').addEventListener('click', () => {
        renderJournal();
        $('journal-panel').classList.remove('hidden');
    });

    $('btn-close-journal').addEventListener('click', () => {
        $('journal-panel').classList.add('hidden');
    });

    function renderJournal() {
        const container = $('journal-entries');
        container.innerHTML = '';

        if (state.journal.length === 0) {
            container.innerHTML = '<p class="journal-empty">ยังไม่มีบันทึก...</p>';
            return;
        }

        state.journal.forEach(entry => {
            const div = document.createElement('div');
            div.className = 'journal-entry';
            div.textContent = entry;
            container.appendChild(div);
        });

        // Add hints if died 3+ times in current room
        const roomDeaths = state.deathCounts[state.currentRoom] || 0;
        if (roomDeaths >= 3) {
            const hint = document.createElement('div');
            hint.className = 'journal-entry hint';
            if (state.currentRoom === 'bedroom') {
                hint.textContent = '💡 คำใบ้: ใช้ไม้ขีดไฟส่องก่อนเอื้อมมือเข้าไปในที่มืด';
            } else {
                hint.textContent = '💡 คำใบ้: น้ำเย็นก่อนเสมอ ปิดไฟเพื่อเห็นสิ่งที่ซ่อนอยู่';
            }
            container.appendChild(hint);
        }
    }

    // ─── Death System ───
    function triggerDeath(reason) {
        state.deathCounts[state.currentRoom] = (state.deathCounts[state.currentRoom] || 0) + 1;
        state.totalDeaths++;

        $('death-reason').textContent = reason;
        $('death-screen').classList.remove('hidden');

        // Reset death flash animation
        const flash = document.querySelector('.death-flash');
        flash.style.animation = 'none';
        flash.offsetHeight;
        flash.style.animation = 'deathFlash 1.5s ease-out forwards';
    }

    $('btn-restart').addEventListener('click', () => {
        $('death-screen').classList.add('hidden');
        // Restart at current room
        enterRoom(state.currentRoom);
    });

    // ─── Mirror Stare Timer ───
    function startMirrorTimer(room) {
        stopMirrorTimer();

        const maxTime = room === 'bedroom' ? 10000 : 8000;
        state.mirrorStartTime = Date.now();

        // Create stare timer bar
        const bar = document.createElement('div');
        bar.className = 'stare-timer';
        bar.style.width = '0%';
        $('room-container').appendChild(bar);
        state.mirrorStareBar = bar;

        state.mirrorTimer = setInterval(() => {
            const elapsed = Date.now() - state.mirrorStartTime;
            const pct = Math.min((elapsed / maxTime) * 100, 100);
            bar.style.width = pct + '%';

            if (elapsed >= maxTime) {
                stopMirrorTimer();
                if (room === 'bedroom') {
                    state.die('ภาพสะท้อนในกระจกหันมามอง... แล้วดึงคุณเข้าไป');
                } else {
                    state.die('ภาพสะท้อนเดินออกมาจากกระจก...');
                }
            }
        }, 100);

        // Click anywhere to stop
        const handler = () => {
            stopMirrorTimer();
            document.removeEventListener('click', handler);
        };
        setTimeout(() => document.addEventListener('click', handler), 100);
    }

    function stopMirrorTimer() {
        if (state.mirrorTimer) {
            clearInterval(state.mirrorTimer);
            state.mirrorTimer = null;
        }
        if (state.mirrorStareBar) {
            state.mirrorStareBar.remove();
            state.mirrorStareBar = null;
        }
    }

    // ─── Wardrobe Code Input ───
    function openCodeInput() {
        $('code-input-overlay').classList.remove('hidden');
        $('code-attempts-left').textContent = `เหลือโอกาสอีก ${3 - state.wardrobeAttempts} ครั้ง`;
        const digits = document.querySelectorAll('.code-digit');
        digits.forEach(d => { d.value = ''; });
        digits[0].focus();

        // Auto-advance on input
        digits.forEach((d, i) => {
            d.oninput = () => {
                if (d.value && i < digits.length - 1) {
                    digits[i + 1].focus();
                }
            };
        });
    }

    $('btn-code-submit').addEventListener('click', () => {
        const digits = document.querySelectorAll('.code-digit');
        const code = Array.from(digits).map(d => d.value).join('');

        if (code.length < 3) return;

        if (code === WARDROBE_CODE) {
            // Success!
            $('code-input-overlay').classList.add('hidden');
            state.setFlag('wardrobe_opened', true);
            state.addItem('flashlight');
            state.addJournal('🔦 เปิดตู้เสื้อผ้าด้วยรหัส ' + WARDROBE_CODE + ' — พบไฟฉาย');

            showInteraction(
                'ตู้เสื้อผ้าเปิดออก! ข้างในมีเสื้อผ้าเก่าๆ และ... ไฟฉาย!',
                null
            );
        } else {
            state.wardrobeAttempts++;
            if (state.wardrobeAttempts >= 3) {
                $('code-input-overlay').classList.add('hidden');
                state.die('คุณใส่รหัสผิด 3 ครั้ง... ตู้เสื้อผ้าเปิดออกเอง มีอะไรบางอย่างอยู่ข้างใน');
            } else {
                $('code-attempts-left').textContent = `รหัสผิด! เหลือโอกาสอีก ${3 - state.wardrobeAttempts} ครั้ง`;
                digits.forEach(d => { d.value = ''; });
                digits[0].focus();

                // Shake animation
                const box = document.querySelector('.code-input-box');
                box.style.animation = 'none';
                box.offsetHeight;
                box.style.animation = 'shake 0.5s ease-out';
            }
        }
    });

    $('btn-code-cancel').addEventListener('click', () => {
        $('code-input-overlay').classList.add('hidden');
    });

    // ─── Bottle Selection ───
    function openBottleSelection() {
        const container = $('bottle-choices');
        container.innerHTML = '';

        BOTTLES.forEach(bottle => {
            const btn = document.createElement('button');
            btn.className = 'bottle-btn';
            btn.innerHTML = `<strong>${bottle.label}</strong><br>${bottle.desc}`;
            btn.addEventListener('click', () => {
                $('bottle-overlay').classList.add('hidden');
                if (bottle.correct) {
                    state.setFlag('found_digit2', true);
                    state.addJournal('💊 ขวดยาถูกต้อง เลขล็อต: ' + GATE_DIGIT_2 + ' — น่าจะเป็นรหัสหลักที่ 2');
                    showInteraction(
                        'คุณหยิบขวดยาสีขาว เลขล็อต ' + GATE_DIGIT_2 + ' — ตัวเลขนี้ดูสำคัญ บันทึกลงสมุดแล้ว',
                        null
                    );
                } else {
                    state.die('คุณหยิบขวดยาผิด... กลิ่นรุนแรงพุ่งออกมา ร่างกายชักกระตุกและล้มลง');
                }
            });
            container.appendChild(btn);
        });

        $('bottle-overlay').classList.remove('hidden');
    }

    $('btn-bottle-cancel').addEventListener('click', () => {
        $('bottle-overlay').classList.add('hidden');
    });

    // ─── Shower Puzzle ───
    function openShowerPuzzle() {
        $('shower-overlay').classList.remove('hidden');
    }

    $('btn-cold-water').addEventListener('click', () => {
        $('shower-overlay').classList.add('hidden');
        state.setFlag('shower_done', true);
        state.addJournal('🚿 เปิดน้ำเย็นก่อนในฝักบัว — ห้องน้ำดูสะอาดขึ้น');
        showInteraction(
            'น้ำเย็นไหลออกมาก่อน... แล้วคุณค่อยๆ เปิดน้ำร้อน ห้องน้ำสะอาดขึ้นเล็กน้อย',
            null
        );
    });

    $('btn-hot-water').addEventListener('click', () => {
        $('shower-overlay').classList.add('hidden');
        state.die('คุณเปิดน้ำร้อนก่อน... ไอน้ำเดือดระเบิดออกมาจากฝักบัว');
    });

    $('btn-shower-cancel').addEventListener('click', () => {
        $('shower-overlay').classList.add('hidden');
    });

    // ─── Demo End ───
    function triggerDemoEnd() {
        const stats = `☠️ ตายทั้งหมด ${state.totalDeaths} ครั้ง | 📓 บันทึก ${state.journal.length} รายการ | 🎒 ไอเทม ${state.inventory.length} ชิ้น`;
        $('demo-stats').textContent = stats;
        $('demo-end-screen').classList.remove('hidden');
    }

    $('btn-replay').addEventListener('click', () => {
        location.reload();
    });

    // ─── Keyboard shortcuts ───
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeInteractionPopup();
            $('journal-panel').classList.add('hidden');
            $('code-input-overlay').classList.add('hidden');
            $('bottle-overlay').classList.add('hidden');
            $('shower-overlay').classList.add('hidden');
            $('item-detail').classList.add('hidden');
        }
        if (e.key === 'j' || e.key === 'J') {
            if (!$('journal-panel').classList.contains('hidden')) {
                $('journal-panel').classList.add('hidden');
            } else {
                renderJournal();
                $('journal-panel').classList.remove('hidden');
            }
        }
    });

    // Add shake keyframes dynamically
    const shakeStyle = document.createElement('style');
    shakeStyle.textContent = `
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            20% { transform: translateX(-10px); }
            40% { transform: translateX(10px); }
            60% { transform: translateX(-6px); }
            80% { transform: translateX(6px); }
        }
    `;
    document.head.appendChild(shakeStyle);

})();
