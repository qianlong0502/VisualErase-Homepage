"use strict";

// Columns: ACC, PEZ, MMA, RAB, P4D, UDA, CCE, TINA+, FID, CLIP x100.
// Source: ../latex/main.tex, the three main-result tables (2026-10-04).
const results = {
  style: {
    title: {en: "Van Gogh style erasure", zh: "梵高风格擦除"},
    note: {en: "VisualErase achieves 0% ASR across all seven attacks, including text-free TINA+, while retaining generation quality close to SD1.4. Style recovery is evaluated using a 129-class WikiArt classifier.", zh: "VisualErase 在全部七种攻击下均取得 0% ASR，包括无文本 TINA+，同时保持接近 SD1.4 的生成质量。风格恢复采用 WikiArt 129 类风格分类器评估。"},
    rows: [
      ["SD1.4",76,40,40,90,94,96,60,76,14,26.6],
      ["ESD",2,2,0,6,30,32,8,60,14.5,25.9],
      ["FMN",10,0,2,6,54,56,18,70,13.8,26.5],
      ["AC",12,0,6,14,68,77,14,72,14,26.5],
      ["MACE",4,0,0,4,42,56,26,72,12.4,23.5],
      ["SPM",42,5,14,48,78,88,36,74,14,26.6],
      ["RECE",18,0,14,20,62,64,40,72,13.8,26.6],
      ["AdvUnlearn",0,0,0,0,0,2,44,68,14.1,26.2],
      ["STEREO",0,0,0,0,0,0,4,46,15.8,26],
      ["VisualErase",0,0,0,0,0,0,0,0,14.7,26.5]
    ]
  },
  celebrity: {
    title: {en: "Taylor Swift identity erasure", zh: "Taylor Swift 身份擦除"},
    note: {en: "VisualErase reduces TINA+ ASR from 94% for STEREO to 6%, with FID close to SD1.4 and the highest CLIP score in the table. Identity recovery is evaluated using GCD Top-1 matching.", zh: "VisualErase 将 TINA+ ASR 从 STEREO 的 94% 降至 6%，FID 接近 SD1.4，且取得表中最高的 CLIP 分数。身份恢复采用 GCD Top-1 匹配评估。"},
    rows: [
      ["SD1.4",100,38,42,56,100,100,84,100,14,26.6],
      ["ESD",38,2,2,12,98,98,76,96,13,26.5],
      ["STEREO",0,0,0,0,0,0,0,94,18.3,24.6],
      ["VisualErase",0,0,0,4,4,8,0,6,13.8,26.7]
    ]
  },
  nudity: {
    title: {en: "Nudity erasure · semantic evaluation", zh: "裸体概念擦除 · 语义评估"},
    note: {en: "VisualErase achieves 0% ASR under six attacks and 0.1% under MMA, while preserving a CLIP score of 26.6. A VLM-based semantic evaluator determines whether recognizable explicit nudity is present.", zh: "VisualErase 在六种攻击下取得 0% ASR，MMA 下为 0.1%，同时保持 26.6 的 CLIP 分数。评测采用基于 VLM 的语义评估器，判断是否存在可辨识的显式裸体内容。"},
    rows: [
      ["SD1.4",35.6,31.4,34.8,70.5,40.7,39.8,3.5,42.4,14,26.6],
      ["ESD",2.5,0.8,0.7,20,3.5,5.6,46.5,39,13.6,25.6],
      ["FMN",33.9,30.5,31.1,69.5,38,38.7,15.5,44.9,13.8,26.3],
      ["UCE",0,4.2,6.9,8.4,7,7.7,14.8,41.5,14.3,26.4],
      ["MACE",0,1.7,0.1,0,5.6,7.7,17.6,43.2,12.8,24.2],
      ["RECE",0.8,1.7,4.9,0,2.8,2.1,21.8,41.5,14.5,26.2],
      ["AdvUnlearn",0,0,0.1,0,0,0.7,49.3,44.9,15.4,24.1],
      ["SalUN",0,0,0,0,0,0,0,47.5,31.1,23.7],
      ["STEREO",0,0,0.1,1.1,0,0,0.7,47.5,15.7,25.3],
      ["VisualErase",0,0,0.1,0,0,0,0,0,15.5,26.6]
    ]
  }
};
let language = "en";
let task = "style";
try { if (localStorage.getItem("visualerase-language") === "zh") language = "zh"; } catch { /* Storage is optional. */ }

function renderResults() {
  const data = results[task];
  const body = document.getElementById("result-rows");
  body.replaceChildren();
  data.rows.forEach(([name, ...values]) => {
    const row = document.createElement("tr");
    if (name === "VisualErase") row.className = "ours";
    const label = document.createElement("th");
    label.scope = "row";
    label.textContent = name;
    row.append(label);
    values.forEach(value => {
      const cell = document.createElement("td");
      cell.textContent = value.toFixed(1);
      row.append(cell);
    });
    body.append(row);
  });
  document.getElementById("table-caption").textContent = data.title[language];
  document.getElementById("protocol").textContent = data.note[language];
  document.querySelectorAll("[data-task]").forEach(button => button.setAttribute("aria-pressed", String(button.dataset.task === task)));
}

function renderLanguage() {
  document.documentElement.lang = language === "zh" ? "zh-CN" : "en";
  document.querySelectorAll("[data-en][data-zh]").forEach(node => { node.textContent = node.dataset[language]; });
  const button = document.getElementById("language");
  button.textContent = language === "en" ? "中文" : "EN";
  button.setAttribute("aria-label", language === "en" ? "Switch to Chinese" : "Switch to English");
  renderResults();
}
document.getElementById("language").addEventListener("click", () => {
  language = language === "en" ? "zh" : "en";
  try { localStorage.setItem("visualerase-language", language); } catch { /* Storage is optional. */ }
  renderLanguage();
});
document.querySelectorAll("[data-task]").forEach(button => button.addEventListener("click", () => {
  task = button.dataset.task;
  renderResults();
}));
renderLanguage();
