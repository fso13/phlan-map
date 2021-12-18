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

    var pointA = new ymaps.Placemark([-200, 0], {
        iconContent: 'Замок Вальево',
        balloonContent: 'Наибольшее строение в Флане является средоточием городской власти, расположением Киноварного трона, где сейчас обитает Лорд-регент Эктор Брамс и его семья. После годов Жентаримского владычества, замок неоднократно подвергался капитальному ремонту.\n' +
            'Сам замок огромен, его величественные стены из гранита и мрамора увенчаны внушающими трепет башнями.'
    }, {
        preset: 'islands#redStretchyIcon'
    });
    var pointB = new ymaps.Placemark([-400, -400], {
        iconContent: 'Стояновский Ворота',
        balloonContent: 'Колоссальное сооружение, по слухам, построенное огненными гигантами, содержит в себе штаб квартиру рыцарей Черного Кулака и является единственным входом в замок Вальево.\n' +
            'Огромные стены 60 футов высотой и почти вполовину такой же толщины протянулись в обе стороны от массивных, окованных железом дверей, которые закрываются только на военное время. Преступники, арестованные во Флане, содержатся в Стояновских Воротах (и большинство из них будут повешены здесь же).\n' +
            'За верхнюю часть стены на толстых веревках подвешены тела, медленно вращающиеся на ветру в то время, как вороны выклевывают у них наиболее вкусные части. Длинная очередь людей выстроилась к письменному столу, где на вид скучающий стражник работает с огромным гроссбухом.\n' +
            'Рыцари Черного Кулака охраняют Ворота Стоянов, единственный вход в Замок Вальево, а также выступают стражниками битком набитых тюремных камер внутри заставы.'
    }, {
        preset: 'islands#redStretchyIcon'
    });
    var pointC = new ymaps.Placemark([-650, -150], {
        iconContent: 'Лицей Черного Лорда'
    }, {
        preset: 'islands#redStretchyIcon'
    });
    var pointD = new ymaps.Placemark([-750, -700], {
        iconContent: 'Подол',
        balloonContent: 'Бывшая ранее шумным рынком под открытым небом, эта площадь сейчас занята торговыми ларьками с выцветшими и оборванными тентами.'
    }, {
        preset: 'islands#redStretchyIcon'
    });
    var pointE = new ymaps.Placemark([-900, -1000], {
        iconContent: 'Текстиль Кадорны'
    }, {
        preset: 'islands#redStretchyIcon'
    });
    var pointF = new ymaps.Placemark([-1100, -900], {
        iconContent: 'Библиотека Мантора'
    }, {
        preset: 'islands#redStretchyIcon'
    });
    var pointG = new ymaps.Placemark([-1050, -600], {
        iconContent: '"Треснувшая Корона"'
    }, {
        preset: 'islands#redStretchyIcon'
    });
    var pointH = new ymaps.Placemark([-900, -450], {
        iconContent: 'Колодец Куто',
        balloonContent: 'Этот большой, но ничем не примечательный колодец в старом Флане раньше служил входом в обширные подземные части города. В 1489 ЛД Лорд-регент приказал запечатать колодец, для защиты города от тех, кто обитает под ним. На самом деле, приказ был отдан потому, что колодец представлял собой ещё один ход в Замок Вальево. Когда-то им воспользовались как раз таким образом для того, чтобы повергнуть Тирантраксуса.'
    }, {
        preset: 'islands#redStretchyIcon'
    });
    var pointI = new ymaps.Placemark([-1100, -300], {
        iconContent: '"Колокольчик Нэта Вайлера"'
    }, {
        preset: 'islands#redStretchyIcon'
    });
    var pointJ = new ymaps.Placemark([-1100, 50], {
        iconContent: 'Башня Денлора'
    }, {
        preset: 'islands#redStretchyIcon'
    });
    var pointK = new ymaps.Placemark([-1200, 100], {
        iconContent: '"Смеющийся гоблин"',
        balloonContent:'Большая старая темная таверна, у которой бывали времена и получше. Мебель износилась, штукатурка, когда-то белая, теперь пожелтела и осыпается, а люстры и лампы поржавели. Мебель носит следы интенсивного использования и шрамы от разных потасовок.' +
            'Общий зал двухэтажный, с большим открытым пространством в центре, где находится бар, сцена и большой очаг. По стенам расположено несколько кабинок, а остальную часть зала заполняют обычные столы. Единственный примечательный элемент декора в общем зале - это большой резной тотем, напоминающий смеющегося гоблина. Тотем явно очень старый и поизносившийся.'
    }, {
        preset: 'islands#redStretchyIcon'
    });
    var pointL = new ymaps.Placemark([-1700, -800], {
        iconContent: 'Крепость Сокол'
    }, {
        preset: 'islands#redStretchyIcon'
    });
    var pointM = new ymaps.Placemark([-700, 500], {
        iconContent: 'Особняк Ковел'
    }, {
        preset: 'islands#redStretchyIcon'
    });
    var pointN = new ymaps.Placemark([-1000, 800], {
        iconContent: 'Дом Яннарск'
    }, {
        preset: 'islands#redStretchyIcon'
    });
    var pointO = new ymaps.Placemark([-1500, 1300], {
        iconContent: 'Красные Перья'
    }, {
        preset: 'islands#redStretchyIcon'
    });
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
    var pointT = new ymaps.Placemark([50, 950], {
        iconContent: 'Вельветовый Дублет'
    }, {
        preset: 'islands#redStretchyIcon'
    });
    var pointU = new ymaps.Placemark([1200, 2000], {
        iconContent: 'Замок Атюк'
    }, {
        preset: 'islands#redStretchyIcon'
    });
    map.geoObjects.add(pointA);
    map.geoObjects.add(pointB);
    map.geoObjects.add(pointC);
    map.geoObjects.add(pointD);
    map.geoObjects.add(pointE);
    map.geoObjects.add(pointF);
    map.geoObjects.add(pointG);
    map.geoObjects.add(pointH);
    map.geoObjects.add(pointI);
    map.geoObjects.add(pointJ);
    map.geoObjects.add(pointK);
    map.geoObjects.add(pointL);
    map.geoObjects.add(pointM);
    map.geoObjects.add(pointN);
    map.geoObjects.add(pointO);
    map.geoObjects.add(pointP);
    map.geoObjects.add(pointQ);
    map.geoObjects.add(pointR);
    map.geoObjects.add(pointS);
    map.geoObjects.add(pointT);
    map.geoObjects.add(pointU);
});
