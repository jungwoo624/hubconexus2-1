// Initialize Chart
let impactChart;

document.addEventListener('DOMContentLoaded', () => {
    const ctx = document.getElementById('impactChart').getContext('2d');
    impactChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['상위 20%', '중상위', '중위', '중하위', '하위 20%'],
            datasets: [{
                label: '계층별 혜택 배분 수치',
                data: [0, 0, 0, 0, 0],
                backgroundColor: [
                    'rgba(37, 99, 235, 0.9)', 
                    'rgba(59, 130, 246, 0.9)', 
                    'rgba(96, 165, 250, 0.9)', 
                    'rgba(147, 197, 253, 0.9)', 
                    'rgba(191, 219, 254, 0.9)'
                ],
                borderRadius: 8,
                borderSkipped: false
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(15, 23, 42, 0.9)',
                    titleFont: { family: "'Noto Sans KR', sans-serif", size: 13 },
                    bodyFont: { family: "'Noto Sans KR', sans-serif", size: 14 },
                    padding: 12,
                    cornerRadius: 8,
                    displayColors: false
                }
            },
            scales: { 
                y: { 
                    beginAtZero: true, 
                    max: 100,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)',
                        drawBorder: false
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            },
            animation: {
                duration: 800,
                easing: 'easeOutQuart'
            }
        }
    });

    // Update Label Value Display
    document.querySelectorAll('.slider').forEach(slider => {
        slider.addEventListener('input', (e) => {
            const spanId = e.target.id === 'effWeight' ? 'val1' : e.target.id === 'eqWeight' ? 'val2' : 'val3';
            document.getElementById(spanId).innerText = e.target.value + '%';
            
            // Visual feedback on slider track
            const value = (e.target.value - e.target.min) / (e.target.max - e.target.min) * 100;
            e.target.style.background = `linear-gradient(to right, var(--primary) 0%, var(--primary) ${value}%, #e2e8f0 ${value}%, #e2e8f0 100%)`;
        });
        
        // Initialize slider tracks
        slider.dispatchEvent(new Event('input'));
    });
    
    // Set current date
    const dateElement = document.getElementById('date');
    if(dateElement) {
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        dateElement.innerText = `${yyyy}.${mm}.${dd} | Global Scale`;
    }
});

function runSimulation() {
    const wEff = parseInt(document.getElementById('effWeight').value);
    const wEq = parseInt(document.getElementById('eqWeight').value);
    const wDiv = parseInt(document.getElementById('divWeight').value);

    // Simulation Logic
    const groups = [
        { merit: 90, need: 10 }, { merit: 70, need: 30 }, 
        { merit: 50, need: 50 }, { merit: 30, need: 70 }, { merit: 10, need: 90 }
    ];

    const results = groups.map(g => {
        let base = (wEff * g.merit / 100) + (wEq * g.need / 100);
        // 다양성 가중치는 하위 계층에게 보너스 점수 부여
        if (groups.indexOf(g) >= 3) base += (wDiv * 0.5);
        return Math.min(100, Math.max(10, base));
    });

    // Calculate Stats
    const avg = results.reduce((a, b) => a + b) / results.length;
    const diff = Math.max(...results) - Math.min(...results);
    
    // Update Chart
    impactChart.data.datasets[0].data = results;
    impactChart.update();

    // Update UI Stats
    animateValue('happyScore', avg, 'pts', 'var(--secondary)');
    
    const gini = (diff / 100).toFixed(2);
    document.getElementById('giniScore').innerText = gini;
    document.getElementById('giniScore').style.color = gini > 0.4 ? 'var(--warning)' : 'var(--secondary)';
    
    let conflict = "낮음";
    let conflictColor = "var(--secondary)";
    if (gini > 0.4) { conflict = "보통"; conflictColor = "var(--warning)"; }
    if (gini > 0.6) { conflict = "높음"; conflictColor = "var(--danger)"; }
    
    document.getElementById('conflictScore').innerText = conflict;
    document.getElementById('conflictScore').style.color = conflictColor;

    // AIHP Feedback Logic
    let msg = "";
    let feedbackStyle = "";
    
    if (wEff > 70) {
        msg = "<strong>[AIHP 분석 경고]</strong> 효율성에 과도한 가중치를 두셨군요. 성과가 높은 집단은 더 부유해지겠지만, 하위 20%의 소외감이 극에 달해 사회 폭동 지수가 상승할 위험이 있습니다.";
        feedbackStyle = "background: #fef2f2; border-color: #fecaca; color: #991b1b;";
        document.querySelector('.ai-avatar').style.background = 'var(--danger)';
    } else if (wEq > 70) {
        msg = "<strong>[AIHP 분석 알림]</strong> 형평성을 매우 중시하셨네요. 사회적 갈등은 줄어들겠지만, 성과에 대한 보상이 부족해져 국가 전체의 혁신 동력이 떨어질 우려가 있습니다.";
        feedbackStyle = "background: #fffbeb; border-color: #fde68a; color: #92400e;";
        document.querySelector('.ai-avatar').style.background = 'var(--warning)';
    } else if (wDiv < 20) {
        msg = "<strong>[AIHP 분석 주의]</strong> 다양성 가중치가 너무 낮습니다. 알고리즘이 소수자와 약자의 특수성을 무시하고 '평균의 함정'에 빠져 차별을 정당화하고 있지는 않은지 검토하세요.";
        feedbackStyle = "background: #f0fdfa; border-color: #ccfbf1; color: #115e59;";
        document.querySelector('.ai-avatar').style.background = '#0d9488';
    } else {
        msg = "<strong>[AIHP 분석 완료]</strong> 매우 균형 잡힌 알고리즘입니다! 지속 가능한 발전을 위한 이상적인 가중치입니다. 이 정책이 실현된다면 10년 뒤의 지니계수는 안정적으로 유지될 것입니다.";
        feedbackStyle = "background: #f0fdf4; border-color: #bbf7d0; color: #166534;";
        document.querySelector('.ai-avatar').style.background = 'var(--secondary)';
    }
    
    const feedbackEl = document.querySelector('.ai-feedback');
    feedbackEl.style.cssText = feedbackStyle;
    
    const msgEl = document.getElementById('aiMsg');
    msgEl.style.opacity = 0;
    setTimeout(() => {
        msgEl.innerHTML = msg;
        msgEl.style.opacity = 1;
        msgEl.style.transition = 'opacity 0.3s';
        
        // Retrigger animation
        feedbackEl.style.animation = 'none';
        feedbackEl.offsetHeight; // trigger reflow
        feedbackEl.style.animation = 'fadeIn 0.5s ease-out';
    }, 150);
}

function animateValue(id, end, suffix, color) {
    const obj = document.getElementById(id);
    obj.style.color = color;
    let startTimestamp = null;
    const duration = 1000;
    
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        // easeOutQuart
        const easeProgress = 1 - Math.pow(1 - progress, 4);
        obj.innerHTML = Math.round(easeProgress * end) + `<span style="font-size: 1rem; color: var(--text-muted); margin-left: 4px;">${suffix}</span>`;
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}