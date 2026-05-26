import { useState, useRef, useCallback, useEffect } from "react";

// ─── LESSONS ─────────────────────────────────────────────────────────────────
const LESSONS = {
  "Binary Search": {
    array: [3, 7, 12, 18, 24, 31, 45, 56, 67, 78],
    target: 31,
    steps: [
      {
        lo:0, hi:9, mid:-1, found:-1, eliminated:[],
        desc:"We have a sorted array of 10 numbers. We want to find 31.",
        sub:"lo = 0, hi = 9. Search space = entire array.",
        code:"lo = 0;  hi = arr.length - 1;"
      },
      {
        lo:0, hi:9, mid:4, found:-1, eliminated:[],
        desc:"mid = ⌊(0+9)/2⌋ = 4. Middle element is arr[4] = 24.",
        sub:"Is 24 === 31? No. Is 24 < 31? Yes → go right.",
        code:"mid = Math.floor((lo + hi) / 2);  // mid = 4"
      },
      {
        lo:5, hi:9, mid:4, found:-1, eliminated:[0,1,2,3,4],
        desc:"24 < 31 so target is in the right half. Move lo = mid+1 = 5.",
        sub:"Left half [0..4] eliminated. Search space halved.",
        code:"lo = mid + 1;  // lo = 5"
      },
      {
        lo:5, hi:9, mid:7, found:-1, eliminated:[0,1,2,3,4],
        desc:"mid = ⌊(5+9)/2⌋ = 7. Middle element is arr[7] = 56.",
        sub:"Is 56 === 31? No. Is 56 > 31? Yes → go left.",
        code:"mid = Math.floor((lo + hi) / 2);  // mid = 7"
      },
      {
        lo:5, hi:6, mid:7, found:-1, eliminated:[0,1,2,3,4,7,8,9],
        desc:"56 > 31 so target is in the left half. Move hi = mid-1 = 6.",
        sub:"Right half [7..9] eliminated. Almost there.",
        code:"hi = mid - 1;  // hi = 6"
      },
      {
        lo:5, hi:6, mid:5, found:-1, eliminated:[0,1,2,3,4,7,8,9],
        desc:"mid = ⌊(5+6)/2⌋ = 5. Middle element is arr[5] = 31.",
        sub:"Is 31 === 31? YES! Found it!",
        code:"mid = Math.floor((lo + hi) / 2);  // mid = 5"
      },
      {
        lo:5, hi:6, mid:5, found:5, eliminated:[0,1,2,3,4,7,8,9],
        desc:"🎉 Found 31 at index 5! Only 3 comparisons for 10 elements.",
        sub:"Linear search would need up to 10 checks. Binary search needed 3. That's O(log n).",
        code:"if (arr[mid] === target) return mid;  // return 5"
      },
    ]
  },
  "Bubble Sort": {
    array: [64, 34, 25, 12, 22, 11, 90],
    target: null,
    steps: [
      {
        arr:[64,34,25,12,22,11,90], sorted:[], comparing:[-1,-1], swapped:false, pass:0,
        desc:"Unsorted array. Bubble sort compares adjacent pairs and swaps if left > right.",
        sub:"We'll bubble the largest element to the end each pass.",
        code:"// Start of Bubble Sort"
      },
      {
        arr:[64,34,25,12,22,11,90], sorted:[], comparing:[0,1], swapped:false, pass:1,
        desc:"Pass 1 — Compare arr[0]=64 and arr[1]=34.",
        sub:"64 > 34 → swap!",
        code:"if (arr[j] > arr[j+1]) swap(arr, j, j+1);"
      },
      {
        arr:[34,64,25,12,22,11,90], sorted:[], comparing:[0,1], swapped:true, pass:1,
        desc:"Swapped! 34 moves left, 64 moves right.",
        sub:"Array: [34, 64, 25, 12, 22, 11, 90]",
        code:"// Swap done"
      },
      {
        arr:[34,64,25,12,22,11,90], sorted:[], comparing:[1,2], swapped:false, pass:1,
        desc:"Compare arr[1]=64 and arr[2]=25.",
        sub:"64 > 25 → swap!",
        code:"if (arr[j] > arr[j+1]) swap(arr, j, j+1);"
      },
      {
        arr:[34,25,64,12,22,11,90], sorted:[], comparing:[1,2], swapped:true, pass:1,
        desc:"Swapped! 25 moves left, 64 bubbles right.",
        sub:"Array: [34, 25, 64, 12, 22, 11, 90]",
        code:"// Swap done"
      },
      {
        arr:[34,25,12,64,22,11,90], sorted:[], comparing:[2,3], swapped:true, pass:1,
        desc:"64 > 12 → swap! 64 keeps bubbling right.",
        sub:"Array: [34, 25, 12, 64, 22, 11, 90]",
        code:"if (arr[j] > arr[j+1]) swap(arr, j, j+1);"
      },
      {
        arr:[34,25,12,22,64,11,90], sorted:[], comparing:[3,4], swapped:true, pass:1,
        desc:"64 > 22 → swap! Still bubbling.",
        sub:"Array: [34, 25, 12, 22, 64, 11, 90]",
        code:"if (arr[j] > arr[j+1]) swap(arr, j, j+1);"
      },
      {
        arr:[34,25,12,22,11,64,90], sorted:[], comparing:[4,5], swapped:true, pass:1,
        desc:"64 > 11 → swap!",
        sub:"Array: [34, 25, 12, 22, 11, 64, 90]",
        code:"if (arr[j] > arr[j+1]) swap(arr, j, j+1);"
      },
      {
        arr:[34,25,12,22,11,64,90], sorted:[], comparing:[5,6], swapped:false, pass:1,
        desc:"Compare arr[5]=64 and arr[6]=90. 64 < 90 → no swap.",
        sub:"90 is already at the end. End of pass 1.",
        code:"// No swap needed"
      },
      {
        arr:[34,25,12,22,11,64,90], sorted:[6], comparing:[-1,-1], swapped:false, pass:1,
        desc:"Pass 1 complete! Largest element 90 is now in its final position.",
        sub:"One element sorted. 6 more passes needed at most.",
        code:"// 90 is settled at index 6"
      },
      {
        arr:[25,12,22,11,34,64,90], sorted:[5,6], comparing:[-1,-1], swapped:false, pass:3,
        desc:"After pass 3 — 34 and 64 are also settled.",
        sub:"Sorted portion grows from the right each pass.",
        code:"// Fast-forward to pass 3 result"
      },
      {
        arr:[11,12,22,25,34,64,90], sorted:[0,1,2,3,4,5,6], comparing:[-1,-1], swapped:false, pass:6,
        desc:"🎉 Fully sorted! [11, 12, 22, 25, 34, 64, 90]",
        sub:"Bubble sort is O(n²) time — great for learning, not for production.",
        code:"// Array fully sorted"
      },
    ]
  },
  "Linear Search": {
    array: [15, 42, 8, 73, 29, 56, 11, 88],
    target: 56,
    steps: [
      {
        current:-1, found:-1, checked:[],
        desc:"Unsorted array. We want to find 56. Linear search checks every element one by one.",
        sub:"No sorting needed — works on any array.",
        code:"for (let i = 0; i < arr.length; i++) {"
      },
      {
        current:0, found:-1, checked:[0],
        desc:"Check index 0 — arr[0] = 15. Is 15 === 56? No.",
        sub:"Move to next.",
        code:"if (arr[0] === 56) return 0;  // 15 ≠ 56"
      },
      {
        current:1, found:-1, checked:[0,1],
        desc:"Check index 1 — arr[1] = 42. Is 42 === 56? No.",
        sub:"Move to next.",
        code:"if (arr[1] === 56) return 1;  // 42 ≠ 56"
      },
      {
        current:2, found:-1, checked:[0,1,2],
        desc:"Check index 2 — arr[2] = 8. Is 8 === 56? No.",
        sub:"Move to next.",
        code:"if (arr[2] === 56) return 2;  // 8 ≠ 56"
      },
      {
        current:3, found:-1, checked:[0,1,2,3],
        desc:"Check index 3 — arr[3] = 73. Is 73 === 56? No.",
        sub:"Move to next.",
        code:"if (arr[3] === 56) return 3;  // 73 ≠ 56"
      },
      {
        current:4, found:-1, checked:[0,1,2,3,4],
        desc:"Check index 4 — arr[4] = 29. Is 29 === 56? No.",
        sub:"Move to next.",
        code:"if (arr[4] === 56) return 4;  // 29 ≠ 56"
      },
      {
        current:5, found:5, checked:[0,1,2,3,4,5],
        desc:"🎉 Check index 5 — arr[5] = 56. Is 56 === 56? YES! Found it!",
        sub:"Took 6 comparisons. Worst case = n comparisons. That's O(n).",
        code:"if (arr[5] === 56) return 5;  // FOUND!"
      },
    ]
  }
};

const SPEEDS = { slow:1200, medium:600, fast:150 };

function getBoxColor(lessonKey :string, step : any , i:number) {
  if (lessonKey === "Binary Search") {
    if (step.found === i) return { bg:"#E1F5EE", border:"#1D9E75", text:"#085041", bold:true };
    if (step.eliminated?.includes(i)) return { bg:"#f4f4f4", border:"transparent", text:"#bbb", bold:false, dim:true };
    if (step.mid === i) return { bg:"#FAEEDA", border:"#EF9F27", text:"#633806", bold:true };
    if (i >= (step.lo||0) && i <= (step.hi||9)) return { bg:"#EEEDFE", border:"#534AB7", text:"#3C3489", bold:false };
    return { bg:"var(--color-background-secondary)", border:"var(--color-border-secondary)", text:"var(--color-text-secondary)", bold:false, dim:true };
  }
  if (lessonKey === "Bubble Sort") {
    //const arr = step.arr || LESSONS["Bubble Sort"].array;
    if (step.sorted?.includes(i)) return { bg:"#E1F5EE", border:"#1D9E75", text:"#085041", bold:true };
    if (step.comparing?.includes(i)) return { bg:step.swapped?"#FCEBEB":"#FAEEDA", border:step.swapped?"#E24B4A":"#EF9F27", text:step.swapped?"#791F1F":"#633806", bold:true };
    return { bg:"#EEEDFE", border:"#AFA9EC", text:"#3C3489", bold:false };
  }
  if (lessonKey === "Linear Search") {
    if (step.found === i) return { bg:"#E1F5EE", border:"#1D9E75", text:"#085041", bold:true };
    if (step.current === i) return { bg:"#FAEEDA", border:"#EF9F27", text:"#633806", bold:true };
    if (step.checked?.includes(i)) return { bg:"#f4f4f4", border:"var(--color-border-secondary)", text:"#bbb", bold:false, dim:true };
    return { bg:"var(--color-background-secondary)", border:"var(--color-border-secondary)", text:"var(--color-text-secondary)", bold:false };
  }
  return { bg:"var(--color-background-secondary)", border:"var(--color-border-secondary)", text:"var(--color-text-secondary)", bold:false };
}

function getPointers(lessonKey :string, step : any , i:number) {
  const ptrs = [];
  if (lessonKey === "Binary Search") {
    if (i === step.lo && step.lo !== undefined) ptrs.push({ label:"lo", color:"#378ADD" });
    if (i === step.hi && step.hi !== undefined) ptrs.push({ label:"hi", color:"#D4537E" });
    if (i === step.mid && step.mid >= 0) ptrs.push({ label:"mid", color:"#EF9F27" });
    if (i === step.found && step.found >= 0) ptrs.push({ label:"✓", color:"#1D9E75" });
  }
  if (lessonKey === "Bubble Sort") {
    const [c0, c1] = step.comparing || [-1,-1];
    if (i === c0) ptrs.push({ label:"j", color:"#EF9F27" });
    if (i === c1) ptrs.push({ label:"j+1", color:"#EF9F27" });
  }
  if (lessonKey === "Linear Search") {
    if (i === step.current) ptrs.push({ label:"i", color:"#EF9F27" });
    if (i === step.found && step.found >= 0) ptrs.push({ label:"✓", color:"#1D9E75" });
  }
  return ptrs;
}

export default function ArrayVisualEngine() {
  const [lessonKey, setLessonKey] = useState("Binary Search");
  const [idx, setIdx]             = useState(0);
  const [running, setRunning]     = useState(false);
  const [speed, setSpeed]         = useState("medium");
  const timerRef                  = useRef<number | null>(null);
  const idxRef                    = useRef(0);

const lesson = LESSONS[lessonKey as keyof typeof LESSONS];
  const steps  = lesson.steps;
  const cur    = steps[idx];

  const reset = useCallback(() => { if (timerRef.current) clearInterval(timerRef.current);
     setRunning(false); 
    setIdx(0); 
    idxRef.current = 0;
  }, []);

  useEffect(() => { reset(); }, [lessonKey, reset]);
 useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);
  
  const advance = useCallback(() => {
    const next = idxRef.current + 1;
    if (next >= steps.length) {  if (timerRef.current) clearInterval(timerRef.current);  setRunning(false); return false; }
    idxRef.current = next; setIdx(next);
    return next < steps.length - 1;
  }, [steps]);

  const startAuto = useCallback(() => {
    setRunning(true);
    timerRef.current = window.setInterval(() => {
      const more = advance();
       if (!more && timerRef.current) { 
        clearInterval(timerRef.current); setRunning(false); }
    }, SPEEDS[speed as keyof typeof SPEEDS]);
  }, [advance, speed]);

  const pause = () => {    if (timerRef.current) clearInterval(timerRef.current); 
 setRunning(false); };

  const prev = () => {
    if (idx > 0 && !running) { idxRef.current = idx-1; setIdx(idx-1); }
  };

  // get current display array
  const displayArray = lessonKey === "Bubble Sort"
    ? ((cur as any).arr || lesson.array): lesson.array;
  const progress = Math.round(idx / (steps.length - 1) * 100);

  return (
    <div style={{ fontFamily:"var(--font-sans)", padding:"16px 0" }}>

      {/* Header */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:14, flexWrap:"wrap", gap:8 }}>
        <div>
          <div style={{ fontSize:15, fontWeight:500, color:"var(--color-text-primary)" }}>
            Visual Engine — Array
          </div>
          <div style={{ fontSize:12, color:"var(--color-text-secondary)" }}>
            Step through algorithms on a simple number array
          </div>
        </div>
        <div style={{ display:"flex", gap:8, alignItems:"center", flexWrap:"wrap" }}>
          <select value={lessonKey} onChange={e => setLessonKey(e.target.value)}
            style={{ fontSize:13, padding:"4px 8px" }}>
            {Object.keys(LESSONS).map(k => <option key={k}>{k}</option>)}
          </select>
          <select value={speed} onChange={e => setSpeed(e.target.value)}
            style={{ fontSize:13, padding:"4px 8px" }}>
            <option value="slow">Slow</option>
            <option value="medium">Medium</option>
            <option value="fast">Fast</option>
          </select>
          {lesson.target !== null && (
            <span style={{ fontSize:12, background:"#EEEDFE", color:"#534AB7", padding:"4px 10px", borderRadius:20, fontWeight:500 }}>
              Target: {lesson.target}
            </span>
          )}
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:14 }}>
        <div style={{ flex:1, height:5, background:"var(--color-background-secondary)", borderRadius:3, overflow:"hidden" }}>
          <div style={{ height:"100%", background:"#534AB7", borderRadius:3, width:`${progress}%`, transition:"width .35s" }}/>
        </div>
        <span style={{ fontSize:11, color:"var(--color-text-secondary)", whiteSpace:"nowrap" }}>Step {idx+1} / {steps.length}</span>
      </div>

      {/* ── ARRAY VISUAL ─────────────────────────────────────────── */}
      <div style={{ background:"var(--color-background-secondary)", borderRadius:"var(--border-radius-lg)",
        border:"0.5px solid var(--color-border-tertiary)", padding:"20px 16px 14px", marginBottom:14, overflowX:"auto" }}>

        {/* Pointer labels row */}
        <div style={{ display:"flex", gap:6, marginBottom:6, paddingBottom:2 }}>
          {displayArray.map((_: any, i: number) => {
            const ptrs = getPointers(lessonKey, cur, i);
            return (
              <div key={i} style={{ flex:1, minWidth:44, display:"flex", flexDirection:"column", alignItems:"center", gap:2 }}>
                {ptrs.map(p => (
                  <span key={p.label} style={{ fontSize:10, fontWeight:700, color:p.color,
                    background:`${p.color}22`, padding:"1px 5px", borderRadius:8, whiteSpace:"nowrap",
                    border:`1px solid ${p.color}`, lineHeight:1.4 }}>
                    {p.label}
                  </span>
                ))}
                {ptrs.length === 0 && <span style={{ fontSize:10, color:"transparent" }}>·</span>}
              </div>
            );
          })}
        </div>

        {/* Boxes */}
        <div style={{ display:"flex", gap:6 }}>
          {displayArray.map((val:any, i:number) => {
            const c = getBoxColor(lessonKey, cur, i);
            return (
              <div key={i} style={{ flex:1, minWidth:44, height:52, display:"flex", alignItems:"center",
                justifyContent:"center", borderRadius:10, border:`2px solid ${c.border}`,
                background:c.bg, transition:"all .3s ease",
                opacity:c.dim ? 0.3 : 1,
                transform: c.bold ? "scale(1.08)" : "scale(1)",
                boxShadow: c.bold ? `0 0 10px ${c.border}55` : "none" }}>
                <span style={{ fontSize:16, fontWeight:c.bold ? 700 : 500, color:c.text, transition:"color .3s" }}>
                  {val}
                </span>
              </div>
            );
          })}
        </div>

        {/* Index labels */}
        <div style={{ display:"flex", gap:6, marginTop:5 }}>
          {displayArray.map((_: any, i: number) => (
            <div key={i} style={{ flex:1, minWidth:44, textAlign:"center", fontSize:10, color:"var(--color-text-secondary)" }}>
              {i}
            </div>
          ))}
        </div>
      </div>

      {/* ── EXPLANATION + CODE + CONTROLS ────────────────────── */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:14 }}>

        {/* Explanation */}
        <div style={{ background:"var(--color-background-primary)", border:"0.5px solid var(--color-border-tertiary)",
          borderRadius:"var(--border-radius-lg)", padding:"14px 16px" }}>
          <div style={{ fontSize:11, fontWeight:600, color:"#534AB7", textTransform:"uppercase",
            letterSpacing:".05em", marginBottom:8 }}>What's happening</div>
          <div style={{ fontSize:13, color:"var(--color-text-primary)", lineHeight:1.75, marginBottom:6, fontWeight:500 }}>
            {cur.desc}
          </div>
          <div style={{ fontSize:12, color:"var(--color-text-secondary)", lineHeight:1.65, fontStyle:"italic" }}>
            {cur.sub}
          </div>
        </div>

        {/* Code highlight */}
        <div style={{ background:"#1a1a2e", borderRadius:"var(--border-radius-lg)", padding:"14px 16px" }}>
          <div style={{ fontSize:11, fontWeight:600, color:"#5F6E8A", textTransform:"uppercase",
            letterSpacing:".05em", marginBottom:10 }}>Current line</div>
          <div style={{ fontFamily:"monospace", fontSize:13, color:"#EEEDFE", lineHeight:2,
            background:"#534AB7", padding:"6px 10px", borderRadius:6 }}>
            {cur.code}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div style={{ display:"flex", gap:10, marginBottom:14, flexWrap:"wrap" }}>
        {lessonKey === "Binary Search" && [
          { color:"#534AB7", label:"Active range" },
          { color:"#EF9F27", label:"mid" },
          { color:"#378ADD", label:"lo" },
          { color:"#D4537E", label:"hi" },
          { color:"#1D9E75", label:"Found!" },
          { color:"#ccc",    label:"Eliminated" },
        ].map(({color,label}) => (
          <div key={label} style={{ display:"flex", alignItems:"center", gap:5, fontSize:11, color:"var(--color-text-secondary)" }}>
            <div style={{ width:12, height:12, borderRadius:3, background:color }}/>
            {label}
          </div>
        ))}
        {lessonKey === "Bubble Sort" && [
          { color:"#EF9F27", label:"Comparing" },
          { color:"#E24B4A", label:"Swapping" },
          { color:"#1D9E75", label:"Sorted" },
          { color:"#AFA9EC", label:"Unsorted" },
        ].map(({color,label}) => (
          <div key={label} style={{ display:"flex", alignItems:"center", gap:5, fontSize:11, color:"var(--color-text-secondary)" }}>
            <div style={{ width:12, height:12, borderRadius:3, background:color }}/>
            {label}
          </div>
        ))}
        {lessonKey === "Linear Search" && [
          { color:"#EF9F27", label:"Checking now" },
          { color:"#1D9E75", label:"Found!" },
          { color:"#ccc",    label:"Already checked" },
          { color:"#AFA9EC", label:"Not yet" },
        ].map(({color,label}) => (
          <div key={label} style={{ display:"flex", alignItems:"center", gap:5, fontSize:11, color:"var(--color-text-secondary)" }}>
            <div key={label} style={{ width:12, height:12, borderRadius:3, background:color }}/>
            {label}
          </div>
        ))}
      </div>

      {/* Controls */}
      <div style={{ display:"flex", gap:8, alignItems:"center", flexWrap:"wrap" }}>
        <button onClick={reset}
          style={{ fontSize:13, padding:"6px 14px", border:"0.5px solid var(--color-border-secondary)", borderRadius:8, background:"transparent", cursor:"pointer" }}>
          ↺ Reset
        </button>
        <button onClick={prev} disabled={idx===0||running}
          style={{ fontSize:13, padding:"6px 14px", border:"0.5px solid var(--color-border-secondary)", borderRadius:8, background:"transparent", cursor:"pointer", opacity:idx===0?.4:1 }}>
          ← Prev
        </button>
        {!running
          ? <button onClick={startAuto} disabled={idx>=steps.length-1}
              style={{ fontSize:13, padding:"6px 20px", background:"#534AB7", color:"#EEEDFE", border:"none", borderRadius:8, fontWeight:500, cursor:"pointer", opacity:idx>=steps.length-1?.4:1 }}>
              ▶ Auto
            </button>
          : <button onClick={pause}
              style={{ fontSize:13, padding:"6px 20px", background:"#EF9F27", color:"#412402", border:"none", borderRadius:8, fontWeight:500, cursor:"pointer" }}>
              ⏸ Pause
            </button>
        }
        <button onClick={() => { if (!running) advance(); }} disabled={running||idx>=steps.length-1}
          style={{ fontSize:13, padding:"6px 20px", background:"var(--color-background-secondary)", border:"0.5px solid var(--color-border-secondary)", borderRadius:8, cursor:"pointer", fontWeight:500, opacity:idx>=steps.length-1?.4:1 }}>
          Step →
        </button>
      </div>
    </div>
  );
}
