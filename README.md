# phlan-map
Карта Флана

Создание области

```
var polygonD = new ymaps.Polygon([
        [
            [-876.000, -657.000],
            [-760.000, -558.000],
            [-652.000, -684.000],
            [-769.000, -787.000]
        ]

    ], {
        hintContent: 'Подол',
        balloonContent: 'Бывшая ранее шумным рынком под открытым небом, эта площадь сейчас занята торговыми ларьками с выцветшими и оборванными тентами.'
    }, {
        fillColor: 'rgba(255,0,0,0.37)',
        opacity: 0.75,
        strokeWidth: 4,
        strokeStyle: 'shortdash'
    });

    map.geoObjects.add(polygonD);
```
    
Создание точки
    
    
```
     var pointS = new ymaps.Placemark([-500, 1250], {
        iconContent: 'Алеро',
        balloonContent: 'Кузнец, оружейник'
    }, {
        preset: 'islands#blueStretchyIcon'
    })
     map.geoObjects.add(pointR);
```
