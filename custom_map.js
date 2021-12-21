ymaps.ready(function () {
    var LAYER_NAME = 'user#layer',
        MAP_TYPE_NAME = 'user#customMap',
        // Директория с тайлами.
        TILES_PATH = 'images/phlan',
        /* Для того чтобы вычислить координаты левого нижнего и правого верхнего углов прямоугольной координатной
         * области, нам необходимо знать максимальный зум, ширину и высоту изображения в пикселях на максимальном зуме.
         */
        MAX_ZOOM = 9,
        PIC_WIDTH = 5632*4,
        PIC_HEIGHT = 4096*4;

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
            return ymaps.vow.resolve([1, 8]);
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
            center: [3552.00, -5688.00],
            zoom: 1,
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

    menu = $('<ul class="menu"/>');

    for (var i = 0, l = groups.length; i < l; i++) {
        createMenuGroup(groups[i]);
    }

    function createMenuGroup(group) {
        // Пункт меню.
        var menuItem = $('<li><a href="#">' + group.name + '</a></li>'),
            // Коллекция для геообъектов группы.
            collection = new ymaps.GeoObjectCollection(null, {preset: group.style}),
            // Контейнер для подменю.
            submenu = $('<ul class="submenu"/>');

        // Добавляем коллекцию на карту.
        map.geoObjects.add(collection);
        // Добавляем подменю.
        menuItem
            .append(submenu)
            // Добавляем пункт в меню.
            .appendTo(menu)
            // По клику удаляем/добавляем коллекцию на карту и скрываем/отображаем подменю.
            .find('a')
            .bind('click', function () {
                if (collection.getParent()) {
                    map.geoObjects.remove(collection);
                    submenu.hide();
                } else {
                    map.geoObjects.add(collection);
                    submenu.show();
                }
            });
        for (var j = 0, m = group.items.length; j < m; j++) {
            createSubMenu(group.items[j], collection, submenu);
        }
    }

    function createSubMenu(item, collection, submenu) {
        // Пункт подменю.
        var submenuItem = $('<li><a href="#">' + item.hintContent + '</a></li>')
        var placemark;
        // Создаем метку.
        if (item.type === 'Point') {
            placemark = new ymaps.Placemark(item.center,
                {
                    iconContent: item.hintContent,
                    balloonContent: item.balloonContent
                },
                {
                    preset: 'islands#blueStretchyIcon'
                });
        } else if (item.type === 'Polygon') {
            placemark = new ymaps.Polygon(item.center,
                {
                    balloonContent: item.hintContent
                },
                {
                    fillColor: 'rgba(255,0,0,0.37)',
                    opacity: 0.75,
                    strokeWidth: 4,
                    strokeStyle: 'shortdash',
                });

        } else if (item.type === 'Circle') {
            placemark = new ymaps.Circle([item.center, item.radius],
                {
                    hintContent: item.hintContent,
                    balloonContent: item.balloonContent
                },
                {
                    draggable: false,
                    fillColor: 'rgba(255,0,0,0.37)',
                    opacity: 0.75,
                    strokeWidth: 4,
                    strokeStyle: 'shortdash'
                })
        }

        // Добавляем метку в коллекцию.
        collection.add(placemark);
        // Добавляем пункт в подменю.
        submenuItem
            .appendTo(submenu)
            // При клике по пункту подменю открываем/закрываем баллун у метки.
            .find('a')
            .bind('click', function () {
                if (!placemark.balloon.isOpen()) {
                    placemark.balloon.open();
                } else {
                    placemark.balloon.close();
                }
                return false;
            });
    }

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

    menu.appendTo($('#menu'));
});
