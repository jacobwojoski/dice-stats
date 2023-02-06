
//import "https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.9.4/Chart.js"

var chartOptions = {
    type: 'bar',
    options: {
      animation: false,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          enabled: false
        }
      }
    },
    data: {
        datasets: [{
            barPercentage: 0.5,
            barThickness: 6,
            maxBarThickness: 8,
            minBarLength: 2,
            data: [10, 20, 30, 40, 50, 60, 70]
        }]
    }
  }

//Convert ChartData to a chart object to be displayed
Handlebars.registerHelper('getChart', function() {
    
    chartFileName = "TestChartName.png"
    canvas = new Canvas(100, 100);
    ctx = canvas.getContext('2d');
    new Chart(ctx, chartOptions);

    canvas.toBuffer(function (err, buf) {
        if (err) throw err;
        fs.writeFileSync(path.join(__dirname, '..', 'build', 'charts', chartFileName), buf);
    });

    return new Handlebars.SafeString(
        '<figure class="chart fullwidth">' +
        '<img src="/charts/' + chartFileName + '" alt="' + title + '">' +
        '<figcaption>' + title + '</figcaption>' +
        '</figure>'
    );
});

