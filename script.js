// Function to check if element is in viewport
function reveal() {
    var reveals = document.querySelectorAll(".reveal");

    for (var i = 0; i < reveals.length; i++) {
        var windowHeight = window.innerHeight;
        var elementTop = reveals[i].getBoundingClientRect().top;
        var elementVisible = 100;

        if (elementTop < windowHeight - elementVisible) {
            reveals[i].classList.add("active");
        }
    }
}

window.addEventListener("scroll", reveal);

// Trigger once on load
window.addEventListener("load", function() {
    setTimeout(reveal, 100);
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if(targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if(targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// --- Interactive Diagnosis Logic ---
const diagnosisQuestions = [
    {
        title: "Q1. 現在のあなたの役職は？",
        options: [
            { text: "代表取締役 / 経営者", tag: "役職_経営者" },
            { text: "役員 / マネージャー", tag: "役職_幹部" },
            { text: "店長 / 現場責任者", tag: "役職_店長" }
        ]
    },
    {
        title: "Q2. 現在の店舗数・組織規模は？",
        options: [
            { text: "1店舗", tag: "規模_1店舗" },
            { text: "2〜5店舗", tag: "規模_2_5店舗" },
            { text: "6店舗以上", tag: "規模_6店舗以上" }
        ]
    },
    {
        title: "Q3. 今、最も頭を抱えている「痛み」は？",
        options: [
            { text: "自分が現場を離れると質が落ちる", tag: "悩み_自分が現場" },
            { text: "採用してもすぐ辞める・育たない", tag: "悩み_採用定着" },
            { text: "売上や店舗展開が頭打ちしている", tag: "悩み_展開頭打ち" }
        ]
    },
    {
        title: "Q4. 業務マニュアルは機能していますか？",
        options: [
            { text: "ない / 社長の頭の中にあるだけ", tag: "マニュアル_なし" },
            { text: "あるが形骸化（誰も読んでいない）", tag: "マニュアル_形骸化" },
            { text: "チェックリストとして機能中", tag: "マニュアル_機能中" }
        ]
    },
    {
        title: "Q5. 1年後、会社をどうしたいですか？",
        options: [
            { text: "社長が現場を離れ、完全に自走させたい", tag: "目標_自走化" },
            { text: "理念に共感して長く働く右腕を育てたい", tag: "目標_右腕育成" },
            { text: "多店舗展開を加速させステージを上げたい", tag: "目標_規模拡大" }
        ]
    }
];

let currentQuestion = 0;
let userTags = [];

const startBtn = document.getElementById('start-diagnosis-btn');
const diagnosisApp = document.getElementById('diagnosis-app');

if (startBtn && diagnosisApp) {
    startBtn.addEventListener('click', () => {
        renderQuestion(currentQuestion);
    });
}

function renderQuestion(index) {
    if (index >= diagnosisQuestions.length) {
        renderResult();
        return;
    }
    
    const q = diagnosisQuestions[index];
    let html = `
        <div class="question-container">
            <span style="display:block; margin-bottom:0.5rem; color:var(--text-muted); font-size:0.9rem;">Question ${index + 1} / 5</span>
            <h3 class="question-title">${q.title}</h3>
            <div class="options-grid">
    `;
    
    q.options.forEach(opt => {
        html += `<button class="option-btn" onclick="selectOption('${opt.tag}')">${opt.text}</button>`;
    });
    
    html += `</div></div>`;
    diagnosisApp.innerHTML = html;
}

window.selectOption = function(tag) {
    userTags.push(tag);
    currentQuestion++;
    renderQuestion(currentQuestion);
}

function renderResult() {
    let resultType = 'C：天井到達タイプ'; 
    let resultTitle = '';
    let resultDesc = '';

    if (userTags.includes('悩み_自分が現場') || userTags.includes('目標_自走化')) {
        resultType = 'A';
        resultTitle = 'A：現場依存タイプ';
        resultDesc = '社長の能力が高すぎるゆえに組織が依存しています。<br>このままでは現場を離れることはできません。';
    } else if (userTags.includes('悩み_採用定着') || userTags.includes('目標_右腕育成')) {
        resultType = 'B';
        resultTitle = 'B：人財枯渇タイプ';
        resultDesc = '教育への投資が「資産」にならず、穴の空いたバケツに水を注いでいる状態です。';
    } else {
        resultType = 'C';
        resultTitle = 'C：天井到達タイプ';
        resultDesc = '基礎はできていますが、感性やマインドといった「見えない資産」の言語化がボトルネックです。';
    }

    const html = `
        <div class="result-container">
            <div style="background: rgba(255,59,59,0.1); padding: 0.5rem 1rem; border-radius: 5px; display:inline-block; color:#ff6b6b; margin-bottom: 1rem; font-weight:bold; letter-spacing:1px;">診断処理完了</div>
            <h3 style="font-size: 1.1rem; color: var(--text-muted); margin-bottom: 0.5rem;">あなたの組織の課題タイプは...</h3>
            <h2 class="result-title" style="font-family: var(--font-serif); font-size: 2.2rem; color: var(--gold-primary); margin-bottom: 1.5rem;">${resultTitle}</h2>
            <p class="result-desc" style="font-size: 1.1rem; color: var(--text-main); margin-bottom: 2rem; line-height: 1.6;">${resultDesc}</p>
            
            <div class="line-action-box" style="margin-top: 1rem; background: rgba(0,0,0,0.3); padding: 2.5rem 1.5rem; border-radius: 15px; border: 1px solid rgba(6, 199, 85, 0.3);">
                <p style="font-weight: bold; margin-bottom: 1.5rem; font-size: 1.1rem; line-height:1.6;">
                    この課題を根底から解決する<br class="sp-only">『次の一手（23ステップのうち3つ）』の<br class="pc-only">具体的な実行手順は、LINEでお渡しします。
                </p>
                <a href="https://liff.line.me/2009547940-QUv7dCjJ?unique_key=5T0ZzL&ts=1773995324" class="btn-primary" style="background: #06C755; color: #fff; display: block; text-align: center; text-decoration: none; box-sizing: border-box; border: none; box-shadow: 0 4px 15px rgba(6, 199, 85, 0.3); font-size: 1.2rem; padding: 1.2rem; width: 100%; max-width: 400px; margin: 0 auto;">
                    診断を受けて特典を受け取る
                </a>
            </div>
        </div>
    `;
    
    diagnosisApp.innerHTML = html;
}
