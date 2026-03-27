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
        codeAttempts: {},
        started: false,
        gameTime: 330, // 5:30 in minutes
        gameTimeInterval: null,
        idleTimer: null,
        washerCountdown: null,
        stoveSequence: [],

        hasItem(id) { return this.inventory.some(i => i.id === id); },
        addItem(id) {
            if (this.inventory.length >= 6 || this.hasItem(id)) return;
            const item = ITEMS[id];
            if (item) this.inventory.push({ ...item });
            renderInventory();
        },
        removeItem(id) {
            this.inventory = this.inventory.filter(i => i.id !== id);
            renderInventory();
        },
        setFlag(key, val) { this.flags[key] = val; },
        addJournal(text) {
            if (!this.journal.includes(text)) this.journal.push(text);
        },
        die(reason) { triggerDeath(reason); },
        goToRoom(roomId) { transitionToRoom(roomId); },
        showCodeInput(opts) { openCodeInput(opts); },
        showBottleSelection() { openBottleSelection(); },
        showShowerPuzzle() { openShowerPuzzle(); },
        showStovePuzzle() { openStovePuzzle(); },
        showStairPuzzle() { openStairPuzzle(); },
        showChairPuzzle() { openChairPuzzle(); },
        showWasherPuzzle() { openWasherPuzzle(); },
        showGardenMap() { openGardenMap(); },
        showRoadCrossing() { openRoadCrossing(); },
        triggerEnding(type) { showEnding(type); },
        startMirrorStare(room) { startMirrorTimer(room); },
        setRoomDark(dark) {
            const overlay = $('room-overlay');
            if (dark) {
                overlay.classList.add('lights-off');
                $('room-container').classList.remove('flickering');
            } else {
                overlay.classList.remove('lights-off');
                const room = ROOMS[state.currentRoom];
                if (room && room.flickering) $('room-container').classList.add('flickering');
            }
        }
    };

    const $ = (id) => document.getElementById(id);

    // ─── Game Time ───
    function startGameTime() {
        updateTimeDisplay();
        state.gameTimeInterval = setInterval(() => {
            state.gameTime++;
            if (state.gameTime >= 1440) state.gameTime = 0;
            updateTimeDisplay();
        }, 10000); // 1 game minute = 10 real seconds
    }

    function updateTimeDisplay() {
        const h = Math.floor(state.gameTime / 60);
        const m = state.gameTime % 60;
        $('game-time-text').textContent = `${h}:${m.toString().padStart(2, '0')}`;
    }

    // ─── Title Screen ───
    $('btn-start').addEventListener('click', () => {
        $('title-screen').classList.add('hidden');
        $('game-screen').classList.remove('hidden');
        state.started = true;
        startGameTime();
        enterRoom('bedroom');
    });

    // ─── Room Rendering ───
    function enterRoom(roomId) {
        const room = ROOMS[roomId];
        if (!room) return;
        clearIdleTimer();
        state.currentRoom = roomId;
        state.visitCounts[roomId] = (state.visitCounts[roomId] || 0) + 1;

        const bg = $('room-bg');
        bg.style.backgroundImage = room.bgGradient
            ? room.bgGradient + `, url('${room.background}')`
            : `url('${room.background}')`;

        const nameEl = $('room-name-display');
        nameEl.textContent = room.name;
        nameEl.style.animation = 'none';
        nameEl.offsetHeight;
        nameEl.style.animation = 'roomNameFade 3s ease-out forwards';

        const container = $('room-container');
        container.classList.toggle('flickering', room.flickering && !state.flags.bathroom_lights_off);

        const overlay = $('room-overlay');
        if (roomId === 'bathroom' && state.flags.bathroom_lights_off) {
            overlay.classList.add('lights-off');
        } else {
            overlay.classList.remove('lights-off');
        }

        renderActionPanel(room);
        closeInteractionPopup();

        // Idle death timer
        if (room.idleDeathTime) {
            state.idleTimer = setTimeout(() => {
                state.die(room.idleDeathMsg || 'คุณอยู่นานเกินไป...');
            }, room.idleDeathTime);
        }
    }

    function clearIdleTimer() {
        if (state.idleTimer) { clearTimeout(state.idleTimer); state.idleTimer = null; }
    }

    function isNavHotspot(hs) {
        // A hotspot is "navigation" if its first interaction has text===null and calls goToRoom
        const first = hs.interactions[0];
        if (!first) return false;
        // Check if label contains navigation keywords or first interaction is a direct room transition
        const navKeywords = ['กลับ', 'ประตู', 'ออกสู่', 'ทางเดินสู่', 'บันไดขึ้น', 'บันไดลง', 'เดินไปที่', 'กลับเข้า'];
        return navKeywords.some(kw => hs.label.includes(kw));
    }

    function renderActionPanel(room) {
        const descEl = $('room-description');
        descEl.textContent = room.description;

        const exploreDiv = $('action-buttons-explore');
        const navDiv = $('action-buttons-nav');
        exploreDiv.innerHTML = '';
        navDiv.innerHTML = '';

        room.hotspots.forEach(hs => {
            const btn = document.createElement('button');
            const isNav = isNavHotspot(hs);
            btn.className = isNav ? 'action-btn-nav' : 'action-btn';
            btn.textContent = hs.label;
            btn.addEventListener('click', (e) => { e.stopPropagation(); handleHotspotClick(hs); });
            if (isNav) {
                navDiv.appendChild(btn);
            } else {
                exploreDiv.appendChild(btn);
            }
        });

        // Hide nav separator if no nav buttons
        navDiv.style.display = navDiv.children.length > 0 ? '' : 'none';
    }

    // ─── Hotspot Interaction ───
    function handleHotspotClick(hs) {
        stopMirrorTimer();
        clearIdleTimer();
        const room = ROOMS[state.currentRoom];
        if (room && room.idleDeathTime) {
            state.idleTimer = setTimeout(() => state.die(room.idleDeathMsg), room.idleDeathTime);
        }
        const interaction = hs.interactions.find(i => i.condition(state));
        if (!interaction) return;
        if (interaction.text === null && interaction.action) { interaction.action(state); return; }
        if (interaction.choices) { showInteractionWithChoices(interaction.text, interaction.choices); }
        else { showInteraction(interaction.text, interaction.action); }
    }

    function showInteraction(text, action) {
        const popup = $('interaction-popup');
        $('interaction-text').textContent = text;
        const choicesDiv = $('interaction-choices');
        choicesDiv.innerHTML = '';
        const btn = document.createElement('button');
        btn.className = 'btn-horror btn-small';
        btn.textContent = action ? 'ตกลง' : 'ปิด';
        btn.addEventListener('click', () => { closeInteractionPopup(); if (action) action(state); });
        choicesDiv.appendChild(btn);
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
            if (choice.text.includes('งัด') || choice.text.includes('เอื้อม') || choice.text.includes('ปีน') || choice.text.includes('เปิด') || choice.text.includes('วิ่ง') || choice.text.includes('เดินลง') || choice.text.includes('หัน')) btn.classList.add('btn-danger');
            btn.textContent = choice.text;
            btn.addEventListener('click', () => { closeInteractionPopup(); if (choice.action) choice.action(state); });
            choicesDiv.appendChild(btn);
        });
        popup.classList.remove('hidden');
    }

    function closeInteractionPopup() { $('interaction-popup').classList.add('hidden'); }

    // ─── Room Transitions ───
    function transitionToRoom(roomId) {
        const overlay = $('transition-overlay');
        overlay.classList.add('active');
        setTimeout(() => { enterRoom(roomId); setTimeout(() => overlay.classList.remove('active'), 400); }, 600);
    }

    // ─── Inventory ───
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
                slot.oncontextmenu = (e) => { e.preventDefault(); showItemDetail(item); };
            } else {
                slot.oncontextmenu = null;
            }
        });
    }

    function showItemDetail(item) {
        $('item-detail-icon').textContent = item.icon;
        $('item-detail-name').textContent = item.name;
        $('item-detail-desc').textContent = item.description;
        $('item-detail').classList.remove('hidden');
    }
    $('btn-close-detail').addEventListener('click', () => $('item-detail').classList.add('hidden'));

    // ─── Journal ───
    $('btn-journal').addEventListener('click', () => { renderJournal(); $('journal-panel').classList.remove('hidden'); });
    $('btn-close-journal').addEventListener('click', () => $('journal-panel').classList.add('hidden'));

    function renderJournal() {
        const container = $('journal-entries');
        container.innerHTML = '';
        if (state.journal.length === 0) { container.innerHTML = '<p class="journal-empty">ยังไม่มีบันทึก...</p>'; return; }
        state.journal.forEach(entry => {
            const div = document.createElement('div');
            div.className = 'journal-entry';
            div.textContent = entry;
            container.appendChild(div);
        });
        const roomDeaths = state.deathCounts[state.currentRoom] || 0;
        if (roomDeaths >= 3) {
            const hint = document.createElement('div');
            hint.className = 'journal-entry hint';
            const hints = {
                bedroom: '💡 ใช้ไม้ขีดไฟส่องก่อนเอื้อมมือในที่มืด',
                bathroom: '💡 น้ำเย็นก่อนเสมอ ปิดไฟเพื่อเห็นสิ่งที่ซ่อนอยู่',
                hallway: '💡 ส่องไฟฉายที่ขั้นบันได หลีกเลี่ยงขั้นที่มีสัญลักษณ์อันตราย',
                kitchen: '💡 อ่านโน้ตสูตรอาหารในห้องทานข้าวก่อน จุดเตาจากหลังก่อน',
                dining_room: '💡 ดูเบาะแสจากรูปภาพและรอยขีดข่วนใต้โต๊ะ',
                laundry: '💡 กดหยุดเครื่องแล้วรอ 60 วินาทีก่อนเปิดฝา',
                living_room: '💡 หาเวลาที่ถูกต้องจากนาฬิกาตั้งพื้น',
                front_garden: '💡 ใช้แผนที่สวนหรือไม้กวาดเคาะดินก่อนเดิน',
                fence_gate: '💡 รวบรวมตัวเลข 4 หลักจากห้องต่างๆ',
                road: '💡 เดินอย่าวิ่ง มองตรงไปอย่าหันกลับ รอสัญญาณครบ 3 ครั้ง'
            };
            hint.textContent = hints[state.currentRoom] || '💡 สังเกตเบาะแสในห้อง';
            container.appendChild(hint);
        }
    }

    // ─── Death System ───
    function triggerDeath(reason) {
        clearIdleTimer();
        state.deathCounts[state.currentRoom] = (state.deathCounts[state.currentRoom] || 0) + 1;
        state.totalDeaths++;
        $('death-reason').textContent = reason;
        $('death-screen').classList.remove('hidden');
        const flash = document.querySelector('.death-flash');
        flash.style.animation = 'none'; flash.offsetHeight;
        flash.style.animation = 'deathFlash 1.5s ease-out forwards';
    }

    $('btn-restart').addEventListener('click', () => {
        $('death-screen').classList.add('hidden');
        enterRoom(state.currentRoom);
    });

    // ─── Mirror Stare Timer ───
    function startMirrorTimer(room) {
        stopMirrorTimer();
        const maxTime = room === 'bedroom' ? 10000 : 8000;
        state.mirrorStartTime = Date.now();
        const bar = document.createElement('div');
        bar.className = 'stare-timer'; bar.style.width = '0%';
        $('room-container').appendChild(bar);
        state.mirrorStareBar = bar;
        state.mirrorTimer = setInterval(() => {
            const elapsed = Date.now() - state.mirrorStartTime;
            bar.style.width = Math.min((elapsed / maxTime) * 100, 100) + '%';
            if (elapsed >= maxTime) {
                stopMirrorTimer();
                state.die(room === 'bedroom' ? 'ภาพสะท้อนในกระจกหันมามอง... แล้วดึงคุณเข้าไป' : 'ภาพสะท้อนเดินออกมาจากกระจก...');
            }
        }, 100);
        const handler = () => { stopMirrorTimer(); document.removeEventListener('click', handler); };
        setTimeout(() => document.addEventListener('click', handler), 100);
    }

    function stopMirrorTimer() {
        if (state.mirrorTimer) { clearInterval(state.mirrorTimer); state.mirrorTimer = null; }
        if (state.mirrorStareBar) { state.mirrorStareBar.remove(); state.mirrorStareBar = null; }
    }

    // ─── Code Input (configurable) ───
    function openCodeInput(opts) {
        const { title, digits, code, puzzleId } = opts;
        state.codeAttempts[puzzleId] = state.codeAttempts[puzzleId] || 0;
        $('code-input-title').textContent = title;
        const container = $('code-digits');
        container.innerHTML = '';
        for (let i = 0; i < digits; i++) {
            const inp = document.createElement('input');
            inp.type = 'text'; inp.maxLength = 1; inp.className = 'code-digit';
            inp.dataset.idx = i; inp.inputMode = 'numeric';
            container.appendChild(inp);
        }
        $('code-attempts-left').textContent = `เหลือโอกาสอีก ${3 - state.codeAttempts[puzzleId]} ครั้ง`;
        $('code-input-overlay').classList.remove('hidden');
        container.querySelector('.code-digit').focus();

        // Auto-advance
        container.querySelectorAll('.code-digit').forEach((d, i, all) => {
            d.oninput = () => { if (d.value && i < all.length - 1) all[i + 1].focus(); };
        });

        // Store current puzzle config
        state._currentCodePuzzle = opts;
    }

    $('btn-code-submit').addEventListener('click', () => {
        const opts = state._currentCodePuzzle;
        if (!opts) return;
        const digits = document.querySelectorAll('#code-digits .code-digit');
        const codeVal = Array.from(digits).map(d => d.value).join('');
        if (codeVal.length < opts.digits) return;

        if (codeVal === opts.code) {
            $('code-input-overlay').classList.add('hidden');
            if (opts.puzzleId === 'wardrobe') {
                state.setFlag('wardrobe_opened', true);
                state.addItem('flashlight');
                state.addJournal('🔦 เปิดตู้เสื้อผ้าด้วยรหัส ' + opts.code + ' — พบไฟฉาย');
                showInteraction('ตู้เสื้อผ้าเปิดออก! ข้างในมีเสื้อผ้าเก่าๆ และ... ไฟฉาย!', null);
            } else if (opts.puzzleId === 'hallbox') {
                state.setFlag('box_opened', true);
                state.addItem('laundry_key');
                state.addJournal('🗝️ เปิดกล่องลับในโถง — พบกุญแจห้องซักล้าง');
                showInteraction('กล่องลับเปิดออก! ข้างในมีกุญแจห้องซักล้าง!', null);
            } else if (opts.puzzleId === 'gate') {
                state.setFlag('gate_opened', true);
                state.addJournal('🔓 ปลดล็อคประตูรั้วด้วยรหัส ' + opts.code + '!');
                showInteraction('ประตูรั้วเปิดออก! ถนนอยู่อีกฝั่ง...', () => state.goToRoom('road'));
            }
        } else {
            state.codeAttempts[opts.puzzleId]++;
            if (state.codeAttempts[opts.puzzleId] >= 3) {
                $('code-input-overlay').classList.add('hidden');
                if (opts.puzzleId === 'wardrobe') state.die('คุณใส่รหัสผิด 3 ครั้ง... ตู้เสื้อผ้าเปิดออกเอง มีอะไรบางอย่างอยู่ข้างใน');
                else if (opts.puzzleId === 'hallbox') state.die('กล่องระเบิดแก๊สพิษออกมา...');
                else if (opts.puzzleId === 'gate') state.die('รั้วส่งกระแสไฟ...');
            } else {
                $('code-attempts-left').textContent = `รหัสผิด! เหลือโอกาสอีก ${3 - state.codeAttempts[opts.puzzleId]} ครั้ง`;
                digits.forEach(d => d.value = '');
                digits[0].focus();
                const box = document.querySelector('.code-input-box');
                box.style.animation = 'none'; box.offsetHeight;
                box.style.animation = 'shake 0.5s ease-out';
            }
        }
    });

    $('btn-code-cancel').addEventListener('click', () => $('code-input-overlay').classList.add('hidden'));

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
                    showInteraction('คุณหยิบขวดยาสีขาว เลขล็อต ' + GATE_DIGIT_2 + ' — ตัวเลขนี้ดูสำคัญ', null);
                } else { state.die('คุณหยิบขวดยาผิด... กลิ่นรุนแรงพุ่งออกมา ร่างกายชักกระตุกและล้มลง'); }
            });
            container.appendChild(btn);
        });
        $('bottle-overlay').classList.remove('hidden');
    }
    $('btn-bottle-cancel').addEventListener('click', () => $('bottle-overlay').classList.add('hidden'));

    // ─── Shower ───
    function openShowerPuzzle() { $('shower-overlay').classList.remove('hidden'); }
    $('btn-cold-water').addEventListener('click', () => {
        $('shower-overlay').classList.add('hidden');
        state.setFlag('shower_done', true);
        state.addJournal('🚿 เปิดน้ำเย็นก่อนในฝักบัว — ห้องน้ำดูสะอาดขึ้น');
        showInteraction('น้ำเย็นไหลออกมาก่อน... แล้วคุณค่อยๆ เปิดน้ำร้อน ห้องน้ำสะอาดขึ้นเล็กน้อย', null);
    });
    $('btn-hot-water').addEventListener('click', () => { $('shower-overlay').classList.add('hidden'); state.die('คุณเปิดน้ำร้อนก่อน... ไอน้ำเดือดระเบิดออกมาจากฝักบัว'); });
    $('btn-shower-cancel').addEventListener('click', () => $('shower-overlay').classList.add('hidden'));

    // ─── Stove Puzzle ───
    function openStovePuzzle() {
        state.stoveSequence = [];
        updateStoveDisplay();
        document.querySelectorAll('.stove-burner').forEach(btn => {
            btn.classList.remove('lit'); btn.disabled = false;
        });
        $('stove-overlay').classList.remove('hidden');
    }

    function updateStoveDisplay() {
        $('stove-sequence-display').textContent = state.stoveSequence.length > 0
            ? 'จุดแล้ว: ' + state.stoveSequence.map(p => ({ bl: 'หลังซ้าย', br: 'หลังขวา', fr: 'หน้าขวา', fl: 'หน้าซ้าย' }[p])).join(' → ')
            : 'ยังไม่ได้จุด';
    }

    document.querySelectorAll('.stove-burner').forEach(btn => {
        btn.addEventListener('click', () => {
            const pos = btn.dataset.pos;
            const idx = state.stoveSequence.length;
            if (pos !== STOVE_ORDER[idx]) {
                $('stove-overlay').classList.add('hidden');
                state.die('คุณจุดเตาผิดลำดับ... แก๊สรั่วสะสมและระเบิด!');
                return;
            }
            state.stoveSequence.push(pos);
            btn.classList.add('lit'); btn.textContent = '🔥 ' + btn.textContent.split(' ').pop();
            btn.disabled = true;
            updateStoveDisplay();
            if (state.stoveSequence.length === 4) {
                setTimeout(() => {
                    $('stove-overlay').classList.add('hidden');
                    state.setFlag('stove_done', true);
                    state.addItem('laundry_key');
                    state.addJournal('🍳 ทำอาหารเช้าสำเร็จ! ได้กุญแจห้องซักล้าง');
                    showInteraction('คุณจุดเตาถูกลำดับ! อาหารเช้าเสร็จ... และพบกุญแจห้องซักล้างในลิ้นชักที่ปลดล็อค', null);
                }, 500);
            }
        });
    });
    $('btn-stove-cancel').addEventListener('click', () => $('stove-overlay').classList.add('hidden'));

    // ─── Stair Puzzle ───
    function openStairPuzzle() {
        const container = $('stair-steps');
        container.innerHTML = '';
        for (let i = 1; i <= 12; i++) {
            const btn = document.createElement('button');
            btn.className = 'stair-step';
            const isDanger = STAIR_DANGER.includes(i);
            if (state.hasItem('flashlight')) {
                btn.textContent = isDanger ? `ขั้นที่ ${i} ⚠️` : `ขั้นที่ ${i} ✓`;
                if (isDanger) btn.classList.add('danger-step');
            } else {
                btn.textContent = `ขั้นที่ ${i}`;
            }
            btn.addEventListener('click', () => {
                if (isDanger) {
                    $('stair-overlay').classList.add('hidden');
                    state.die('ขั้นบันไดที่ ' + i + ' ยุบตัว! คุณตกลงไป...');
                } else {
                    btn.classList.add('stepped'); btn.disabled = true;
                    // Check if all safe steps have been stepped
                    const allStepped = Array.from(container.querySelectorAll('.stair-step:not(.danger-step)')).every(b => b.disabled);
                    if (allStepped) {
                        setTimeout(() => {
                            $('stair-overlay').classList.add('hidden');
                            state.setFlag('stairs_passed', true);
                            state.addJournal('🪜 เดินลงบันไดถูกทุกขั้น — ลงมาถึงชั้นล่างแล้ว');
                            showInteraction('คุณเดินลงบันไดสำเร็จ! ชั้นล่างปรากฏตัว — ห้องครัวอยู่ทางซ้าย ห้องนั่งเล่นอยู่ทางขวา', null);
                        }, 300);
                    }
                }
            });
            container.appendChild(btn);
        }
        $('stair-overlay').classList.remove('hidden');
    }
    $('btn-stair-cancel').addEventListener('click', () => $('stair-overlay').classList.add('hidden'));

    // ─── Chair Puzzle ───
    function openChairPuzzle() {
        const container = $('chair-choices');
        container.innerHTML = '';
        for (let i = 1; i <= 6; i++) {
            const btn = document.createElement('button');
            btn.className = 'btn-horror btn-small chair-btn';
            btn.textContent = `🪑 เก้าอี้ตัวที่ ${i}`;
            if (i !== SAFE_CHAIR) btn.classList.add('btn-danger');
            btn.addEventListener('click', () => {
                $('chair-overlay').classList.add('hidden');
                if (i === SAFE_CHAIR) {
                    state.setFlag('chair_done', true);
                    state.addItem('dining_key');
                    state.addJournal('🪑 นั่งเก้าอี้ตัวที่ 3 — ลิ้นชักซ่อนใต้ที่นั่งเปิดออก! พบกุญแจ');
                    showInteraction('คุณนั่งเก้าอี้ตัวที่ 3... ลิ้นชักซ่อนใต้ที่นั่งเปิดออก! พบกุญแจเล็กสำหรับกล่องในห้องนั่งเล่น', null);
                } else {
                    state.die('ขาเก้าอี้ยุบตัว ล็อคคุณลง... มีอะไรดึงลงใต้โต๊ะ');
                }
            });
            container.appendChild(btn);
        }
        $('chair-overlay').classList.remove('hidden');
    }
    $('btn-chair-cancel').addEventListener('click', () => $('chair-overlay').classList.add('hidden'));

    // ─── Washer Puzzle ───
    function openWasherPuzzle() {
        $('washer-overlay').classList.remove('hidden');
        $('btn-washer-open').classList.add('hidden');

        if (state.flags.washer_ready) {
            $('washer-status').textContent = 'เครื่องหยุดแล้ว — เปิดฝาได้';
            $('btn-washer-stop').classList.add('hidden');
            $('btn-washer-open').classList.remove('hidden');
            $('washer-timer-text').textContent = '';
            return;
        }

        if (state.flags.washer_stopped) {
            const elapsed = Date.now() - state.flags.washer_stop_time;
            const remaining = Math.max(0, 60 - Math.floor(elapsed / 1000));
            if (remaining <= 0) {
                state.setFlag('washer_ready', true);
                $('washer-status').textContent = 'เครื่องหยุดสมบูรณ์แล้ว — เปิดฝาได้!';
                $('btn-washer-stop').classList.add('hidden');
                $('btn-washer-open').classList.remove('hidden');
                $('washer-timer-text').textContent = '';
            } else {
                $('washer-status').textContent = 'เครื่องกำลังหยุด... รอให้หมดรอบ';
                $('btn-washer-stop').classList.add('hidden');
                $('btn-washer-open').classList.remove('hidden');
                startWasherCountdown(remaining);
            }
        } else {
            $('washer-status').textContent = 'เครื่องกำลังหมุนอยู่...';
            $('btn-washer-stop').classList.remove('hidden');
            $('btn-washer-stop').textContent = '⏹ กดหยุดเครื่อง';
            $('washer-timer-text').textContent = '';
        }
    }

    function startWasherCountdown(sec) {
        clearWasherCountdown();
        let remaining = sec;
        updateWasherTimer(remaining);
        state.washerCountdown = setInterval(() => {
            remaining--;
            updateWasherTimer(remaining);
            if (remaining <= 0) {
                clearWasherCountdown();
                state.setFlag('washer_ready', true);
                $('washer-status').textContent = 'เครื่องหยุดสมบูรณ์แล้ว — เปิดฝาได้!';
                $('washer-timer-text').textContent = '✅ พร้อมเปิดฝา';
            }
        }, 1000);
    }

    function updateWasherTimer(sec) {
        $('washer-timer-text').textContent = `⏱ รออีก ${sec} วินาที`;
        const pct = ((60 - sec) / 60) * 100;
        $('washer-countdown-fill').style.width = pct + '%';
    }

    function clearWasherCountdown() {
        if (state.washerCountdown) { clearInterval(state.washerCountdown); state.washerCountdown = null; }
    }

    $('btn-washer-stop').addEventListener('click', () => {
        state.setFlag('washer_stopped', true);
        state.setFlag('washer_stop_time', Date.now());
        $('washer-status').textContent = 'เครื่องกำลังหยุด... รอให้หมดรอบ';
        $('btn-washer-stop').classList.add('hidden');
        $('btn-washer-open').classList.remove('hidden');
        startWasherCountdown(60);
    });

    $('btn-washer-open').addEventListener('click', () => {
        $('washer-overlay').classList.add('hidden');
        clearWasherCountdown();
        if (state.flags.washer_ready) {
            state.setFlag('washer_done', true);
            state.addItem('front_door_key');
            state.addJournal('🔐 พบกุญแจประตูหน้าบ้านในเครื่องซักผ้า!');
            showInteraction('คุณเปิดฝาเครื่อง... พบกุญแจประตูหน้าบ้านพันอยู่กับเสื้อผ้า!', null);
        } else {
            state.die('คุณเปิดฝาเครื่องขณะยังหมุน... แรงดันระเบิดออกมา!');
        }
    });

    $('btn-washer-cancel').addEventListener('click', () => {
        $('washer-overlay').classList.add('hidden');
        clearWasherCountdown();
    });

    // ─── Garden Map ───
    function openGardenMap() {
        const grid = $('garden-grid');
        grid.innerHTML = '';
        const layout = [
            ['🌿','🌿','🔴','🌿','🌿'],
            ['🟢','🔴','🟢','🌿','🔴'],
            ['🟢','🟢','🟢','🔴','🌿'],
            ['🌿','🔴','🟢','🟢','📬'],
        ];
        layout.forEach(row => {
            row.forEach(cell => {
                const div = document.createElement('div');
                div.className = 'garden-cell';
                div.textContent = cell;
                if (cell === '🟢') div.classList.add('safe');
                else if (cell === '🔴') div.classList.add('trap');
                else if (cell === '📬') div.classList.add('mailbox');
                grid.appendChild(div);
            });
        });
        $('garden-map-overlay').classList.remove('hidden');
        state.addJournal('🗺️ ใช้แผนที่สวนผ่านทางเดินปลอดภัย');
    }

    $('btn-close-map').addEventListener('click', () => $('garden-map-overlay').classList.add('hidden'));

    // ─── Road Crossing ───
    function openRoadCrossing() {
        $('road-overlay').classList.remove('hidden');
        $('road-actions').classList.add('hidden');
        $('road-status').textContent = 'สัญญาณไฟกำลังกระพริบ... รอให้กระพริบครบ 3 ครั้ง';
        $('signal-1').textContent = '⚫'; $('signal-2').textContent = '⚫'; $('signal-3').textContent = '⚫';

        let count = 0;
        const flashInterval = setInterval(() => {
            count++;
            $('signal-' + count).textContent = '🟢';
            if (count >= 3) {
                clearInterval(flashInterval);
                state.setFlag('signal_ready', true);
                $('road-status').textContent = 'สัญญาณพร้อมแล้ว! เดินข้ามได้ — จำไว้: อย่าวิ่ง อย่าหันกลับ';
                $('road-actions').classList.remove('hidden');
            }
        }, 2000);
    }

    $('btn-road-walk').addEventListener('click', () => {
        $('road-overlay').classList.add('hidden');
        state.triggerEnding('A');
    });

    $('btn-road-run').addEventListener('click', () => {
        $('road-overlay').classList.add('hidden');
        state.die('คุณวิ่งข้ามถนน... รถที่มองไม่เห็นชน');
    });

    $('btn-road-look-back').addEventListener('click', () => {
        $('road-overlay').classList.add('hidden');
        state.triggerEnding('B');
    });

    // ─── Endings ───
    function showEnding(type) {
        clearIdleTimer();
        const stats = `☠️ ตายทั้งหมด ${state.totalDeaths} ครั้ง | 📓 บันทึก ${state.journal.length} รายการ | 🎒 ไอเทม ${state.inventory.length} ชิ้น`;

        if (type === 'A') {
            $('ending-title').textContent = '— Ending A: หลบหนีสำเร็จ —';
            $('ending-text').textContent = '"บางครั้งสิ่งที่น่ากลัวที่สุดคือสิ่งที่เราทิ้งไว้ข้างหลัง"';
            $('ending-screen').className = 'ending-a';
        } else if (type === 'B') {
            $('ending-title').textContent = '— Ending B: หลบหนีบางส่วน —';
            $('ending-text').textContent = '"บ้านไม่เคยปล่อยให้ใครไปจริงๆ"';
            $('ending-screen').className = 'ending-b';
        } else {
            $('ending-title').textContent = '— Ending C: ตื่น —';
            $('ending-text').textContent = '"ตื่น"';
            $('ending-screen').className = 'ending-c';
        }

        $('ending-stats').textContent = stats;
        $('ending-screen').classList.remove('hidden');
    }

    $('btn-ending-replay').addEventListener('click', () => location.reload());

    // ─── Keyboard shortcuts ───
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeInteractionPopup();
            $('journal-panel').classList.add('hidden');
            $('code-input-overlay').classList.add('hidden');
            $('bottle-overlay').classList.add('hidden');
            $('shower-overlay').classList.add('hidden');
            $('stove-overlay').classList.add('hidden');
            $('stair-overlay').classList.add('hidden');
            $('chair-overlay').classList.add('hidden');
            $('washer-overlay').classList.add('hidden');
            $('garden-map-overlay').classList.add('hidden');
            $('item-detail').classList.add('hidden');
        }
        if (e.key === 'j' || e.key === 'J') {
            if (!$('journal-panel').classList.contains('hidden')) $('journal-panel').classList.add('hidden');
            else { renderJournal(); $('journal-panel').classList.remove('hidden'); }
        }
    });

    // Shake keyframes
    const shakeStyle = document.createElement('style');
    shakeStyle.textContent = `@keyframes shake { 0%,100%{transform:translateX(0)} 20%{transform:translateX(-10px)} 40%{transform:translateX(10px)} 60%{transform:translateX(-6px)} 80%{transform:translateX(6px)} }`;
    document.head.appendChild(shakeStyle);

})();
