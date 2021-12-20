ymaps.ready(function () {
    var LAYER_NAME = 'user#layer',
        MAP_TYPE_NAME = 'user#customMap',
        // Директория с тайлами.
        TILES_PATH = 'images/phlan',
        /* Для того чтобы вычислить координаты левого нижнего и правого верхнего углов прямоугольной координатной
         * области, нам необходимо знать максимальный зум, ширину и высоту изображения в пикселях на максимальном зуме.
         */
        MAX_ZOOM = 8,
        PIC_WIDTH = 5632,
        PIC_HEIGHT = 4096;

    /**
     * Конструктор, создающий собственный слой.
     */
    var Layer = function () {
        var layer = new ymaps.Layer(TILES_PATH + '/%z/tile-%x-%y.jpg', {
            // Если есть необходимость показать собственное изображение в местах неподгрузившихся тайлов,
            // раскомментируйте эту строчку и укажите ссылку на изображение.
            // notFoundTile: 'url'
        });
        // Указываем доступный диапазон масштабов для данного слоя.
        layer.getZoomRange = function () {
            return ymaps.vow.resolve([0, 8]);
        };
        // Добавляем свои копирайты.
        layer.getCopyrights = function () {
            return ymaps.vow.resolve('©');
        };
        return layer;
    };
    // Добавляем в хранилище слоев свой конструктор.
    ymaps.layer.storage.add(LAYER_NAME, Layer);

    /**
     * Создадим новый тип карты.
     * MAP_TYPE_NAME - имя нового типа.
     * LAYER_NAME - ключ в хранилище слоев или функция конструктор.
     */
    var mapType = new ymaps.MapType(MAP_TYPE_NAME, [LAYER_NAME]);
    // Сохраняем тип в хранилище типов.
    ymaps.mapType.storage.add(MAP_TYPE_NAME, mapType);

    // Вычисляем размер всех тайлов на максимальном зуме.
    var worldSize = Math.pow(2, MAX_ZOOM) * 256,
        /**
         * Создаем карту, указав свой новый тип карты.
         */
        map = new ymaps.Map('map', {
            center: [0, 0],
            zoom: 2,
            controls: ['zoomControl'],
            type: MAP_TYPE_NAME
        }, {

            // Задаем в качестве проекции Декартову. При данном расчёте центр изображения будет лежать в координатах [0, 0].
            projection: new ymaps.projection.Cartesian([[PIC_HEIGHT / 2 - worldSize, -PIC_WIDTH / 2], [PIC_HEIGHT / 2, worldSize - PIC_WIDTH / 2]], [false, false]),
            // Устанавливаем область просмотра карты так, чтобы пользователь не смог выйти за пределы изображения.
            restrictMapArea: [[-PIC_HEIGHT / 2, -PIC_WIDTH / 2], [PIC_HEIGHT / 2, PIC_WIDTH / 2]]

            // При данном расчёте, в координатах [0, 0] будет находиться левый нижний угол изображения,
            // правый верхний будет находиться в координатах [PIC_HEIGHT, PIC_WIDTH].
            // projection: new ymaps.projection.Cartesian([[PIC_HEIGHT - worldSize, 0], [PIC_HEIGHT, worldSize]], [false, false]),
            // restrictMapArea: [[0, 0], [PIC_HEIGHT, PIC_WIDTH]]
        });

    var polygonA = new ymaps.Polygon([
        [
            [-41.2181, -50.1090],
            [-229.000, -295.000],
            [-554.000, 67.0000],
            [-359.511, 320.935]
        ]

    ], {
        hintContent: 'Замок Вальево',
        balloonContent: 'Наибольшее строение в Флане является средоточием городской власти, расположением Киноварного трона, где сейчас обитает Лорд-регент Эктор Брамс и его семья. После годов Жентаримского владычества, замок неоднократно подвергался капитальному ремонту. Сам замок огромен, его величественные стены из гранита и мрамора увенчаны внушающими трепет башнями.'
    }, {
        fillColor: 'rgba(255,0,0,0.37)',
        opacity: 0.75,
        strokeWidth: 4,
        strokeStyle: 'shortdash'
    });

    map.geoObjects.add(polygonA);

    var polygonB = new ymaps.Polygon([
        [
            [-363.000, -517.000],
            [-319.000, -471.000],
            [-524.000, -253.000],
            [-564.000, -295.00]
        ]

    ], {
        hintContent: 'Стояновский Ворота',
        balloonContent: 'Колоссальное сооружение, по слухам, построенное огненными гигантами, содержит в себе штаб квартиру рыцарей Черного Кулака и является единственным входом в замок Вальево.\n' +
            'Огромные стены 60 футов высотой и почти вполовину такой же толщины протянулись в обе стороны от массивных, окованных железом дверей, которые закрываются только на военное время. Преступники, арестованные во Флане, содержатся в Стояновских Воротах (и большинство из них будут повешены здесь же).\n' +
            'За верхнюю часть стены на толстых веревках подвешены тела, медленно вращающиеся на ветру в то время, как вороны выклевывают у них наиболее вкусные части. Длинная очередь людей выстроилась к письменному столу, где на вид скучающий стражник работает с огромным гроссбухом.\n' +
            'Рыцари Черного Кулака охраняют Ворота Стоянов, единственный вход в Замок Вальево, а также выступают стражниками битком набитых тюремных камер внутри заставы.'
    }, {
        fillColor: 'rgba(255,0,0,0.37)',
        opacity: 0.75,
        strokeWidth: 4,
        strokeStyle: 'shortdash'
    });

    map.geoObjects.add(polygonB);

    var polygonC = new ymaps.Polygon([
        [
            [-790.000, -126.000],
            [-677.000, -21.0000],
            [-583.000, -159.000],
            [-676.000, -248.000]
        ]

    ], {
        hintContent: 'Лицей Черного Лорда',
        balloonContent: 'Этот большой храм когда-то был посвящен Бейну, но в беспорядках, последовавших за смертью Лорда-протектора, он был разграблен, сожжен, а его священнослужители убиты. Вскоре после этого, Пайони и Рог ходатайствовали перед Лордом-регентом о получении разрешения использовать этот участок земли в качестве убежища для нуждающихся в исцелении или просто горячей пище.'
    }, {
        fillColor: 'rgba(255,0,0,0.37)',
        opacity: 0.75,
        strokeWidth: 4,
        strokeStyle: 'shortdash'
    });

    map.geoObjects.add(polygonC);

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

    var polygonE = new ymaps.Polygon([
        [
            [-1046.00, -996.000],
            [-926.000, -870.000],
            [-806.000, -998.000],
            [-916.000, -1106.00]
        ]

    ], {
        hintContent: 'Текстиль Кадорны',
        balloonContent: ''
    }, {
        fillColor: 'rgba(255,0,0,0.37)',
        opacity: 0.75,
        strokeWidth: 4,
        strokeStyle: 'shortdash'
    });

    map.geoObjects.add(polygonE);

    var pointF = new ymaps.Placemark([-1100, -900], {
    }, {
        preset: 'islands#blueBookCircleIcon'
    });
    map.geoObjects.add(pointF);

    var polygonF = new ymaps.Polygon([
        [
            [-1178.00, -857.000],
            [-1081.00, -749.000],
            [-994.000, -833.000],
            [-1093.00, -942.000]
        ]

    ], {
        hintContent: 'Библиотека Мантора',
        balloonContent: ''
    }, {
        fillColor: 'rgba(255,0,0,0.37)',
        opacity: 0.75,
        strokeWidth: 4,
        strokeStyle: 'shortdash',
        iconContent: 'islands#blueStretchyIcon'

    });

    map.geoObjects.add(polygonF);

    var pointG = new ymaps.Placemark([ -1104.00, -593.000], {
    }, {
        preset: 'islands#blueHotelCircleIcon'
    });
    map.geoObjects.add(pointG);

    var polygonG = new ymaps.Polygon([
        [
            [-1157.83, -609.411],
            [-1115.83, -545.411],
            [-1073.83, -574.411],
            [-1044.83, -606.411],
            [-1059.83, -642.411],
            [-1098.83, -617.411],
            [-1112.83, -637.411],
            [-1148.83, -614.411]
        ]

    ], {
        hintContent: 'Постоялый двор "Треснувшая Корона"',
        balloonContent: ''
    }, {
        fillColor: 'rgba(255,0,0,0.37)',
        opacity: 0.75,
        strokeWidth: 4,
        strokeStyle: 'shortdash'
    });

    map.geoObjects.add(polygonG);

    var circleH = new ymaps.Circle([
        // Координаты центра круга.
        [-909.000, -494.000],
        40
    ], {
        balloonContent: 'Этот большой, но ничем не примечательный колодец в старом Флане раньше служил входом в обширные подземные части города. В 1489 ЛД Лорд-регент приказал запечатать колодец, для защиты города от тех, кто обитает под ним.' +
            ' На самом деле, приказ был отдан потому, что колодец представлял собой ещё один ход в Замок Вальево. Когда-то им воспользовались как раз таким образом для того, чтобы повергнуть Тирантраксуса.',
        // Содержимое хинта.
        hintContent: "Колодец Куто"
    }, {
        draggable: false,
        fillColor: 'rgba(255,0,0,0.37)',
        opacity: 0.75,
        strokeWidth: 4,
        strokeStyle: 'shortdash'
    });

    map.geoObjects.add(circleH);

    var pointT = new ymaps.Placemark([ -1070.00, -325.000], {
    }, {
        preset: 'islands#blueFoodCircleIcon'
    });
    map.geoObjects.add(pointT);

    var polygonI = new ymaps.Polygon([
        [
            [-1081.00, -291.000],
            [-1038.00, -307.000],
            [-1067.00, -353.000],
            [-1098.00, -331.000]
        ]

    ], {
        hintContent: 'Таверна "Колокольчик Нэта Вайлера"',
        balloonContent: ''
    }, {
        fillColor: 'rgba(255,0,0,0.37)',
        opacity: 0.75,
        strokeWidth: 4,
        strokeStyle: 'shortdash'
    });

    map.geoObjects.add(polygonI);

    var circleJ = new ymaps.Circle([
        // Координаты центра круга.
        [-1119.00, 28.0000],
        30
    ], {
        balloonContent: 'Эта башня ныне необитаема, но ранее служила домом для могущественного волшебника (на самом деле тайного шпиона Красных Волшебников из Тея),' +
            ' а теперь находится под контролем Лорда-мудреца Флана. Перед тем как башня была заброшена, множество могущественных оберегов были наложены по всей башне, и теперь Лорд-мудрец ищет способы их обезвредить.',
        // Содержимое хинта.
        hintContent: "Башня Денлора"
    }, {
        draggable: false,
        fillColor: 'rgba(255,0,0,0.37)',
        opacity: 0.75,
        strokeWidth: 4,
        strokeStyle: 'shortdash'
    });

    map.geoObjects.add(circleJ);

    var pointK = new ymaps.Placemark([ -1257.00, 117.000], {
    }, {
        preset: 'islands#blueHotelCircleIcon'
    });
    map.geoObjects.add(pointK);

    var polygonK = new ymaps.Polygon([
        [
            [-1306.00, 110.000],
            [-1259.00, 154.000],
            [-1198.00, 93.0000],
            [-1229.00, 68.0000],
            [-1281.00, 77.0000]
        ]

    ], {
        hintContent: 'Постоялый двор "Смеющийся гоблин"',
        balloonContent: 'Большая старая темная таверна, у которой бывали времена и получше. Мебель износилась, штукатурка, когда-то белая, теперь пожелтела и осыпается, а люстры и лампы поржавели. Мебель носит следы интенсивного использования и шрамы от разных потасовок.' +
            'Общий зал двухэтажный, с большим открытым пространством в центре, где находится бар, сцена и большой очаг. По стенам расположено несколько кабинок,' +
            ' а остальную часть зала заполняют обычные столы. Единственный примечательный элемент декора в общем зале - это большой резной тотем, напоминающий смеющегося гоблина. Тотем явно очень старый и поизносившийся.'
    }, {
        fillColor: 'rgba(255,0,0,0.37)',
        opacity: 0.75,
        strokeWidth: 4,
        strokeStyle: 'shortdash',

    });
    map.geoObjects.add(polygonK);

    var polygonL = new ymaps.Polygon([
        [
            [-1835.00, -994.740],
            [-1866.00, -777.740],
            [-1770.00, -656.740],
            [-1555.00, -597.740],
            [-1433.00, -804.740],
            [-1722.00, -1099.74]
        ]

    ], {
        hintContent: 'Крепость Сокол',
        balloonContent: ''
    }, {
        fillColor: 'rgba(255,0,0,0.37)',
        opacity: 0.75,
        strokeWidth: 4,
        strokeStyle: 'shortdash',

    });
    map.geoObjects.add(polygonL);

    var polygonM = new ymaps.Polygon([
        [
            [-774.000, 468.000],
            [-751.000, 557.000],
            [-689.000, 612.000],
            [-589.000, 494.000],
            [-632.000, 438.000],
            [-716.000, 413.000]
        ]

    ], {
        hintContent: 'Особняк Ковел',
        balloonContent: ''
    }, {
        fillColor: 'rgba(255,0,0,0.37)',
        opacity: 0.75,
        strokeWidth: 4,
        strokeStyle: 'shortdash',

    });
    map.geoObjects.add(polygonM);

    var polygonN = new ymaps.Polygon([
        [
            [-987.000, 685.000],
            [-865.000, 807.000],
            [-928.000, 865.000],
            [-1044.00, 756.000]
        ]

    ], {
        hintContent: 'Дом Яннарск',
        balloonContent: ''
    }, {
        fillColor: 'rgba(255,0,0,0.37)',
        opacity: 0.75,
        strokeWidth: 4,
        strokeStyle: 'shortdash',

    });
    map.geoObjects.add(polygonN);

    var polygonO = new ymaps.Polygon([
        [
            [-1580.00, 1288.00],
            [-1357.00, 1364.00],
            [-1338.00, 1297.00],
            [-1436.00, 1254.00],
            [-1408.00, 1187.00],
            [-1522.00, 1134.00]
        ]

    ], {
        hintContent: 'Красные Перья',
        balloonContent: ''
    }, {
        fillColor: 'rgba(255,0,0,0.37)',
        opacity: 0.75,
        strokeWidth: 4,
        strokeStyle: 'shortdash',

    });
    map.geoObjects.add(polygonO);

    var pointP = new ymaps.Placemark([-750, 1100], {
        iconContent: 'Брайс Ванг'
    }, {
        preset: 'islands#blueStretchyIcon'
    });
    var pointQ = new ymaps.Placemark([-800, 1400], {
        iconContent: 'Рендольф Тзинтин'
    }, {
        preset: 'islands#blueStretchyIcon'
    });
    var pointR = new ymaps.Placemark([-800, 1900], {
        iconContent: 'Вондор Тонд'
    }, {
        preset: 'islands#blueStretchyIcon'
    });
    var pointS = new ymaps.Placemark([-500, 1250], {
        iconContent: 'Алеро',
        balloonContent: 'Кузнец, оружейник'
    }, {
        preset: 'islands#blueStretchyIcon'
    });

    var pointT = new ymaps.Placemark([ 3.00000, 980.000], {
    }, {
        preset: 'islands#blueFoodCircleIcon'
    });
    map.geoObjects.add(pointT);

    var polygonT = new ymaps.Polygon([
        [
            [-27.0000, 972.000],
            [3.00000, 1014.00],
            [46.0000, 981.000],
            [8.00000, 941.000]
        ]

    ], {
        hintContent: 'Пиршественная зала Вельветовый Дублет',
        balloonContent: ''
    }, {
        fillColor: 'rgba(255,0,0,0.37)',
        opacity: 0.75,
        strokeWidth: 4,
        strokeStyle: 'shortdash',

    });
  map.geoObjects.add(polygonT);

    var polygonU = new ymaps.Polygon([
        [
            [1200.91, 2122.00],
            [1273.91, 1839.00],
            [988.911, 1919.00]
        ]

    ], {
        hintContent: 'Замок Атюк',
        balloonContent: ''
    }, {
        fillColor: 'rgba(255,0,0,0.37)',
        opacity: 0.75,
        strokeWidth: 4,
        strokeStyle: 'shortdash',

    });
    map.geoObjects.add(polygonU);

    map.geoObjects.add(pointP);
    map.geoObjects.add(pointQ);
    map.geoObjects.add(pointR);
    map.geoObjects.add(pointS);

    // Обработка события, возникающего при щелчке
    // левой кнопкой мыши в любой точке карты.
    // При возникновении такого события откроем балун.
    map.events.add('click', function (e) {
        if (!map.balloon.isOpen()) {
            var coords = e.get('coords');
            map.balloon.open(coords, {
                contentHeader: 'Скопируй координаты, и добавь описание, тогда потом я смогу добавить метку.',
                contentBody: '<p>Координаты щелчка: ' + [
                    coords[0].toPrecision(6),
                    coords[1].toPrecision(6)
                ].join(', ') + '</p>',
                contentFooter: '<sup>Щелкните еще раз</sup>'
            });
        } else {
            map.balloon.close();
        }
    });

    // Скрываем хинт при открытии балуна.
    map.events.add('balloonopen', function (e) {
        map.hint.close();
    });

    for (var geoObjectsKey in map.geoObjects) {
        console.log(geoObjectsKey.toString())
    }
});
