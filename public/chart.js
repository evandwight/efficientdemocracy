'use strict';
Object.keys(chartData).forEach(chartId => {
    var ctx = document.getElementById(chartId).getContext('2d');
        var myChart = new Chart(ctx, {
        type: 'bar',
        data: chartData[chartId],
        options: {
            scales: {
                y: {
                    beginAtZero: true
                },
            },
            maintainAspectRatio: true,
            responsive: true,
            aspectRatio: 2,
        }
    });    
});

