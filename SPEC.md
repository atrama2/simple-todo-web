# Todo App

## 1. Overview

แอปจัดการงาน (Todo List) ที่เรียบง่าย รองรับการลาก-วาง (Drag & Drop) สำหรับเรียงลำดับงาน ออกแบบมาเพื่อใช้งานบนมือถือเป็นหลัก (Mobile-First) ข้อมูลถูกจัดเก็บในรูปแบบ JSON file

## 2. Tech Stack

- **Frontend**: Vanilla JavaScript (ES6+)
- **Styling**: CSS3 with CSS Variables
- **Storage**: JSON file (`data/tasks.json`) ผ่าน localStorage (สำหรับ browser) หรือ fs module (ถ้าใช้ Node.js)
- **Build**: ไม่ต้องการ build tool — เปิด HTML ได้เลย
- **Drag & Drop**: Native HTML5 Drag and Drop API

## 3. Features

### Must-have
- [x] ➕ เพิ่มงานใหม่ (Add task)
- [x] ✅ ทำเครื่องหมายงานเสร็จ (Complete task)
- [x] 🗑️ ลบงาน (Delete task)
- [x] 💾 บันทึกข้อมูลลง JSON (JSON Storage)
- [x] 📱 ออกแบบ Mobile-First UI
- [x] 🤚 ลาก-วาง เรียงลำดับงาน (Drag & Drop reordering)

### Nice-to-have
- [ ] แก้ไขชื่องาน (Edit task)
- [ ] กรองงาน (Filter: All / Active / Completed)
- [ ] นับจำนวนงานคงเหลือ (Pending count)

## 4. UI/UX Design

### Layout Structure (Mobile-First)

```
┌─────────────────────────┐
│         HEADER           │
│   📝 My Tasks (X left)   │
├─────────────────────────┤
│                         │
│    ┌─────────────────┐  │
│    │ ○ งานที่ 1    🗑️│  │  ← Draggable
│    └─────────────────┘  │
│    ┌─────────────────┐  │
│    │ ✓ งานที่ 2    🗑️│  │  ← Completed (faded)
│    └─────────────────┘  │
│                         │
├─────────────────────────┤
│  ┌─────────────────────┐ │
│  │ + เพิ่มงานใหม่... │ │  ← Input field
│  └─────────────────────┘ │
└─────────────────────────┘
```

- **Header**: ชื่อแอป + จำนวนงานที่ยังไม่เสร็จ
- **Task List**: รายการงาน ลาก-วางได้
- **Add Input**: ช่องเพิ่มงานใหม่

### Visual Design

**Color Palette**
| Color       | Hex       | Usage                    |
|-------------|-----------|--------------------------|
| Primary     | `#6366f1` | ปุ่มเพิ่มงาน, accent     |
| Background  | `#f8fafc` | พื้นหลังหลัก              |
| Card        | `#ffffff` | พื้นหลังการ์ดงาน          |
| Text        | `#1e293b` | ตัวอักษรหลัก              |
| Text Muted  | `#94a3b8` | ตัวอักษรรอง, placeholder |
| Success     | `#22c55e` | งานเสร็จแล้ว             |
| Danger      | `#ef4444` | ปุ่มลบ                    |
| Border      | `#e2e8f0` | เส้นขอบการ์ด              |

**Typography**
- Font Family: `system-ui, -apple-system, sans-serif`
- Heading: 1.5rem, font-weight: 700
- Body: 1rem, font-weight: 400
- Small: 0.875rem, font-weight: 400

**Spacing System**
- Base unit: 4px
- xs: 4px | sm: 8px | md: 16px | lg: 24px | xl: 32px

**Border & Shadow**
- Border radius: 8px (cards), 12px (input)
- Shadow: `0 1px 3px rgba(0,0,0,0.1)` (card), `0 4px 6px rgba(0,0,0,0.1)` (elevated)

### Responsive Breakpoints

| Breakpoint | Width      | Behavior                    |
|------------|------------|-----------------------------|
| Mobile     | < 640px    | เต็มจอ, padding 16px        |
| Tablet     | 640-1024px | max-width: 480px, centered  |
| Desktop    | > 1024px   | max-width: 480px, centered  |

## 5. Component Inventory

### TaskItem
- **Purpose**: แสดงรายการงานเดียว
- **States**:
  - Default: พื้นหลังขาว, checkbox ว่าง
  - Hover: พื้นหลังเทาอ่อน, แสดงปุ่มลบ
  - Completed: ตัวอักษรขีดฆ่า, checkbox ติก
  - Dragging: opacity 0.5, scale 1.02, shadow ชัด
  - Drag-over: border สี primary ด้านบน

### AddTaskInput
- **Purpose**: ช่องเพิ่มงานใหม่
- **States**:
  - Default: border เทาอ่อน, placeholder "เพิ่มงานใหม่..."
  - Focus: border สี primary, shadow glow
  - Submitting: disabled style

### TaskList
- **Purpose**: คอนเทนเนอร์หลักสำหรับรายการงาน
- **States**:
  - Empty: แสดงข้อความ "ยังไม่มีงาน"
  - Has items: แสดงรายการงานทั้งหมด
  - Dragging: แสดง drop zone indicator

### Header
- **Purpose**: แสดงชื่อแอปและจำนวนงาน
- **States**: Static (ไม่มี interaction)

## 6. Data Model

### Task Entity
```json
{
  "id": "uuid-v4",
  "title": "string (1-200 chars)",
  "completed": "boolean",
  "createdAt": "ISO 8601 timestamp",
  "order": "number (integer, 0-based)"
}
```

### JSON File Structure
```json
{
  "version": "1.0",
  "tasks": [
    {
      "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "title": "ซื้อข้าว",
      "completed": false,
      "createdAt": "2026-03-20T10:00:00.000Z",
      "order": 0
    }
  ]
}
```

### Storage Strategy
- **Browser (localStorage)**: Key = `todo-app-tasks`
- **File-based**: `data/tasks.json` (สำหรับ Electron หรือ Node.js)

## 7. File Structure

```
todo-app/
├── index.html
├── css/
│   └── styles.css
├── js/
│   ├── app.js          # Entry point, event listeners
│   ├── storage.js      # JSON read/write functions
│   ├── dragdrop.js     # Drag & Drop logic
│   └── components/
│       ├── TaskItem.js
│       ├── TaskList.js
│       └── AddTaskInput.js
├── data/
│   └── tasks.json
└── SPEC.md
```

## 8. Technical Notes

### Drag & Drop Implementation
1. ใช้ `draggable="true"` attribute บน TaskItem
2. จัดการ events: `dragstart`, `dragover`, `drop`, `dragenter`, `dragleave`, `dragend`
3. อัพเดต `order` field ของ tasks ที่เกี่ยวข้องเมื่อ drop
4. Re-render list หลังจาก drop เสร็จ

### Storage Operations
1. อ่าน tasks จาก localStorage เมื่อโหลดหน้า
2. เขียน tasks ลง localStorage ทุกครั้งที่มีการเปลี่ยนแปลง (add/complete/delete/reorder)
3. ใช้ debounce 300ms สำหรับการเขียน เพื่อลด I/O

### Validation
- Title ต้องไม่ว่างเปล่า
- Title ต้องไม่เกิน 200 ตัวอักษร
- แสดง error state ที่ input ถ้า validation fail

### Accessibility
- ใช้ `<button>` สำหรับ interactive elements
- ใช้ `aria-label` สำหรับปุ่มลบ, checkbox
- รองรับ keyboard navigation (Tab, Enter, Space)
- รองรับ screen reader

## 9. Interactions Detail

### Add Task Flow
1. User พิมพ์ชื่องานใน input
2. กด Enter หรือกดปุ่ม ➕
3. Task ใหม่ถูกเพิ่มที่ด้านล่างของ list
4. Input ถูก clear
5. JSON ถูกบันทึก

### Complete Task Flow
1. User กด checkbox หรือคลิกที่ task
2. Task เปลี่ยนสถานะ completed ↔ active
3. Visual feedback: ตัวอักษรขีดฆ่า, สีซีดลง
4. JSON ถูกบันทึก

### Delete Task Flow
1. User กดปุ่ม 🗑️ (แสดงเมื่อ hover หรือ mobile long-press)
2. Task ถูกลบทันที (ไม่มี confirm dialog)
3. List re-render
4. JSON ถูกบันทึก

### Drag & Drop Flow
1. User กดค้าง (long-press mobile) หรือ click-and-drag (desktop)
2. Task ที่ถูกลากมี visual feedback (opacity, scale)
3. User ลากไปตำแหน่งที่ต้องการ
4. Drop indicator แสดงตำแหน่งที่จะวาง
5. User ปล่อย — tasks ถูก reorder
6. JSON ถูกบันทึกพร้อม order ใหม่
