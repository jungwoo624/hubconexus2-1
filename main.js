// Initialize Chart
let impactChart;

document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    const ctx = document.getElementById('impactChart').getContext('2d');
    impactChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['공부 1등 집단', '성적 우수 집단', '평범한 집단', '도움 필요한 집단', '매우 어려운 집단'],
            datasets: [{
                label: '계층별 혜택 배분 결과 (0~100)',
                data: [0, 0, 0, 0, 0],
                backgroundColor: ['#1a73e8', '#4285f4', '#669df6', '#8ab4f8', '#aecbfa'],
                borderRadius: 10
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: { 
                y: { 
                    beginAtZero: true, 
                    max: 100, 
                    ticks: { color: getComputedStyle(document.body).getPropertyValue('--text-muted') },
                    grid: { color: getComputedStyle(document.body).getPropertyValue('--border-color') }
                },
                x: { 
                    ticks: { 
                        color: getComputedStyle(document.body).getPropertyValue('--text-muted'),
                        font: { size: 12, weight: 'bold' } 
                    },
                    grid: { display: false }
                }
            },
            plugins: { 
                legend: { display: false },
                tooltip: {
                    backgroundColor: 'rgba(30, 41, 59, 0.9)',
                    titleFont: { size: 13 },
                    bodyFont: { size: 14 }
                }
            }
        }
    });

    // 슬라이더 값 실시간 표시
    document.querySelectorAll('.slider').forEach(slider => {
        slider.addEventListener('input', (e) => {
            const spanId = e.target.id === 'effWeight' ? 'val1' : e.target.id === 'eqWeight' ? 'val2' : 'val3';
            document.getElementById(spanId).innerText = e.target.value + '%';
        });
    });

    // Theme Toggle Event
    document.getElementById('themeToggle').addEventListener('click', toggleTheme);
});

function initTheme() {
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
    } else if (systemPrefersDark) {
        document.documentElement.setAttribute('data-theme', 'dark');
    }
    updateThemeIcon();
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon();
    updateChartTheme();
}

function updateThemeIcon() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const icon = document.getElementById('themeIcon');
    if (currentTheme === 'dark') {
        icon.innerHTML = '<path d="M12,3c-4.97,0-9,4.03-9,9s4.03,9,9,9s9-4.03,9-9c0-0.46-0.04-0.92-0.1-1.36c-0.98,1.37-2.58,2.26-4.4,2.26 c-2.98,0-5.4-2.42-5.4-5.4c0-1.81,0.89-3.42,2.26-4.4C12.92,3.04,12.46,3,12,3L12,3z"></path>';
    } else {
        icon.innerHTML = '<path d="M12,18c-3.3,0-6-2.7-6-6s2.7-6,6-6s6,2.7,6,6S15.3,18,12,18zM12,8c-2.2,0-4,1.8-4,4s1.8,4,4,4s4-1.8,4-4S14.2,8,12,8z"></path><path d="M12,4V2c0-0.6-0.4-1-1-1s-1,0.4-1,1v2c0,0.6,0.4,1,1,1S12,4.6,12,4z"></path><path d="M12,20v2c0,0.6-0.4,1-1,1s-1-0.4-1-1v-2c0-0.6,0.4-1,1-1S12,19.4,12,20z"></path><path d="M5.6,6.4l-1.4-1.4c-0.4-0.4-1-0.4-1.4,0s-0.4,1,0,1.4l1.4,1.4c0.4,0.4,1,0.4,1.4,0S6,6.8,5.6,6.4z"></path><path d="M19.8,17.7l-1.4-1.4c-0.4-0.4-1-0.4-1.4,0s-0.4,1,0,1.4l1.4,1.4c0.4,0.4,1,0.4,1.4,0S20.2,18.1,19.8,17.7z"></path><path d="M20,11h2c0.6,0,1,0.4,1,1s-0.4,1-1,1h-2c-0.6,0-1-0.4-1-1S19.4,11,20,11z"></path><path d="M2,11h2c0.6,0,1,0.4,1,1s-0.4,1-1,1H2c-0.6,0-1-0.4-1-1S1.4,11,2,11z"></path><path d="M6.4,18.4l-1.4,1.4c-0.4,0.4-0.4,1,0,1.4s1,0.4,1.4,0l1.4-1.4c0.4-0.4,0.4-1,0-1.4S6.8,18,6.4,18.4z"></path><path d="M18.4,6.4l1.4-1.4c0.4-0.4,0.4-1,0-1.4s-1-0.4-1.4,0l-1.4,1.4c-0.4,0.4-0.4,1,0,1.4S18,6.8,18.4,6.4z"></path>';
    }
}

function updateChartTheme() {
    if (!impactChart) return;
    const textColor = getComputedStyle(document.body).getPropertyValue('--text-muted');
    const gridColor = getComputedStyle(document.body).getPropertyValue('--border-color');
    impactChart.options.scales.y.grid.color = gridColor;
    impactChart.options.scales.y.ticks.color = textColor;
    impactChart.options.scales.x.ticks.color = textColor;
    impactChart.update();
}

function runSimulation() {
    const wEff = parseInt(document.getElementById('effWeight').value);
    const wEq = parseInt(document.getElementById('eqWeight').value);
    const wDiv = parseInt(document.getElementById('divWeight').value);

    // 5개 그룹 데이터 (merit: 성적/능력, need: 절실함/어려움)
    const groups = [
        { merit: 95, need: 5 }, { merit: 75, need: 25 }, 
        { merit: 50, need: 50 }, { merit: 25, need: 75 }, { merit: 5, need: 95 }
    ];

    const results = groups.map((g, idx) => {
        let base = (wEff * g.merit / 100) + (wEq * g.need / 100);
        // 다양성 가중치는 하위 2개 그룹에게 특별 보너스 부여
        if (idx >= 3) base += (wDiv * 0.4);
        return Math.min(100, Math.round(base));
    });

    // 그래프 업데이트
    impactChart.data.datasets[0].data = results;
    impactChart.update();

    // 지표 계산
    const avg = results.reduce((a, b) => a + b) / results.length;
    const max = Math.max(...results);
    const min = Math.min(...results);
    const diff = max - min;
    
    document.getElementById('happyScore').innerText = Math.round(avg) + '점';
    const gini = (diff / 100).toFixed(2);
    document.getElementById('giniScore').innerText = gini;
    
    let conflict = "평화로움 😊";
    if (gini > 0.35) conflict = "조금 불안 😟";
    if (gini > 0.55) conflict = "매우 위험 😡";
    document.getElementById('conflictScore').innerText = conflict;

    // AIHP 피드백
    let aiMsg = "";
    if (wEff > 75) {
        aiMsg = "<strong>[능력주의 경보]</strong> 성적만 강조하면 잘하는 친구는 좋아하겠지만, 어려운 친구들은 기회를 잃고 포기할 수 있어요. <strong>'배려'</strong> 슬라이더를 조금 높여볼까요?";
    } else if (wEq > 75) {
        aiMsg = "<strong>[동기 부여 부족]</strong> 모두 똑같이 나누는 건 좋지만, 노력한 친구들이 보람을 못 느낄 수도 있어요. <strong>'성과'</strong>를 조금 더 인정해주는 건 어떨까요?";
    } else if (wDiv < 15) {
        aiMsg = "<strong>[소수자 소외]</strong> 특별한 도움이 필요한 친구들에 대한 배려가 부족해요. 사회의 <strong>다양성</strong>을 지키기 위해 조금만 더 마음을 써주세요!";
    } else if (gini < 0.25) {
        aiMsg = "<strong>[와우! 완벽한 균형]</strong> 정말 공평한 설계네요! 모두가 납득할 수 있는 가장 평화로운 알고리즘이 탄생했습니다. 훌륭한 <strong>AI 윤리 리더</strong>가 되겠는데요?";
    } else {
        aiMsg = "<strong>[조정 중]</strong> 나쁘지 않아요! 하지만 불평등 지수가 조금 높아요. <strong>빈부 격차(Gini)</strong> 수치를 0.3 아래로 낮추는 도전을 해보세요!";
    }
    document.getElementById('aiMsg').innerHTML = aiMsg;
}
