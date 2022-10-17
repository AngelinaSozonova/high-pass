window.addEventListener('DOMContentLoaded', function() {
  ymaps.ready(init);

  function init() {
    const cardAddress = document.querySelector('.contacts__content-form--md');
    const cardAddressSm = document.querySelector('.contacts__content-form--sm');
    var myMap = new ymaps.Map("map", {
      center: [55.769378, 37.638512],
      zoom: 13,
      controls: [],
    });

    var myMapSm = new ymaps.Map("map-sm", {
      center: [55.769378, 37.638512],
      zoom: 13,
      controls: [],
    });

    var myPlacemark = new ymaps.Placemark([55.758468, 37.601088], {}, {
      iconLayout: 'default#image',
      iconImageHref: '../../img/placemark.svg',
      iconImageHref: './img/placemark.svg',
      iconImageSize: [12, 12],
    });

    var myPlacemarkSm = new ymaps.Placemark([55.758468, 37.601088], {}, {
      iconLayout: 'default#image',
      iconImageHref: '../../img/placemark.svg',
      iconImageHref: './img/placemark.svg',
      iconImageSize: [12, 12],
    });

    myMap.geoObjects.add(myPlacemark);
    myMapSm.geoObjects.add(myPlacemarkSm);

    myPlacemark.events.add('click', function () {
      cardAddress.classList.add('card-open');
    });

    myPlacemarkSm.events.add('click', function () {
      cardAddressSm.classList.add('card-open');
    });

    document.querySelector('.contacts-content-form__btn--md').addEventListener('click', function() {
      cardAddress.classList.remove('card-open');
    });

    document.querySelector('.contacts-content-form__btn--sm').addEventListener('click', function() {
      cardAddress.classList.remove('card-open');
    });
  }

  new JustValidate('.about-studio__form', {
    colorWrong: '#F06666',
    rules: {
      email: {
        required: true,
        maxLength: 30,
        email: true,
      }
    },

    messages: {
      email: "Недопустимый формат"
    }
  });

  new JustValidate('.contacts-right__form', {
    colorWrong: '#FF3030',
    rules: {
      name: {
        required: true,
        maxLength: 30,
        function: (name, value) => {
          if (/\d/.test(value) || /[@$!%*#?&^_-]/.test(value)) {
            return false;
          } else {
            return true;
          }
        }
      },

      email: {
        required: true,
        maxLength: 30,
        email: true,
      },
    },

    messages: {
      email: "Недопустимый формат",
      name: "Недопустимый формат",
    }
  });

  //search
  const formSearch = document.querySelector('.header__form-search');

  document.querySelector('.header__btn-search').addEventListener('click', function(e) {
    formSearch.classList.add('open-form-search');
  });

  document.querySelector('.header-form-search__btn-close').addEventListener('click', function(event) {
    formSearch.classList.remove('open-form-search');
  });

  //menu
  const menu = document.querySelector('.header__menu');

  document.querySelector('.header-bottom__btn').addEventListener('click', function() {
    menu.classList.add('opacity');
    menu.classList.add('open-menu');
  });

  document.querySelector('.header-menu__close-btn').addEventListener('click', function() {
    menu.classList.remove('open-menu');
    setTimeout(function() {
      menu.classList.remove('opacity');
    }, 600);
  });
})
