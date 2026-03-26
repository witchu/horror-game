/* ===========================
   WAKE — Room Definitions
   =========================== */

// ─── Items ───
const ITEMS = {
    key_small: { id: 'key_small', name: 'กุญแจเล็ก', icon: '🔑', description: 'กุญแจเล็กๆ เก่าๆ มีสนิมเกาะเล็กน้อย น่าจะเปิดอะไรบางอย่างได้' },
    matchstick: { id: 'matchstick', name: 'ไม้ขีดไฟ', icon: '🔥', description: 'กล่องไม้ขีดไฟเก่า เหลืออยู่ไม่กี่ก้าน แต่ยังจุดได้' },
    doorknob: { id: 'doorknob', name: 'ลูกบิดประตู', icon: '🚪', description: 'ลูกบิดประตูโลหะ ดูเหมือนหลุดออกมาจากประตูห้องน้ำ' },
    flashlight: { id: 'flashlight', name: 'ไฟฉาย', icon: '🔦', description: 'ไฟฉายขนาดเล็ก แบตเตอรี่ยังมีอยู่ ส่องได้สว่างพอ' },
    old_journal: { id: 'old_journal', name: 'สมุดบันทึกเก่า', icon: '📒', description: 'สมุดบันทึกที่เขียนด้วยลายมือสั่นๆ เนื้อหาส่วนใหญ่อ่านไม่ออก' },
    paper_scrap: { id: 'paper_scrap', name: 'เศษกระดาษ', icon: '📄', description: 'กระดาษชิ้นเล็กฉีกขาด มีข้อความเขียนว่า "ขวดที่สาม นับจากซ้าย เท่านั้นที่ปลอดภัย"' },
    broom: { id: 'broom', name: 'ไม้กวาด', icon: '🧹', description: 'ไม้กวาดยาว ใช้เคาะทดสอบพื้นหรือขั้นบันไดได้' },
    laundry_key: { id: 'laundry_key', name: 'กุญแจห้องซักล้าง', icon: '🗝️', description: 'กุญแจเล็กที่มีป้ายชื่อเขียนว่า "ซักล้าง"' },
    front_door_key: { id: 'front_door_key', name: 'กุญแจประตูหน้าบ้าน', icon: '🔐', description: 'กุญแจทองเหลืองเก่า สำหรับประตูหน้าบ้าน' },
    garden_map: { id: 'garden_map', name: 'แผนที่สวน', icon: '🗺️', description: 'แผนที่วาดมือแสดงทางเดินในสวนหน้าบ้าน จุดปลอดภัยเป็นสีเขียว' },
    remote: { id: 'remote', name: 'รีโมทคอนโทรล', icon: '📺', description: 'รีโมททีวีเก่า ปุ่มส่วนใหญ่หมายเลขลบเลือน' },
    washer_manual: { id: 'washer_manual', name: 'คู่มือเครื่องซักผ้า', icon: '📖', description: 'คู่มือเขียนว่า "รอให้หมดรอบก่อนเปิดฝาเสมอ กดหยุดแล้วรอ 60 วินาที"' },
    dining_key: { id: 'dining_key', name: 'กุญแจกล่องนั่งเล่น', icon: '🔑', description: 'กุญแจขนาดเล็ก พบในลิ้นชักใต้เก้าอี้ห้องทานข้าว' },
    scissors: { id: 'scissors', name: 'กรรไกรเก่า', icon: '✂️', description: 'กรรไกรสนิม แต่ยังคมพอตัดได้' },
};

// ─── Constants ───
const WARDROBE_CODE = '472';
const GATE_DIGIT_1 = '7';
const GATE_DIGIT_2 = '3';
const GATE_DIGIT_3 = '2';
const GATE_DIGIT_4 = '9';
const GATE_CODE = GATE_DIGIT_1 + GATE_DIGIT_2 + GATE_DIGIT_3 + GATE_DIGIT_4;
const HALLWAY_BOX_CODE = '358';
const STOVE_ORDER = ['bl', 'br', 'fr', 'fl'];
const STAIR_DANGER = [3, 7, 11];
const SAFE_CHAIR = 3;

// ─── Bottles ───
const BOTTLES = [
    { id: 1, label: 'ขวดที่ 1', desc: 'ยาสีน้ำเงิน เลขล็อต: 14', correct: false },
    { id: 2, label: 'ขวดที่ 2', desc: 'ยาสีเหลือง เลขล็อต: 29', correct: false },
    { id: 3, label: 'ขวดที่ 3', desc: 'ยาสีขาว เลขล็อต: ' + GATE_DIGIT_2, correct: true },
    { id: 4, label: 'ขวดที่ 4', desc: 'ยาสีแดง เลขล็อต: 51', correct: false },
    { id: 5, label: 'ขวดที่ 5', desc: 'ยาสีดำ เลขล็อต: 88', correct: false }
];

// ─── Room Definitions ───
const ROOMS = {};

// ══════════════════════════════
// Room 1: BEDROOM
// ══════════════════════════════
ROOMS.bedroom = {
    id: 'bedroom', name: '🛏 ห้องนอน',
    background: 'assets/bedroom.png', flickering: false,
    description: 'ห้องนอนเล็กๆ ชั้นสอง แสงเช้าสีเทาลอดผ่านม่านที่ปิดสนิท',
    hotspots: [
        {
            id: 'bed_pillow', label: 'หมอน',
            x: '22%', y: '38%', w: '14%', h: '12%',
            interactions: [
                { condition: (s) => !s.flags.found_key_small, text: 'คุณพลิกหมอนขึ้น... มีกุญแจเล็กๆ ซ่อนอยู่ข้างใต้', action: (s) => { s.addItem('key_small'); s.setFlag('found_key_small', true); s.addJournal('🔑 พบกุญแจเล็กใต้หมอน — น่าจะเปิดอะไรบางอย่างได้'); }},
                { condition: (s) => s.flags.found_key_small, text: 'ใต้หมอนไม่มีอะไรแล้ว', action: null }
            ]
        },
        {
            id: 'nightstand', label: 'โต๊ะข้างเตียง',
            x: '38%', y: '35%', w: '10%', h: '18%',
            interactions: [
                { condition: (s) => !s.flags.found_matchstick, text: 'คุณเปิดลิ้นชักโต๊ะข้างเตียง... พบกล่องไม้ขีดไฟและสมุดบันทึกเก่า', action: (s) => { s.addItem('matchstick'); s.addItem('old_journal'); s.setFlag('found_matchstick', true); s.addJournal('📒 พบสมุดบันทึกเก่า — มีข้อความเขียนว่า "อย่าไว้ใจภาพสะท้อน"'); s.addJournal('🔥 พบไม้ขีดไฟ — อาจใช้ส่องที่มืดได้'); }},
                { condition: (s) => s.flags.found_matchstick, text: 'ลิ้นชักว่างเปล่าแล้ว', action: null }
            ]
        },
        {
            id: 'alarm_clock', label: 'นาฬิกาปลุก',
            x: '40%', y: '32%', w: '6%', h: '8%',
            interactions: [
                { condition: (s) => !s.flags.checked_clock, text: 'นาฬิกาหยุดเดินที่เวลา ' + GATE_DIGIT_1 + ':00 — ตัวเลขถูกเน้นด้วยหมึกแดง', action: (s) => { s.setFlag('checked_clock', true); s.addJournal('⏰ นาฬิกาปลุกหยุดที่ ' + GATE_DIGIT_1 + ':00 — เลข ' + GATE_DIGIT_1 + ' ถูกเน้นด้วยหมึกแดง (รหัสหลักที่ 1?)'); }},
                { condition: (s) => s.flags.checked_clock, text: 'นาฬิกายังคงหยุดที่ ' + GATE_DIGIT_1 + ':00', action: null }
            ]
        },
        {
            id: 'under_bed', label: 'ใต้เตียง',
            x: '18%', y: '55%', w: '18%', h: '10%',
            interactions: [
                { condition: (s) => !s.hasItem('matchstick') && !s.flags.found_doorknob, text: 'ใต้เตียงมืดมาก คุณเอื้อมมือเข้าไป...', choices: [
                    { text: 'เอื้อมมือเข้าไปเลย', action: (s) => s.die('มีอะไรบางอย่างจับมือคุณไว้แน่น... แล้วดึงเข้าไปในความมืด') },
                    { text: 'ถอยออกมา', action: null }
                ]},
                { condition: (s) => s.hasItem('matchstick') && !s.flags.found_doorknob, text: 'คุณจุดไม้ขีดไฟส่องใต้เตียง... เห็นลูกบิดประตูกลิ้งอยู่ในมุม', action: (s) => { s.addItem('doorknob'); s.setFlag('found_doorknob', true); s.addJournal('🚪 พบลูกบิดประตูใต้เตียง — ดูเหมือนหลุดมาจากประตูห้องน้ำ'); }},
                { condition: (s) => s.flags.found_doorknob, text: 'ใต้เตียงว่างเปล่า มีแค่ฝุ่น', action: null }
            ]
        },
        {
            id: 'wardrobe', label: 'ตู้เสื้อผ้า',
            x: '60%', y: '18%', w: '15%', h: '48%',
            interactions: [
                { condition: (s) => !s.flags.wardrobe_opened && !s.flags.has_wardrobe_code, text: 'ตู้เสื้อผ้ามีแม่กุญแจรหัส 3 หลัก คุณยังไม่รู้รหัส...', action: null },
                { condition: (s) => !s.flags.wardrobe_opened && s.flags.has_wardrobe_code, text: 'ตู้เสื้อผ้ามีแม่กุญแจรหัส 3 หลัก — คุณจำรหัสที่เห็นในกระจกห้องน้ำได้', action: (s) => s.showCodeInput({ title: 'ตู้เสื้อผ้า — ใส่รหัส 3 หลัก', digits: 3, code: WARDROBE_CODE, puzzleId: 'wardrobe' }) },
                { condition: (s) => s.flags.wardrobe_opened, text: 'ตู้เสื้อผ้าเปิดอยู่ มีเสื้อผ้าเก่าๆ ไม่มีอะไรเหลือแล้ว', action: null }
            ]
        },
        {
            id: 'mirror_bedroom', label: 'กระจกแต่งตัว',
            x: '78%', y: '22%', w: '8%', h: '38%',
            interactions: [
                { condition: () => true, text: 'คุณมองกระจก... ภาพสะท้อนของคุณยิ้มทั้งที่คุณไม่ได้ยิ้ม', action: (s) => s.startMirrorStare('bedroom') }
            ]
        },
        {
            id: 'window', label: 'หน้าต่าง',
            x: '34%', y: '12%', w: '12%', h: '28%',
            interactions: [
                { condition: () => true, text: 'หน้าต่างล็อคจากข้างนอก ไม่สามารถเปิดได้ แสงที่ส่องเข้ามาดูผิดเวลา — เหมือนเป็นเช้าที่ไม่เคยสิ้นสุด', action: null }
            ]
        },
        {
            id: 'door_bathroom', label: 'ประตูห้องน้ำ',
            x: '2%', y: '15%', w: '10%', h: '50%',
            interactions: [
                { condition: (s) => s.flags.bathroom_unlocked, text: null, action: (s) => s.goToRoom('bathroom') },
                { condition: (s) => !s.hasItem('doorknob') && !s.flags.bathroom_unlocked, text: 'ประตูห้องน้ำไม่มีลูกบิด เปิดไม่ได้ ต้องหาลูกบิดก่อน', action: null },
                { condition: (s) => s.hasItem('doorknob'), text: 'คุณติดลูกบิดเข้ากับประตูแล้วหมุน... ประตูเปิดออก', action: (s) => { s.removeItem('doorknob'); s.setFlag('bathroom_unlocked', true); s.goToRoom('bathroom'); }}
            ]
        },
        {
            id: 'door_hallway', label: 'ประตูโถงทางเดิน',
            x: '88%', y: '15%', w: '10%', h: '50%',
            interactions: [
                { condition: (s) => !s.hasItem('flashlight'), text: 'ประตูออกสู่โถงทางเดิน มืดสนิทข้างนอก ต้องมีไฟฉายก่อน', action: null },
                { condition: (s) => s.hasItem('flashlight'), text: null, action: (s) => s.goToRoom('hallway') }
            ]
        }
    ]
};

// ══════════════════════════════
// Room 2: BATHROOM
// ══════════════════════════════
ROOMS.bathroom = {
    id: 'bathroom', name: '🚿 ห้องน้ำ',
    background: 'assets/bathroom.png', flickering: true,
    description: 'กระเบื้องสีขาวมีรอยร้าว น้ำในอ่างขังสีน้ำตาล หลอดไฟกะพริบ',
    hotspots: [
        {
            id: 'light_switch', label: 'สวิตช์ไฟ',
            x: '2%', y: '25%', w: '6%', h: '10%',
            interactions: [
                { condition: (s) => !s.flags.bathroom_lights_off, text: 'คุณปิดไฟ... ห้องมืดลง มีเพียงแสงจางๆ จากช่องระบายอากาศ', action: (s) => { s.setFlag('bathroom_lights_off', true); s.setRoomDark(true); }},
                { condition: (s) => s.flags.bathroom_lights_off, text: 'คุณเปิดไฟ... หลอดไฟกะพริบสักครู่แล้วสว่างขึ้น', action: (s) => { s.setFlag('bathroom_lights_off', false); s.setRoomDark(false); }}
            ]
        },
        {
            id: 'mirror_bathroom', label: 'กระจก',
            x: '18%', y: '10%', w: '18%', h: '30%',
            interactions: [
                { condition: (s) => s.flags.bathroom_lights_off && !s.flags.has_wardrobe_code, text: 'ในความมืด... กระจกเรืองแสงสีเขียวจางๆ ปรากฏตัวเลข 3 หลัก: "' + WARDROBE_CODE + '"!', action: (s) => { s.setFlag('has_wardrobe_code', true); s.addJournal('🔢 เห็นรหัส "' + WARDROBE_CODE + '" บนกระจกห้องน้ำเมื่อปิดไฟ — น่าจะเป็นรหัสตู้เสื้อผ้าในห้องนอน'); }},
                { condition: (s) => s.flags.bathroom_lights_off && s.flags.has_wardrobe_code, text: 'รหัส "' + WARDROBE_CODE + '" ยังคงเรืองแสงอยู่บนกระจก', action: null },
                { condition: (s) => !s.flags.bathroom_lights_off, text: 'คุณมองกระจก... ภาพสะท้อนเคลื่อนไหวช้ากว่าคุณเล็กน้อย', action: (s) => s.startMirrorStare('bathroom') }
            ]
        },
        {
            id: 'sink', label: 'อ่างล้างหน้า',
            x: '20%', y: '42%', w: '16%', h: '15%',
            interactions: [
                { condition: (s) => !s.flags.sink_used, text: 'คุณเปิดก๊อกน้ำ... น้ำสีแดงข้นไหลออกมา 3 วินาที แล้วค่อยๆ ใสขึ้น', action: (s) => { s.setFlag('sink_used', true); s.addJournal('🚰 น้ำแดงจากอ่างล้างหน้า — ดูเหมือนเลือดสักครู่ก่อนจะใส'); }},
                { condition: (s) => s.flags.sink_used, text: 'น้ำไหลใสปกติแล้ว แต่คราบแดงยังเกาะอ่างอยู่', action: null }
            ]
        },
        {
            id: 'medicine_cabinet', label: 'ตู้ยา',
            x: '40%', y: '12%', w: '12%', h: '24%',
            interactions: [
                { condition: (s) => !s.hasItem('key_small') && !s.flags.cabinet_opened, text: 'ตู้ยาล็อคอยู่ ต้องมีกุญแจเปิด', choices: [
                    { text: 'ลองงัดเปิด', action: (s) => s.die('คุณพยายามงัดตู้ยา... มือคุณติดค้าง มีอะไรบางอย่างดึงจากข้างใน') },
                    { text: 'ปล่อยไว้ก่อน', action: null }
                ]},
                { condition: (s) => s.hasItem('key_small') && !s.flags.cabinet_opened, text: 'คุณใช้กุญแจเล็กเปิดตู้ยา... ข้างในมีขวดยา 5 ขวด', action: (s) => { s.removeItem('key_small'); s.setFlag('cabinet_opened', true); s.showBottleSelection(); }},
                { condition: (s) => s.flags.cabinet_opened && !s.flags.found_digit2, text: 'ตู้ยาเปิดอยู่ มีขวดยาหลายขวด', action: (s) => s.showBottleSelection() },
                { condition: (s) => s.flags.cabinet_opened && s.flags.found_digit2, text: 'ตู้ยาว่างเปล่า ขวดยาถูกนำออกไปหมดแล้ว', action: null }
            ]
        },
        {
            id: 'floor_crack', label: 'รอยร้าวบนพื้น',
            x: '30%', y: '75%', w: '20%', h: '10%',
            interactions: [
                { condition: (s) => !s.flags.found_paper_scrap, text: 'คุณก้มลงดูรอยร้าวบนพื้น... มีเศษกระดาษยัดอยู่ในร่อง', action: (s) => { s.addItem('paper_scrap'); s.setFlag('found_paper_scrap', true); s.addJournal('📄 พบเศษกระดาษ — เขียนว่า "ขวดที่สาม นับจากซ้าย เท่านั้นที่ปลอดภัย"'); }},
                { condition: (s) => s.flags.found_paper_scrap, text: 'รอยร้าวบนพื้น ไม่มีอะไรเหลือแล้ว', action: null }
            ]
        },
        {
            id: 'shower', label: 'ฝักบัว',
            x: '65%', y: '15%', w: '18%', h: '55%',
            interactions: [
                { condition: (s) => !s.flags.shower_done, text: 'ฝักบัวเก่าๆ มีวาล์วน้ำร้อนและน้ำเย็น คุณจะเปิดอะไรก่อน?', action: (s) => s.showShowerPuzzle() },
                { condition: (s) => s.flags.shower_done, text: 'ฝักบัวยังเปิดอยู่ น้ำเย็นไหลเบาๆ ห้องน้ำดูสะอาดขึ้นเล็กน้อย', action: null }
            ]
        },
        {
            id: 'door_back_bedroom', label: 'กลับห้องนอน',
            x: '88%', y: '20%', w: '10%', h: '25%',
            interactions: [{ condition: () => true, text: null, action: (s) => s.goToRoom('bedroom') }]
        },
        {
            id: 'door_hallway_bath', label: 'ออกสู่โถงทางเดิน',
            x: '88%', y: '50%', w: '10%', h: '25%',
            interactions: [
                { condition: (s) => !s.hasItem('flashlight'), text: 'ประตูออกสู่โถงทางเดิน มืดสนิทข้างนอก ต้องมีไฟฉายก่อน', action: null },
                { condition: (s) => s.hasItem('flashlight'), text: null, action: (s) => s.goToRoom('hallway') }
            ]
        }
    ]
};

// ══════════════════════════════
// Room 3: HALLWAY & STAIRS
// ══════════════════════════════
ROOMS.hallway = {
    id: 'hallway', name: '🚪 โถงทางเดิน / บันได',
    background: 'assets/hallway.png', flickering: false,
    description: 'โถงแคบๆ ชั้นสอง รูปถ่ายครอบครัวแขวนเรียงตามผนัง บันไดไม้เก่าลงไปชั้นล่าง',
    hotspots: [
        {
            id: 'family_photos', label: 'รูปถ่ายครอบครัว',
            x: '5%', y: '15%', w: '25%', h: '30%',
            interactions: [
                { condition: (s) => !s.flags.checked_photos, text: 'มีรูปถ่าย 5 รูป ใบหน้าถูกขีดฆ่า แต่ละรูปมีตัวเลขซ่อนอยู่: 3, 5, 8, 1, 6', action: (s) => { s.setFlag('checked_photos', true); s.addJournal('📸 พบตัวเลขซ่อนในรูปถ่าย: 3, 5, 8, 1, 6 — น่าจะเกี่ยวกับรหัสอะไรบางอย่าง'); }},
                { condition: (s) => s.flags.checked_photos && s.visitCounts.hallway >= 2 && !s.flags.found_wall_note, text: 'รูปถ่ายรูปหนึ่งหายไป! ข้างหลังที่แขวนรูปมีโน้ตข้อความ: "พวกเราทุกคนยังอยู่ที่นี่"', action: (s) => { s.setFlag('found_wall_note', true); s.addJournal('📝 โน้ตหลังรูปถ่าย: "พวกเราทุกคนยังอยู่ที่นี่" — น่าสะพรึง'); }},
                { condition: (s) => s.flags.checked_photos, text: 'รูปถ่ายครอบครัว ใบหน้าถูกขีดฆ่าทุกรูป ตัวเลขที่ซ่อนคือ 3, 5, 8, 1, 6', action: null }
            ]
        },
        {
            id: 'secret_box', label: 'กล่องลับบนชั้น',
            x: '32%', y: '20%', w: '12%', h: '15%',
            interactions: [
                { condition: (s) => !s.flags.has_box_code, text: 'กล่องมีแม่กุญแจรหัส 3 หลัก ต้องหารหัสก่อน — อาจได้เบาะแสจากที่อื่น', action: null },
                { condition: (s) => s.flags.has_box_code && !s.flags.box_opened, text: 'คุณจำรหัสจาก TV ได้: ตัวเลขตำแหน่งที่ 1, 3, 5 จากรูปถ่าย', action: (s) => s.showCodeInput({ title: 'กล่องลับ — ใส่รหัส 3 หลัก', digits: 3, code: HALLWAY_BOX_CODE, puzzleId: 'hallbox' }) },
                { condition: (s) => s.flags.box_opened, text: 'กล่องลับเปิดอยู่ ไม่มีอะไรเหลือแล้ว', action: null }
            ]
        },
        {
            id: 'bag', label: 'กระเป๋าแขวนผนัง',
            x: '48%', y: '25%', w: '8%', h: '18%',
            interactions: [
                { condition: (s) => !s.flags.found_broom, text: 'คุณค้นกระเป๋าแขวนผนัง... พบไม้กวาดยาว', action: (s) => { s.addItem('broom'); s.setFlag('found_broom', true); s.addJournal('🧹 พบไม้กวาด — ใช้เคาะทดสอบขั้นบันไดหรือพื้นดินได้'); }},
                { condition: (s) => s.flags.found_broom, text: 'กระเป๋าว่างเปล่าแล้ว', action: null }
            ]
        },
        {
            id: 'stairs', label: 'บันไดลงชั้นล่าง',
            x: '58%', y: '30%', w: '20%', h: '50%',
            interactions: [
                { condition: (s) => !s.flags.stairs_passed && !s.hasItem('flashlight'), text: 'บันไดมืดสนิท ต้องมีไฟฉายก่อน', action: null },
                { condition: (s) => !s.flags.stairs_passed && s.hasItem('flashlight'), text: 'คุณส่องไฟฉาย เห็นบันได 12 ขั้น บางขั้นดูผุ... ต้องเลือกเหยียบให้ถูก', action: (s) => s.showStairPuzzle() },
                { condition: (s) => s.flags.stairs_passed, text: null, action: (s) => s.goToRoom('kitchen') }
            ]
        },
        {
            id: 'hallway_window', label: 'หน้าต่างโถง',
            x: '82%', y: '10%', w: '14%', h: '25%',
            interactions: [
                { condition: () => true, text: 'มองลงไปเห็นสวนหน้าบ้าน ทางเดินซีเมนต์แตกร้าว และจุดที่ดูเหมือนดินถูกขุด... น่าจะมีกับดัก', action: (s) => s.addJournal('👀 เห็นสวนจากหน้าต่าง — ดินบางจุดถูกขุดผิดปกติ ต้องระวัง') }
            ]
        },
        {
            id: 'door_back_bedroom2', label: 'กลับห้องนอน',
            x: '2%', y: '55%', w: '10%', h: '15%',
            interactions: [{ condition: () => true, text: null, action: (s) => s.goToRoom('bedroom') }]
        },
        {
            id: 'door_bathroom_hall', label: 'ประตูห้องน้ำ',
            x: '2%', y: '72%', w: '10%', h: '15%',
            interactions: [
                { condition: (s) => s.flags.bathroom_unlocked, text: null, action: (s) => s.goToRoom('bathroom') },
                { condition: (s) => !s.flags.bathroom_unlocked, text: 'ประตูห้องน้ำล็อคจากข้างใน ต้องเข้าจากห้องนอน', action: null }
            ]
        },
        {
            id: 'door_living_hall', label: 'ทางลงห้องนั่งเล่น',
            x: '75%', y: '65%', w: '15%', h: '20%',
            interactions: [
                { condition: (s) => s.flags.stairs_passed, text: null, action: (s) => s.goToRoom('living_room') },
                { condition: (s) => !s.flags.stairs_passed, text: 'ต้องลงบันไดก่อนถึงจะไปชั้นล่างได้', action: null }
            ]
        }
    ]
};

// ══════════════════════════════
// Room 4: KITCHEN
// ══════════════════════════════
ROOMS.kitchen = {
    id: 'kitchen', name: '🍳 ห้องครัว',
    background: 'assets/kitchen.png', flickering: false,
    description: 'ห้องครัวขนาดกลาง เคาน์เตอร์หินสีเทา กลิ่นแก๊สอ่อนๆ ลอยอยู่',
    hotspots: [
        {
            id: 'stove', label: 'เตาแก๊ส',
            x: '55%', y: '35%', w: '20%', h: '25%',
            interactions: [
                { condition: (s) => !s.hasItem('matchstick'), text: 'เตาแก๊ส 4 หัว ปิดอยู่ทั้งหมด แต่ไม่มีอะไรจุดไฟ', action: null },
                { condition: (s) => s.hasItem('matchstick') && !s.flags.has_recipe && !s.flags.stove_done, text: 'คุณมีไม้ขีดไฟ แต่ไม่รู้ลำดับจุดเตา... ต้องหาเบาะแสก่อน', action: null },
                { condition: (s) => s.hasItem('matchstick') && s.flags.has_recipe && !s.flags.stove_done, text: 'คุณมีไม้ขีดไฟและรู้ลำดับจุดเตาแล้ว! จุดจากหัวหลังก่อน', action: (s) => s.showStovePuzzle() },
                { condition: (s) => s.flags.stove_done, text: 'เตาแก๊สดับแล้ว อาหารเช้าทำเสร็จ', action: null }
            ]
        },
        {
            id: 'fridge', label: 'ตู้เย็น',
            x: '2%', y: '15%', w: '15%', h: '50%',
            interactions: [
                { condition: (s) => !s.flags.fridge_opened, text: 'คุณเปิดตู้เย็น... มีวัตถุดิบและโน้ตติดไว้: "อย่าเปิดลิ้นชักซ้ายสุด"', action: (s) => { s.setFlag('fridge_opened', true); s.addJournal('📝 โน้ตในตู้เย็น: "อย่าเปิดลิ้นชักซ้ายสุด" — ใครเขียนไว้?'); }},
                { condition: (s) => s.flags.fridge_opened, text: 'ตู้เย็นมีวัตถุดิบพื้นฐาน โน้ตยังติดอยู่: "อย่าเปิดลิ้นชักซ้ายสุด"', action: null }
            ]
        },
        {
            id: 'drawer_right', label: 'ลิ้นชักขวา',
            x: '30%', y: '50%', w: '10%', h: '12%',
            interactions: [
                { condition: (s) => !s.flags.found_laundry_key_kitchen, text: 'คุณเปิดลิ้นชักขวา... พบกุญแจห้องซักล้างซ่อนใต้ผ้าเช็ดมือ!', action: (s) => { s.addItem('laundry_key'); s.setFlag('found_laundry_key_kitchen', true); s.addJournal('🗝️ พบกุญแจห้องซักล้างในลิ้นชักครัว'); }},
                { condition: (s) => s.flags.found_laundry_key_kitchen, text: 'ลิ้นชักว่างเปล่า', action: null }
            ]
        },
        {
            id: 'drawer_left', label: 'ลิ้นชักซ้ายสุด',
            x: '20%', y: '50%', w: '10%', h: '12%',
            interactions: [
                { condition: () => true, text: 'ลิ้นชักที่โน้ตเตือนว่า "อย่าเปิด"...', choices: [
                    { text: 'เปิดลิ้นชัก', action: (s) => s.die('มีดปาออกมาจากลิ้นชักอย่างรวดเร็ว...') },
                    { text: 'ไม่เปิด', action: null }
                ]}
            ]
        },
        {
            id: 'counter', label: 'เคาน์เตอร์',
            x: '30%', y: '38%', w: '22%', h: '10%',
            interactions: [
                { condition: () => true, text: 'เคาน์เตอร์มีรอยเปื้อนเป็นรูปวงกลม 4 จุด วางเป็นสี่เหลี่ยม — ดูเหมือนแผนผังหัวเตา รอยจางๆ ระบุลำดับ: หลังซ้าย → หลังขวา → หน้าขวา → หน้าซ้าย', action: (s) => s.addJournal('🔢 รอยบนเคาน์เตอร์แสดงลำดับจุดเตา: หลังซ้าย → หลังขวา → หน้าขวา → หน้าซ้าย') }
            ]
        },
        {
            id: 'door_dining', label: 'ประตูห้องทานข้าว',
            x: '88%', y: '20%', w: '10%', h: '45%',
            interactions: [{ condition: () => true, text: null, action: (s) => s.goToRoom('dining_room') }]
        },
        {
            id: 'door_laundry', label: 'ประตูห้องซักล้าง',
            x: '78%', y: '70%', w: '18%', h: '15%',
            interactions: [
                { condition: (s) => !s.hasItem('laundry_key') && !s.flags.laundry_unlocked, text: 'ประตูห้องซักล้างล็อคอยู่ ต้องมีกุญแจ', action: null },
                { condition: (s) => s.hasItem('laundry_key'), text: 'คุณใช้กุญแจเปิดประตูห้องซักล้าง...', action: (s) => { s.removeItem('laundry_key'); s.setFlag('laundry_unlocked', true); s.goToRoom('laundry'); }},
                { condition: (s) => s.flags.laundry_unlocked, text: null, action: (s) => s.goToRoom('laundry') }
            ]
        },
        {
            id: 'door_hallway_up', label: 'บันไดขึ้นโถง',
            x: '2%', y: '65%', w: '10%', h: '20%',
            interactions: [{ condition: () => true, text: null, action: (s) => s.goToRoom('hallway') }]
        }
    ]
};

// ══════════════════════════════
// Room 5: DINING ROOM
// ══════════════════════════════
ROOMS.dining_room = {
    id: 'dining_room', name: '🍽 ห้องทานข้าว',
    background: 'assets/dining_room.png', flickering: false,
    description: 'โต๊ะอาหารไม้ยาว เก้าอี้ 6 ตัว โคมระย้าเหนือโต๊ะกะพริบเบาๆ',
    hotspots: [
        {
            id: 'recipe_note', label: 'โน้ตสูตรอาหาร',
            x: '30%', y: '50%', w: '15%', h: '10%',
            interactions: [
                { condition: (s) => !s.flags.has_recipe, text: 'โน้ตเขียนว่า: "จุดเตาจากหัวหลังก่อนเสมอ ลำดับ: หลังซ้าย → หลังขวา → หน้าขวา → หน้าซ้าย"', action: (s) => { s.setFlag('has_recipe', true); s.addJournal('📝 สูตรอาหาร: จุดเตาจากหัวหลังก่อน — หลังซ้าย → หลังขวา → หน้าขวา → หน้าซ้าย'); }},
                { condition: (s) => s.flags.has_recipe, text: 'โน้ตสูตรอาหาร: "จุดเตาจากหัวหลังก่อนเสมอ"', action: null }
            ]
        },
        {
            id: 'family_portrait', label: 'รูปภาพครอบครัว',
            x: '30%', y: '5%', w: '40%', h: '25%',
            interactions: [
                { condition: (s) => !s.flags.checked_portrait, text: 'รูปภาพใหญ่ ใบหน้าทุกคนถูกลบ... ข้อความด้านหลังเขียนว่า: "ตัวที่สามจากซ้ายเท่านั้น"', action: (s) => { s.setFlag('checked_portrait', true); s.addJournal('🖼️ ข้อความหลังรูปภาพ: "ตัวที่สามจากซ้ายเท่านั้น" — น่าจะหมายถึงเก้าอี้?'); }},
                { condition: (s) => s.flags.checked_portrait, text: 'ข้อความหลังรูปภาพ: "ตัวที่สามจากซ้ายเท่านั้น"', action: null }
            ]
        },
        {
            id: 'chairs', label: 'เก้าอี้ 6 ตัว',
            x: '15%', y: '55%', w: '70%', h: '20%',
            interactions: [
                { condition: (s) => !s.flags.chair_done, text: 'เก้าอี้ 6 ตัวเรียงกัน ลองนั่งดู...', action: (s) => s.showChairPuzzle() },
                { condition: (s) => s.flags.chair_done, text: 'เก้าอี้ตัวที่ 3 มีลิ้นชักเปิดอยู่ ไม่มีอะไรเหลือแล้ว', action: null }
            ]
        },
        {
            id: 'table_scratch', label: 'รอยขีดข่วนใต้โต๊ะ',
            x: '45%', y: '48%', w: '15%', h: '8%',
            interactions: [
                { condition: () => true, text: 'รอยขีดข่วนใต้โต๊ะชี้ไปที่ตำแหน่งเก้าอี้ตัวที่ 3 จากซ้าย', action: (s) => s.addJournal('📌 รอยขีดข่วนใต้โต๊ะชี้ไปที่เก้าอี้ตัวที่ 3') }
            ]
        },
        {
            id: 'chandelier', label: 'โคมระย้า',
            x: '35%', y: '0%', w: '30%', h: '8%',
            interactions: [
                { condition: () => true, text: 'มองขึ้นไปที่โคมระย้า... มีอะไรบางอย่างเกาะอยู่บนนั้น อย่าเปิดไฟสว่างเต็มที่!', action: (s) => s.addJournal('⚠️ มีอะไรเกาะอยู่บนโคมระย้า อย่าเปิดไฟสว่าง!') }
            ]
        },
        {
            id: 'door_kitchen_back', label: 'กลับห้องครัว',
            x: '2%', y: '20%', w: '10%', h: '45%',
            interactions: [{ condition: () => true, text: null, action: (s) => s.goToRoom('kitchen') }]
        },
        {
            id: 'door_living', label: 'ทางเดินสู่ห้องนั่งเล่น',
            x: '88%', y: '20%', w: '10%', h: '45%',
            interactions: [{ condition: () => true, text: null, action: (s) => s.goToRoom('living_room') }]
        }
    ]
};

// ══════════════════════════════
// Room 6: LAUNDRY
// ══════════════════════════════
ROOMS.laundry = {
    id: 'laundry', name: '🧺 ห้องซักล้าง',
    background: 'assets/laundry.png', flickering: false,
    description: 'ห้องแคบๆ กลิ่นสารเคมีแรง เครื่องซักผ้ากำลังหมุนอยู่',
    idleDeathTime: 180000,
    idleDeathMsg: 'กลิ่นสารเคมีทำให้คุณหมดสติ... แล้วไม่ตื่นขึ้นมาอีก',
    hotspots: [
        {
            id: 'washer', label: 'เครื่องซักผ้า',
            x: '30%', y: '30%', w: '25%', h: '40%',
            interactions: [
                { condition: (s) => !s.flags.washer_stopped && !s.flags.washer_done, text: 'เครื่องซักผ้ากำลังหมุนอยู่ ภายในเห็นอะไรบางอย่างจิ้มๆ...', action: (s) => s.showWasherPuzzle() },
                { condition: (s) => s.flags.washer_stopped && !s.flags.washer_done, text: 'เครื่องหยุดแล้ว แต่ต้องรอให้หมดรอบก่อนเปิดฝา', action: (s) => s.showWasherPuzzle() },
                { condition: (s) => s.flags.washer_done, text: 'เครื่องซักผ้าว่างเปล่า กุญแจถูกนำออกไปแล้ว', action: null }
            ]
        },
        {
            id: 'chemical_shelf', label: 'ชั้นสารเคมี',
            x: '5%', y: '10%', w: '22%', h: '35%',
            interactions: [
                { condition: (s) => !s.flags.checked_chemicals, text: 'ชั้นวางสารเคมี 4 ชนิด: บลีช, แอมโมเนีย, ผงซักฟอก, น้ำยาปรับผ้านุ่ม โน้ตเตือน: "ห้ามผสมบลีชกับแอมโมเนีย!"', action: (s) => { s.setFlag('checked_chemicals', true); s.addJournal('⚠️ สารเคมี: ห้ามผสมบลีชกับแอมโมเนีย!'); }},
                { condition: (s) => s.flags.checked_chemicals && !s.flags.found_scissors, text: 'มองดีๆ... หลังชั้นวางมีกรรไกรเก่าซ่อนอยู่!', action: (s) => { s.addItem('scissors'); s.setFlag('found_scissors', true); s.addJournal('✂️ พบกรรไกรเก่าหลังชั้นสารเคมี'); }},
                { condition: (s) => s.flags.found_scissors, text: 'ชั้นสารเคมี ไม่มีอะไรเหลือที่น่าสนใจ', action: null }
            ]
        },
        {
            id: 'red_clothes', label: 'ถังซักผ้า',
            x: '60%', y: '50%', w: '15%', h: '20%',
            interactions: [
                { condition: () => true, text: 'เสื้อผ้าสีแดงชิ้นหนึ่งในถัง... ไม่ใช่สีย้อม เป็นคราบอะไรบางอย่าง', action: (s) => s.addJournal('🔴 เสื้อผ้าสีแดงในถัง — คราบนี้ไม่ใช่สีย้อม...') }
            ]
        },
        {
            id: 'fire_exit', label: 'ประตูหนีไฟ (โซ่)',
            x: '80%', y: '15%', w: '15%', h: '55%',
            interactions: [
                { condition: (s) => s.hasItem('scissors') && !s.flags.fire_exit_open, text: 'คุณใช้กรรไกรตัดโซ่... ประตูหนีไฟเปิดออก! เป็นทางลัดไปสวนหน้าบ้าน', action: (s) => { s.setFlag('fire_exit_open', true); s.addJournal('🚪 ตัดโซ่ประตูหนีไฟ — ทางลัดไปสวนหน้าบ้าน (แต่จะพลาดเบาะแสสำคัญ)'); s.goToRoom('front_garden'); }},
                { condition: (s) => !s.hasItem('scissors') && !s.flags.fire_exit_open, text: 'ประตูหนีไฟถูกล็อคด้วยโซ่ ต้องมีอะไรตัด', action: null },
                { condition: (s) => s.flags.fire_exit_open, text: null, action: (s) => s.goToRoom('front_garden') }
            ]
        },
        {
            id: 'door_kitchen_back2', label: 'กลับห้องครัว',
            x: '2%', y: '55%', w: '10%', h: '30%',
            interactions: [{ condition: () => true, text: null, action: (s) => s.goToRoom('kitchen') }]
        }
    ]
};

// ══════════════════════════════
// Room 7: LIVING ROOM
// ══════════════════════════════
ROOMS.living_room = {
    id: 'living_room', name: '🛋 ห้องนั่งเล่น',
    background: 'assets/living_room.png', flickering: false,

    description: 'ห้องกว้าง โซฟาหนังเก่า ทีวีจอใหญ่ปิดอยู่ ชั้นหนังสือสูงตลอดผนัง',
    hotspots: [
        {
            id: 'sofa', label: 'โซฟา',
            x: '25%', y: '40%', w: '25%', h: '25%',
            interactions: [
                { condition: (s) => !s.flags.found_remote && !s.flags.found_garden_map, text: 'คุณค้นใต้เบาะโซฟา... พบรีโมทคอนโทรลและแผนที่สวนหน้าบ้าน!', action: (s) => { s.addItem('remote'); s.addItem('garden_map'); s.setFlag('found_remote', true); s.setFlag('found_garden_map', true); s.addJournal('📺 พบรีโมทคอนโทรลใต้โซฟา'); s.addJournal('🗺️ พบแผนที่สวนหน้าบ้าน — แสดงทางเดินปลอดภัย'); }},
                { condition: (s) => s.flags.found_remote, text: 'ใต้เบาะโซฟาว่างเปล่าแล้ว', action: null }
            ]
        },
        {
            id: 'tv', label: 'ทีวี',
            x: '55%', y: '15%', w: '18%', h: '30%',
            interactions: [
                { condition: (s) => !s.hasItem('remote'), text: 'ทีวีจอใหญ่ปิดอยู่ แต่หน้าจอสะท้อนแสงกะพริบเป็นระยะ ต้องหารีโมทก่อน', action: null },
                { condition: (s) => s.hasItem('remote') && !s.flags.tv_watched, text: 'คุณกดรีโมทเปิดทีวี... หน้าจอแสดงลำดับตัวเลข: "ตำแหน่ง 1, 3, 5 จากรูปถ่ายในโถง" แล้วดับไป', action: (s) => { s.setFlag('tv_watched', true); s.setFlag('has_box_code', true); s.addJournal('�� TV แสดงรหัส: ใช้ตัวเลขตำแหน่ง 1, 3, 5 จากรูปถ่ายในโถง → ' + HALLWAY_BOX_CODE); }},
                { condition: (s) => s.flags.tv_watched, text: 'ทีวีดับอยู่ ไม่ตอบสนองอีกแล้ว', action: null }
            ]
        },
        {
            id: 'bookshelf', label: 'ชั้นหนังสือ',
            x: '75%', y: '5%', w: '15%', h: '60%',
            interactions: [
                { condition: (s) => !s.flags.found_washer_manual, text: 'คุณค้นชั้นหนังสือ... พบคู่มือเครื่องซักผ้า!', action: (s) => { s.addItem('washer_manual'); s.setFlag('found_washer_manual', true); s.addJournal('📖 คู่มือเครื่องซักผ้า: "รอให้หมดรอบก่อนเปิดฝาเสมอ กดหยุดแล้วรอ 60 วินาที"'); }},
                { condition: (s) => s.flags.found_washer_manual, text: 'ชั้นหนังสือเต็มด้วยหนังสือเก่า ไม่มีอะไรน่าสนใจเพิ่มแล้ว', action: null }
            ]
        },
        {
            id: 'newspaper', label: 'หนังสือพิมพ์',
            x: '15%', y: '60%', w: '15%', h: '12%',
            interactions: [
                { condition: (s) => !s.flags.found_digit3, text: 'คุณค้นหนังสือพิมพ์หลายฉบับ... พบฉบับที่มีวันที่ขีดด้วยปากกาแดง: วันที่ ' + GATE_DIGIT_3, action: (s) => { s.setFlag('found_digit3', true); s.addJournal('📰 หนังสือพิมพ์: วันที่ ' + GATE_DIGIT_3 + ' ถูกขีดด้วยปากกาแดง (รหัสหลักที่ 3?)'); }},
                { condition: (s) => s.flags.found_digit3, text: 'หนังสือพิมพ์ฉบับที่ขีดวันที่ ' + GATE_DIGIT_3, action: null }
            ]
        },
        {
            id: 'secret_box_living', label: 'กล่องลับบนชั้นหนังสือ',
            x: '78%', y: '25%', w: '10%', h: '12%',
            interactions: [
                { condition: (s) => !s.hasItem('dining_key'), text: 'กล่องเล็กล็อคอยู่ ต้องมีกุญแจ', action: null },
                { condition: (s) => s.hasItem('dining_key') && !s.flags.living_box_opened, text: 'คุณใช้กุญแจเปิดกล่อง... พบกุญแจประตูหน้าบ้าน (สำรอง) และเอกสารลับ!', action: (s) => { s.setFlag('living_box_opened', true); s.removeItem('dining_key'); if (!s.hasItem('front_door_key')) { s.addItem('front_door_key'); } s.addJournal('📜 เอกสารในกล่องลับ: "ครอบครัวนี้ไม่ได้หายไป พวกเขาถูกกักขังไว้ในบ้าน"'); }},
                { condition: (s) => s.flags.living_box_opened, text: 'กล่องว่างเปล่า', action: null }
            ]
        },
        {
            id: 'front_door', label: 'ประตูหน้าบ้าน',
            x: '2%', y: '10%', w: '10%', h: '55%',
            interactions: [
                { condition: (s) => !s.hasItem('front_door_key') && !s.flags.front_door_open, text: 'ประตูหน้าบ้านล็อคด้วยกลอนหลายชั้น ต้องมีกุญแจ', choices: [
                    { text: 'ลองงัดเปิด', action: (s) => s.die('กลอนระเบิดสะเก็ดโดน...') },
                    { text: 'ปล่อยไว้ก่อน', action: null }
                ]},
                { condition: (s) => s.hasItem('front_door_key') && !s.flags.front_door_open, text: 'คุณใช้กุญแจเปิดประตูหน้าบ้าน... แสงเช้าสีเทาส่องเข้ามา', action: (s) => { s.removeItem('front_door_key'); s.setFlag('front_door_open', true); s.goToRoom('front_garden'); }},
                { condition: (s) => s.flags.front_door_open, text: null, action: (s) => s.goToRoom('front_garden') }
            ]
        },
        {
            id: 'carpet', label: 'พรมกลางห้อง',
            x: '30%', y: '70%', w: '25%', h: '12%',
            interactions: [
                { condition: (s) => !s.flags.checked_carpet, text: 'คุณพลิกพรม... พบรอยประทับรูปร่างคน — เหมือนใครบางคนนอนตายอยู่ตรงนี้มานาน', action: (s) => { s.setFlag('checked_carpet', true); s.addJournal('💀 รอยประทับใต้พรม — รูปร่างคน'); }},
                { condition: (s) => s.flags.checked_carpet, text: 'รอยประทับรูปร่างคนบนพื้นใต้พรม', action: null }
            ]
        },
        {
            id: 'door_dining_back', label: 'ทางเดินสู่ห้องทานข้าว',
            x: '88%', y: '55%', w: '10%', h: '30%',
            interactions: [{ condition: () => true, text: null, action: (s) => s.goToRoom('dining_room') }]
        },
        {
            id: 'door_hallway_down', label: 'บันไดขึ้นโถง',
            x: '88%', y: '10%', w: '10%', h: '30%',
            interactions: [{ condition: () => true, text: null, action: (s) => s.goToRoom('hallway') }]
        }
    ]
};

// ══════════════════════════════
// Room 8: FRONT GARDEN
// ══════════════════════════════
ROOMS.front_garden = {
    id: 'front_garden', name: '🌿 สวนหน้าบ้าน',
    background: 'assets/front_garden.png', flickering: false,

    description: 'สวนขนาดกลาง หญ้าสูงผิดปกติ ทางเดินซีเมนต์แตกร้าว เงียบ ไม่มีเสียงนก',
    idleDeathTime: 300000,
    idleDeathMsg: 'หญ้าขยับเข้าหา... บางอย่างเคลื่อนที่ใต้ดิน',
    hotspots: [
        {
            id: 'garden_path', label: 'ทางเดินในสวน',
            x: '20%', y: '35%', w: '50%', h: '40%',
            interactions: [
                { condition: (s) => !s.hasItem('garden_map') && !s.hasItem('broom'), text: 'สวนมีทางเดินซีเมนต์แตกร้าว แต่หญ้ารกมาก ไม่รู้ว่าตรงไหนปลอดภัย...', choices: [
                    { text: 'เดินลงหญ้า', action: (s) => s.die('คุณเหยียบกับดักที่ฝังอยู่ใต้ดิน...') },
                    { text: 'ถอยกลับ', action: null }
                ]},
                { condition: (s) => s.hasItem('garden_map') && !s.flags.garden_passed, text: 'คุณใช้แผนที่สวน... เห็นทางเดินปลอดภัย!', action: (s) => { s.setFlag('garden_passed', true); s.showGardenMap(); }},
                { condition: (s) => s.hasItem('broom') && !s.hasItem('garden_map') && !s.flags.garden_passed, text: 'คุณใช้ไม้กวาดเคาะดินทดสอบ... ช้าแต่ปลอดภัย ค่อยๆ เดินผ่านสวนได้', action: (s) => { s.setFlag('garden_passed', true); s.addJournal('🧹 ใช้ไม้กวาดเคาะดินผ่านสวนอย่างปลอดภัย'); }},
                { condition: (s) => s.flags.garden_passed, text: 'ทางเดินที่ปลอดภัยแล้ว', action: null }
            ]
        },
        {
            id: 'mailbox', label: 'ตู้ไปรษณีย์',
            x: '75%', y: '30%', w: '12%', h: '20%',
            interactions: [
                { condition: (s) => !s.flags.found_digit4, text: 'คุณเปิดตู้ไปรษณีย์... พบจดหมายที่ส่งถึงชื่อคุณ เลขบ้านเขียนผิดเป็น ' + GATE_DIGIT_4 + ' — ตัวเลขนี้ดูสำคัญ', action: (s) => { s.setFlag('found_digit4', true); s.addJournal('📬 จดหมายในตู้ไปรษณีย์: เลขบ้านเขียนผิดเป็น ' + GATE_DIGIT_4 + ' (รหัสหลักที่ 4?)'); s.addJournal('💌 เนื้อหาจดหมาย: เล่าว่าครอบครัวคุณ "ไม่เคยออกจากบ้านนี้"'); }},
                { condition: (s) => s.flags.found_digit4, text: 'ตู้ไปรษณีย์ว่างเปล่า จดหมายถูกหยิบออกไปแล้ว', action: null }
            ]
        },
        {
            id: 'tree1', label: 'ต้นไม้ใหญ่ (ต้นที่ 1)',
            x: '10%', y: '10%', w: '15%', h: '35%',
            interactions: [
                { condition: () => true, text: 'มีอะไรแขวนอยู่บนกิ่ง...', choices: [
                    { text: 'เข้าไปใกล้ดู', action: (s) => s.die('สิ่งที่แขวนบนกิ่งไม้ตกลงมาใส่คุณ...') },
                    { text: 'ถอยออกมา', action: null }
                ]}
            ]
        },
        {
            id: 'flowerpot', label: 'กระถางต้นไม้เล็ก',
            x: '60%', y: '70%', w: '12%', h: '12%',
            interactions: [
                { condition: (s) => !s.flags.found_final_note, text: 'คุณพลิกกระถาง... พบโน้ตกระดาษ: "ถ้าเธออ่านอยู่ อย่าหันกลับ"', action: (s) => { s.setFlag('found_final_note', true); s.addJournal('📝 โน้ตจากกระถาง: "ถ้าเธออ่านอยู่ อย่าหันกลับ" — เบาะแสสุดท้าย?'); }},
                { condition: (s) => s.flags.found_final_note, text: 'กระถางพลิกอยู่แล้ว ไม่มีอะไรเหลือ', action: null }
            ]
        },
        {
            id: 'fence_path', label: 'เดินไปที่รั้ว',
            x: '80%', y: '55%', w: '18%', h: '30%',
            interactions: [
                { condition: (s) => s.flags.garden_passed, text: null, action: (s) => s.goToRoom('fence_gate') },
                { condition: (s) => !s.flags.garden_passed, text: 'ต้องผ่านสวนก่อนถึงจะไปที่รั้วได้', action: null }
            ]
        },
        {
            id: 'door_back_living', label: 'กลับเข้าบ้าน',
            x: '2%', y: '55%', w: '10%', h: '30%',
            interactions: [{ condition: () => true, text: null, action: (s) => s.goToRoom('living_room') }]
        }
    ]
};

// ══════════════════════════════
// Room 9: FENCE & GATE
// ══════════════════════════════
ROOMS.fence_gate = {
    id: 'fence_gate', name: '🔒 รั้ว / ประตู',
    background: 'assets/fence_gate.png', flickering: false,

    description: 'รั้วเหล็กสูง ทาสีดำเคลือบสนิม Keypad ดิจิตอลบนกลอนประตู',
    idleDeathTime: 180000,
    idleDeathMsg: '"สิ่งนั้น" มาจากในบ้าน...',
    hotspots: [
        {
            id: 'keypad', label: 'Keypad',
            x: '35%', y: '30%', w: '20%', h: '25%',
            interactions: [
                { condition: (s) => s.flags.gate_opened, text: 'ประตูรั้วเปิดอยู่แล้ว', action: null },
                { condition: (s) => !s.flags.gate_opened, text: 'Keypad ดิจิตอล ต้องใส่รหัส 4 หลัก ตรวจสอบสมุดบันทึก...', action: (s) => {
                    const cluesFound = [s.flags.checked_clock, s.flags.found_digit2, s.flags.found_digit3, s.flags.found_digit4].filter(Boolean).length;
                    if (cluesFound < 4) {
                        s.addJournal('❓ ยังหาเบาะแสรหัสรั้วไม่ครบ (' + cluesFound + '/4) ต้องกลับไปหา...');
                    }
                    s.showCodeInput({ title: 'ประตูรั้ว — ใส่รหัส 4 หลัก', digits: 4, code: GATE_CODE, puzzleId: 'gate' });
                }}
            ]
        },
        {
            id: 'fence_climb', label: 'ตัวรั้วเหล็ก',
            x: '5%', y: '5%', w: '25%', h: '80%',
            interactions: [
                { condition: () => true, text: 'รั้วสูงเกินไปและมีเหล็กแหลมด้านบน', choices: [
                    { text: 'ลองปีน', action: (s) => s.die('เหล็กแหลมบาดมือ... แรงบางอย่างดึงคุณลงมา') },
                    { text: 'ไม่ปีน', action: null }
                ]}
            ]
        },
        {
            id: 'fence_sign', label: 'ป้ายบนรั้ว',
            x: '65%', y: '20%', w: '15%', h: '15%',
            interactions: [
                { condition: () => true, text: 'ป้ายเก่าเขียนว่า: "ออกไปได้ แต่จะยังเหลืออยู่หรือเปล่า?"', action: (s) => s.addJournal('🪧 ป้ายบนรั้ว: "ออกไปได้ แต่จะยังเหลืออยู่หรือเปล่า?"') }
            ]
        },
        {
            id: 'road_view', label: 'มองถนนอีกฝั่ง',
            x: '60%', y: '50%', w: '25%', h: '30%',
            interactions: [
                { condition: () => true, text: 'ถนนเงียบ ไม่มีรถ ป้ายหยุดรถฝั่งตรงข้ามมีแสงสปอตไลต์ส่อง — ทางออก', action: null }
            ]
        },
        {
            id: 'door_back_garden', label: 'กลับสวน',
            x: '2%', y: '65%', w: '10%', h: '25%',
            interactions: [{ condition: () => true, text: null, action: (s) => s.goToRoom('front_garden') }]
        }
    ]
};

// ══════════════════════════════
// Room 10: ROAD (Final Scene)
// ══════════════════════════════
ROOMS.road = {
    id: 'road', name: '🛣 ถนน',
    background: 'assets/road.png', flickering: false,

    description: 'ถนนสองเลนเงียบกว่าปกติ ไม่มีรถวิ่ง ท้องฟ้าสีเทาอมขาว',
    hotspots: [
        {
            id: 'traffic_signal', label: 'สัญญาณไฟ',
            x: '40%', y: '10%', w: '20%', h: '20%',
            interactions: [
                { condition: (s) => !s.flags.signal_ready, text: 'สัญญาณไฟกำลังกระพริบ... ต้องรอให้กระพริบ 3 ครั้ง', action: (s) => s.showRoadCrossing() },
                { condition: (s) => s.flags.signal_ready, text: 'สัญญาณพร้อมแล้ว — เดินข้ามได้ ห้ามวิ่ง ห้ามหันกลับ', action: (s) => s.showRoadCrossing() }
            ]
        },
        {
            id: 'parked_car', label: 'รถที่จอดอยู่',
            x: '70%', y: '35%', w: '20%', h: '25%',
            interactions: [
                { condition: () => true, text: 'มีเงาอะไรบางอย่างอยู่ในรถ...', choices: [
                    { text: 'เปิดประตูรถ', action: (s) => s.die('สิ่งในรถออกมา...') },
                    { text: 'ถอยออกมา', action: null }
                ]}
            ]
        },
        {
            id: 'bus_stop', label: 'ป้ายหยุดรถ (ฝั่งตรงข้าม)',
            x: '10%', y: '25%', w: '15%', h: '35%',
            interactions: [
                { condition: () => true, text: 'ป้ายหยุดรถฝั่งตรงข้ามถนน แสงสปอตไลต์ส่อง — จุดหมายปลายทาง ต้องข้ามถนนให้ถูกวิธี', action: null }
            ]
        },
        {
            id: 'cross_road', label: 'ข้ามถนน',
            x: '15%', y: '55%', w: '50%', h: '25%',
            interactions: [
                { condition: (s) => !s.flags.signal_ready, text: 'ยังข้ามไม่ได้ ต้องรอสัญญาณไฟก่อน', action: null },
                { condition: (s) => s.flags.signal_ready, text: 'สัญญาณพร้อมแล้ว ข้ามได้ — จำไว้: เดิน อย่าวิ่ง อย่าหันกลับ', action: (s) => s.showRoadCrossing() }
            ]
        }
    ]
};
