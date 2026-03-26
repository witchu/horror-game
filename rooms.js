/* ===========================
   WAKE — Room Definitions
   =========================== */

const ITEMS = {
    key_small: {
        id: 'key_small',
        name: 'กุญแจเล็ก',
        icon: '🔑',
        description: 'กุญแจเล็กๆ เก่าๆ มีสนิมเกาะเล็กน้อย น่าจะเปิดอะไรบางอย่างได้'
    },
    matchstick: {
        id: 'matchstick',
        name: 'ไม้ขีดไฟ',
        icon: '🔥',
        description: 'กล่องไม้ขีดไฟเก่า เหลืออยู่ไม่กี่ก้าน แต่ยังจุดได้'
    },
    doorknob: {
        id: 'doorknob',
        name: 'ลูกบิดประตู',
        icon: '🚪',
        description: 'ลูกบิดประตูโลหะ ดูเหมือนหลุดออกมาจากประตูห้องน้ำ'
    },
    flashlight: {
        id: 'flashlight',
        name: 'ไฟฉาย',
        icon: '🔦',
        description: 'ไฟฉายขนาดเล็ก แบตเตอรี่ยังมีอยู่ ส่องได้สว่างพอ'
    },
    old_journal: {
        id: 'old_journal',
        name: 'สมุดบันทึกเก่า',
        icon: '📒',
        description: 'สมุดบันทึกที่เขียนด้วยลายมือสั่นๆ เนื้อหาส่วนใหญ่อ่านไม่ออก แต่มีบางหน้าที่ยังพอเห็นข้อความ'
    },
    paper_scrap: {
        id: 'paper_scrap',
        name: 'เศษกระดาษ',
        icon: '📄',
        description: 'กระดาษชิ้นเล็กฉีกขาด มีข้อความเขียนว่า "ขวดที่สาม นับจากซ้าย เท่านั้นที่ปลอดภัย"'
    }
};

const WARDROBE_CODE = '472';
const GATE_DIGIT_1 = '3';
const GATE_DIGIT_2 = '7';

const ROOMS = {
    bedroom: {
        id: 'bedroom',
        name: '🛏 ห้องนอน',
        background: 'assets/bedroom.png',
        flickering: false,
        description: 'ห้องนอนเล็กๆ ชั้นสอง แสงเช้าสีเทาลอดผ่านม่านที่ปิดสนิท เสียงบ้านเงียบผิดปกติ',
        hotspots: [
            {
                id: 'bed_pillow',
                label: 'หมอน',
                x: '22%', y: '38%', w: '14%', h: '12%',
                interactions: [
                    {
                        condition: (state) => !state.flags.found_key_small,
                        text: 'คุณพลิกหมอนขึ้น... มีกุญแจเล็กๆ ซ่อนอยู่ข้างใต้',
                        action: (state) => {
                            state.addItem('key_small');
                            state.setFlag('found_key_small', true);
                            state.addJournal('🔑 พบกุญแจเล็กใต้หมอน — น่าจะเปิดอะไรบางอย่างได้');
                        }
                    },
                    {
                        condition: (state) => state.flags.found_key_small,
                        text: 'ใต้หมอนไม่มีอะไรแล้ว',
                        action: null
                    }
                ]
            },
            {
                id: 'nightstand',
                label: 'โต๊ะข้างเตียง',
                x: '38%', y: '35%', w: '10%', h: '18%',
                interactions: [
                    {
                        condition: (state) => !state.flags.found_matchstick,
                        text: 'คุณเปิดลิ้นชักโต๊ะข้างเตียง... พบกล่องไม้ขีดไฟและสมุดบันทึกเก่า',
                        action: (state) => {
                            state.addItem('matchstick');
                            state.addItem('old_journal');
                            state.setFlag('found_matchstick', true);
                            state.addJournal('📒 พบสมุดบันทึกเก่า — มีข้อความเขียนว่า "อย่าไว้ใจภาพสะท้อน"');
                            state.addJournal('🔥 พบไม้ขีดไฟ — อาจใช้ส่องที่มืดได้');
                        }
                    },
                    {
                        condition: (state) => state.flags.found_matchstick,
                        text: 'ลิ้นชักว่างเปล่าแล้ว',
                        action: null
                    }
                ]
            },
            {
                id: 'alarm_clock',
                label: 'นาฬิกาปลุก',
                x: '40%', y: '32%', w: '6%', h: '8%',
                interactions: [
                    {
                        condition: (state) => !state.flags.checked_clock,
                        text: 'นาฬิกาหยุดเดินที่เวลา ' + GATE_DIGIT_1 + ':00 — ตัวเลขถูกเน้นด้วยหมึกแดง',
                        action: (state) => {
                            state.setFlag('checked_clock', true);
                            state.addJournal('⏰ นาฬิกาปลุกหยุดที่ ' + GATE_DIGIT_1 + ':00 — เลข ' + GATE_DIGIT_1 + ' ถูกเน้นด้วยหมึกแดง (รหัสหลักที่ 1?)');
                        }
                    },
                    {
                        condition: (state) => state.flags.checked_clock,
                        text: 'นาฬิกายังคงหยุดที่ ' + GATE_DIGIT_1 + ':00',
                        action: null
                    }
                ]
            },
            {
                id: 'under_bed',
                label: 'ใต้เตียง',
                x: '18%', y: '55%', w: '18%', h: '10%',
                interactions: [
                    {
                        condition: (state) => !state.hasItem('matchstick') && !state.flags.found_doorknob,
                        text: 'ใต้เตียงมืดมาก คุณเอื้อมมือเข้าไป...',
                        choices: [
                            {
                                text: 'เอื้อมมือเข้าไปเลย',
                                action: (state) => {
                                    state.die('มีอะไรบางอย่างจับมือคุณไว้แน่น... แล้วดึงเข้าไปในความมืด');
                                }
                            },
                            {
                                text: 'ถอยออกมา',
                                action: null
                            }
                        ]
                    },
                    {
                        condition: (state) => state.hasItem('matchstick') && !state.flags.found_doorknob,
                        text: 'คุณจุดไม้ขีดไฟส่องใต้เตียง... เห็นลูกบิดประตูกลิ้งอยู่ในมุม',
                        action: (state) => {
                            state.addItem('doorknob');
                            state.setFlag('found_doorknob', true);
                            state.addJournal('🚪 พบลูกบิดประตูใต้เตียง — ดูเหมือนหลุดมาจากประตูห้องน้ำ');
                        }
                    },
                    {
                        condition: (state) => state.flags.found_doorknob,
                        text: 'ใต้เตียงว่างเปล่า มีแค่ฝุ่น',
                        action: null
                    }
                ]
            },
            {
                id: 'wardrobe',
                label: 'ตู้เสื้อผ้า',
                x: '60%', y: '18%', w: '15%', h: '48%',
                interactions: [
                    {
                        condition: (state) => !state.flags.wardrobe_opened && !state.flags.has_wardrobe_code,
                        text: 'ตู้เสื้อผ้ามีแม่กุญแจรหัส 3 หลัก คุณยังไม่รู้รหัส...',
                        action: null
                    },
                    {
                        condition: (state) => !state.flags.wardrobe_opened && state.flags.has_wardrobe_code,
                        text: 'ตู้เสื้อผ้ามีแม่กุญแจรหัส 3 หลัก — คุณจำรหัสที่เห็นในกระจกห้องน้ำได้',
                        action: (state) => {
                            state.showCodeInput();
                        }
                    },
                    {
                        condition: (state) => state.flags.wardrobe_opened,
                        text: 'ตู้เสื้อผ้าเปิดอยู่ มีเสื้อผ้าเก่าๆ ไม่มีอะไรเหลือแล้ว',
                        action: null
                    }
                ]
            },
            {
                id: 'mirror_bedroom',
                label: 'กระจกแต่งตัว',
                x: '78%', y: '22%', w: '8%', h: '38%',
                interactions: [
                    {
                        condition: () => true,
                        text: 'คุณมองกระจก... ภาพสะท้อนของคุณยิ้มทั้งที่คุณไม่ได้ยิ้ม',
                        action: (state) => {
                            state.startMirrorStare('bedroom');
                        }
                    }
                ]
            },
            {
                id: 'window',
                label: 'หน้าต่าง',
                x: '34%', y: '12%', w: '12%', h: '28%',
                interactions: [
                    {
                        condition: () => true,
                        text: 'หน้าต่างล็อคจากข้างนอก ไม่สามารถเปิดได้ แสงที่ส่องเข้ามาดูผิดเวลา — เหมือนเป็นเช้าที่ไม่เคยสิ้นสุด',
                        action: null
                    }
                ]
            },
            {
                id: 'door_bathroom',
                label: 'ประตูห้องน้ำ',
                x: '2%', y: '15%', w: '10%', h: '50%',
                interactions: [
                    {
                        condition: (state) => state.flags.bathroom_unlocked,
                        text: null,
                        action: (state) => {
                            state.goToRoom('bathroom');
                        }
                    },
                    {
                        condition: (state) => !state.hasItem('doorknob') && !state.flags.bathroom_unlocked,
                        text: 'ประตูห้องน้ำไม่มีลูกบิด เปิดไม่ได้ ต้องหาลูกบิดก่อน',
                        action: null
                    },
                    {
                        condition: (state) => state.hasItem('doorknob'),
                        text: 'คุณติดลูกบิดเข้ากับประตูแล้วหมุน... ประตูเปิดออก',
                        action: (state) => {
                            state.removeItem('doorknob');
                            state.setFlag('bathroom_unlocked', true);
                            state.goToRoom('bathroom');
                        }
                    }
                ]
            },
            {
                id: 'door_hallway',
                label: 'ประตูโถงทางเดิน',
                x: '88%', y: '15%', w: '10%', h: '50%',
                interactions: [
                    {
                        condition: (state) => !state.hasItem('flashlight'),
                        text: 'ประตูออกสู่โถงทางเดิน มืดสนิทข้างนอก ต้องมีไฟฉายก่อน',
                        action: null
                    },
                    {
                        condition: (state) => state.hasItem('flashlight'),
                        text: 'คุณส่องไฟฉายออกไป... แสงส่องเห็นบันไดยาว',
                        action: (state) => {
                            state.showDemoEnd();
                        }
                    }
                ]
            }
        ]
    },

    bathroom: {
        id: 'bathroom',
        name: '🚿 ห้องน้ำ',
        background: 'assets/bathroom.png',
        flickering: true,
        description: 'กระเบื้องสีขาวมีรอยร้าว น้ำในอ่างขังสีน้ำตาล หลอดไฟกะพริบ',
        hotspots: [
            {
                id: 'light_switch',
                label: 'สวิตช์ไฟ',
                x: '2%', y: '25%', w: '6%', h: '10%',
                interactions: [
                    {
                        condition: (state) => !state.flags.bathroom_lights_off,
                        text: 'คุณปิดไฟ... ห้องมืดลง มีเพียงแสงจางๆ จากช่องระบายอากาศ',
                        action: (state) => {
                            state.setFlag('bathroom_lights_off', true);
                            state.setRoomDark(true);
                        }
                    },
                    {
                        condition: (state) => state.flags.bathroom_lights_off,
                        text: 'คุณเปิดไฟ... หลอดไฟกะพริบสักครู่แล้วสว่างขึ้น',
                        action: (state) => {
                            state.setFlag('bathroom_lights_off', false);
                            state.setRoomDark(false);
                        }
                    }
                ]
            },
            {
                id: 'mirror_bathroom',
                label: 'กระจก',
                x: '18%', y: '10%', w: '18%', h: '30%',
                interactions: [
                    {
                        condition: (state) => state.flags.bathroom_lights_off && !state.flags.has_wardrobe_code,
                        text: 'ในความมืด... กระจกเรืองแสงสีเขียวจางๆ ปรากฏตัวเลข 3 หลัก: "' + WARDROBE_CODE + '" เขียนด้วยหมึกเรืองแสง!',
                        action: (state) => {
                            state.setFlag('has_wardrobe_code', true);
                            state.addJournal('🔢 เห็นรหัส "' + WARDROBE_CODE + '" บนกระจกห้องน้ำเมื่อปิดไฟ — น่าจะเป็นรหัสตู้เสื้อผ้าในห้องนอน');
                        }
                    },
                    {
                        condition: (state) => state.flags.bathroom_lights_off && state.flags.has_wardrobe_code,
                        text: 'รหัส "' + WARDROBE_CODE + '" ยังคงเรืองแสงอยู่บนกระจก',
                        action: null
                    },
                    {
                        condition: (state) => !state.flags.bathroom_lights_off,
                        text: 'คุณมองกระจก... ภาพสะท้อนเคลื่อนไหวช้ากว่าคุณเล็กน้อย',
                        action: (state) => {
                            state.startMirrorStare('bathroom');
                        }
                    }
                ]
            },
            {
                id: 'sink',
                label: 'อ่างล้างหน้า',
                x: '20%', y: '42%', w: '16%', h: '15%',
                interactions: [
                    {
                        condition: (state) => !state.flags.sink_used,
                        text: 'คุณเปิดก๊อกน้ำ... น้ำสีแดงข้นไหลออกมา 3 วินาที แล้วค่อยๆ ใสขึ้น',
                        action: (state) => {
                            state.setFlag('sink_used', true);
                            state.addJournal('🚰 น้ำแดงจากอ่างล้างหน้า — ดูเหมือนเลือดสักครู่ก่อนจะใส');
                        }
                    },
                    {
                        condition: (state) => state.flags.sink_used,
                        text: 'น้ำไหลใสปกติแล้ว แต่คราบแดงยังเกาะอ่างอยู่',
                        action: null
                    }
                ]
            },
            {
                id: 'medicine_cabinet',
                label: 'ตู้ยา',
                x: '40%', y: '12%', w: '12%', h: '24%',
                interactions: [
                    {
                        condition: (state) => !state.hasItem('key_small') && !state.flags.cabinet_opened,
                        text: 'ตู้ยาล็อคอยู่ ต้องมีกุญแจเปิด',
                        choices: [
                            {
                                text: 'ลองงัดเปิด',
                                action: (state) => {
                                    state.die('คุณพยายามงัดตู้ยา... มือคุณติดค้าง มีอะไรบางอย่างดึงจากข้างใน');
                                }
                            },
                            {
                                text: 'ปล่อยไว้ก่อน',
                                action: null
                            }
                        ]
                    },
                    {
                        condition: (state) => state.hasItem('key_small') && !state.flags.cabinet_opened,
                        text: 'คุณใช้กุญแจเล็กเปิดตู้ยา... ข้างในมีขวดยา 5 ขวด',
                        action: (state) => {
                            state.removeItem('key_small');
                            state.setFlag('cabinet_opened', true);
                            state.showBottleSelection();
                        }
                    },
                    {
                        condition: (state) => state.flags.cabinet_opened && !state.flags.found_digit2,
                        text: 'ตู้ยาเปิดอยู่ มีขวดยาหลายขวด',
                        action: (state) => {
                            state.showBottleSelection();
                        }
                    },
                    {
                        condition: (state) => state.flags.cabinet_opened && state.flags.found_digit2,
                        text: 'ตู้ยาว่างเปล่า ขวดยาถูกนำออกไปหมดแล้ว',
                        action: null
                    }
                ]
            },
            {
                id: 'floor_crack',
                label: 'รอยร้าวบนพื้น',
                x: '30%', y: '75%', w: '20%', h: '10%',
                interactions: [
                    {
                        condition: (state) => !state.flags.found_paper_scrap,
                        text: 'คุณก้มลงดูรอยร้าวบนพื้น... มีเศษกระดาษยัดอยู่ในร่อง',
                        action: (state) => {
                            state.addItem('paper_scrap');
                            state.setFlag('found_paper_scrap', true);
                            state.addJournal('📄 พบเศษกระดาษ — เขียนว่า "ขวดที่สาม นับจากซ้าย เท่านั้นที่ปลอดภัย"');
                        }
                    },
                    {
                        condition: (state) => state.flags.found_paper_scrap,
                        text: 'รอยร้าวบนพื้น ไม่มีอะไรเหลือแล้ว',
                        action: null
                    }
                ]
            },
            {
                id: 'shower',
                label: 'ฝักบัว',
                x: '65%', y: '15%', w: '18%', h: '55%',
                interactions: [
                    {
                        condition: (state) => !state.flags.shower_done,
                        text: 'ฝักบัวเก่าๆ มีวาล์วน้ำร้อนและน้ำเย็น คุณจะเปิดอะไรก่อน?',
                        action: (state) => {
                            state.showShowerPuzzle();
                        }
                    },
                    {
                        condition: (state) => state.flags.shower_done,
                        text: 'ฝักบัวยังเปิดอยู่ น้ำเย็นไหลเบาๆ ห้องน้ำดูสะอาดขึ้นเล็กน้อย',
                        action: null
                    }
                ]
            },
            {
                id: 'door_back_bedroom',
                label: 'กลับห้องนอน',
                x: '88%', y: '20%', w: '10%', h: '45%',
                interactions: [
                    {
                        condition: () => true,
                        text: null,
                        action: (state) => {
                            state.goToRoom('bedroom');
                        }
                    }
                ]
            }
        ]
    }
};

const BOTTLES = [
    { id: 1, label: 'ขวดที่ 1', desc: 'ยาสีน้ำเงิน เลขล็อต: 14', correct: false },
    { id: 2, label: 'ขวดที่ 2', desc: 'ยาสีเหลือง เลขล็อต: 29', correct: false },
    { id: 3, label: 'ขวดที่ 3', desc: 'ยาสีขาว เลขล็อต: ' + GATE_DIGIT_2, correct: true },
    { id: 4, label: 'ขวดที่ 4', desc: 'ยาสีแดง เลขล็อต: 51', correct: false },
    { id: 5, label: 'ขวดที่ 5', desc: 'ยาสีดำ เลขล็อต: 88', correct: false }
];
