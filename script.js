const header = document.querySelector('.header');

window.addEventListener('scroll', () => {
  if(window.scrollY > 10) {  // لو المستخدم بدأ النزول
    header.classList.add('scrolled');
  } else {                   // رجع لفوق الصفحة
    header.classList.remove('scrolled');
  }
});



document.addEventListener('DOMContentLoaded', function () {
  // دالة للتحريك السلس مع وقت مخصص
  function smoothScrollTo(targetY, duration = 800) {
    const startY = window.scrollY;
    const distance = targetY - startY;
    const startTime = performance.now();

    function easeInOutQuad(t) {
      return t < 0.5 ? 2*t*t : -1 + (4 - 2*t)*t;
    }

    function step(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = easeInOutQuad(progress);
      window.scrollTo(0, startY + distance * ease);
      if (elapsed < duration) {
        requestAnimationFrame(step);
      }
    }
    requestAnimationFrame(step);
  }

  // نطبّق على كل روابط nav
  document.querySelectorAll('.nav-bar, a[href^="#"]').forEach(link => {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      const hash = this.getAttribute('href');
      const target = document.querySelector(hash);
      if (!target) return;

      // حساب مكان الهدف مع مراعاة ارتفاع الهيدر
      const header = document.querySelector('.header');
      const headerHeight = header ? header.offsetHeight : 0;
      const targetY = target.offsetTop - headerHeight;

      // تحريك سلس (غير الرقم 800 لو عايز أبطأ/أسرع)
      smoothScrollTo(targetY, 800);
    });
  });
});




document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', function (e) {
    e.preventDefault();
    const hash = this.getAttribute('href');
    const target = document.querySelector(hash);
    if (!target) return;

    const header = document.querySelector('.header');
    const headerHeight = header ? header.offsetHeight : 0;
    const targetY = target.offsetTop - headerHeight;

    smoothScrollTo(targetY, 800); // 800 = السرعة
  });
});










document.addEventListener('DOMContentLoaded', function () {
  // -------------------- Pie Chart --------------------
  const ctxPie = document.getElementById('pieChart').getContext('2d');
  const pieChart = new Chart(ctxPie, {
    type: 'pie',
    data: {
      labels: ['Agriculture', 'Urban', 'Water', 'Others'],
      datasets: [{
        data: [45, 28, 18, 9],
        backgroundColor: ['#94b90fff','#ce6917ff','#3ec8ffff','#8C8D91'],
        borderColor: '#142931ff',
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: { color: '#cfeee1' }
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              return `${context.label}: ${context.parsed}%`;
            }
          }
        }
      },
      animation: {
        duration: 900,
        easing: 'easeOutQuart'
      }
    }
  });

  // -------------------- Line Chart --------------------
  const ctxLine = document.getElementById('lineChart').getContext('2d');
  const lineChart = new Chart(ctxLine, {
    type: 'line',
    data: {
      labels: ['2000', '2013', '2023'],
      datasets: [
        {
          label: 'Agriculture',
          data: [52, 48, 45],
          borderColor: '#94b90fff',
          backgroundColor: '#94b90fff',
          tension: 0.3,
          fill: false
        },
        {
          label: 'Urban',
          data: [14, 22, 28],
          borderColor: '#ce6917ff',
          backgroundColor: '#ce6917ff',
          tension: 0.3,
          fill: false
        },
        {
          label: 'Water',
          data: [25, 21, 18],
          borderColor: '#3ec8ffff',
          backgroundColor: '#3ec8ffff',
          tension: 0.3,
          fill: false
        },
        {
          label: 'Others',
          data: [9, 9, 9],
          borderColor: '#8C8D91',
          backgroundColor: '#8C8D91',
          tension: 0.3,
          fill: false
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: { color: '#cfeee1' }
        }
      },
      scales: {
        x: {
          ticks: { color: '#cfeee1' },
          grid: { color: 'rgba(255,255,255,0.1)' }
        },
        y: {
          ticks: { color: '#cfeee1' },
          grid: { color: 'rgba(255,255,255,0.1)' }
        }
      }
    }
  });
});









// إنشاء الخريطة
var map = L.map('map').setView([31.4, 31.8], 10);

// طبقة الأساس
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap'
}).addTo(map);

// جدول الألوان لكل فئة
var classColors = {
  "Agricultural Soil": "#2ca02c",
  "Salt": "#f0e442",
  "Sand": "#d9b38c",
  "Urban": "#7f7f7f",
  "Vegetation-100": "#98df8a",
  "Water": "#1f77b4"
};

// كائن لتخزين الطبقات بعد التحميل
var layers = {};

// دالة تحميل طبقة GeoJSON من ملف
function loadLayer(name, file) {
  return fetch(file)
    .then(res => {
      if (!res.ok) throw new Error(`فشل تحميل الملف: ${file}`);
      return res.json();
    })
    .then(data => {
      var layer = L.geoJSON(data, {
        style: function (feature) {
          // استخدم اللون المناسب حسب CLASS_NAME، أو أسود إذا لم يُوجد
          return {
            color: classColors[feature.properties.CLASS_NAME] || "#000000",
            weight: 1,
            fillOpacity: 0.5
          };
        },
        onEachFeature: function (feature, layer) {
          // إذا كانت هناك خصائص، عرضها في النافذة المنبثقة
          if (feature.properties) {
            layer.bindPopup(
              "<b>Class:</b> " + feature.properties.CLASS_NAME +
              "<br><b>Area:</b> " + feature.properties.AREA
            );
          }
        }
      });
      // تخزين الطبقة في الكائن layers بمفتاح اسم السنة
      layers[name] = layer;
      // إعادة الطبقة كقيمة للـ Promise لضمان عمل Promise.all
      return layer;
    })
    .catch(error => {
      console.error("❌ خطأ في تحميل " + file + ":", error);
      throw error; // نعيد الخطأ لكي يتوقف Promise.all
    });
}

// تحميل جميع الطبقات متزامنًا
Promise.all([
  loadLayer("2023", "data2023/2023.geojson"),
  loadLayer("2013", "data2013/2013.geojson"),
  loadLayer("2000", "data2000/2000.geojson")
])
.then(() => {
  // بعد اكتمال التحميل، نضيف تحكم الطبقات
  L.control.layers(null, layers).addTo(map);
})
.catch(error => {
  // إذا فشل أي تحميل، نظهر الخطأ في الكونسول
  console.error("❌ فشل تحميل أحد الملفات. تحقق من المسارات والملفات.");
  alert("خطأ في تحميل بيانات الأراضي. راجع وحدة التحكم (Console) للتفاصيل.");
});







