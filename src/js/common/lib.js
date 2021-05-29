import $ from 'jquery';

const utility = {
  toggleClickedAttr: (_e) => {
    const clickedName = 'clicked';
    if (_e.currentTarget.hasAttribute(clickedName)) {
      _e.currentTarget.removeAttribute(clickedName);
      return 'release';
    } else {
      _e.currentTarget.setAttribute(clickedName, clickedName);
      return 'clicked';
    }
  },
  addfirstClickedAttr: (_e) => {
    _e.currentTarget.setAttribute('firstClicked', 'firstClicked');
  },
  interlockElementWithEvent: (_originEvent, _targetElement) => {
    switch (_originEvent.type) {
      case 'click':
        _targetElement.click();
        break;
      default:
        return false;
    }
  },
  decisionUA: () => {
    const deviceUA = window.navigator.userAgent.toLowerCase();
    const isIPhone = deviceUA.indexOf('iphone') !== -1 && deviceUA.indexOf('ipod') === -1; // iPhone (ここでは iPod touch を除外)
    const isIPad = deviceUA.indexOf('ipad') !== -1 || deviceUA.indexOf('macintosh') > -1 && 'ontouchend' in document; // iPad (旧 iOS, 新 iPad OS とも
    const isAndroid = deviceUA.indexOf('android') !== -1; // Android
    return {
      isIPhone,
      isIPad,
      isAndroid
    }
  }
};

const commonWork = {
  toggleGlobalHeaderWithScroll: (_globalHeader) => {
    let scrollFlag = false;
    const threshold = _globalHeader.clientHeight;
    const toggleScrolledAttr = () => {
      if (!scrollFlag) {
        window.requestAnimationFrame(() => {
          scrollFlag = false;
          const scrolledName = 'scrolled';
          if (window.scrollY > threshold) {
            _globalHeader.setAttribute(scrolledName, scrolledName);
          } else {
            if (_globalHeader.hasAttribute(scrolledName)) {
              _globalHeader.removeAttribute(scrolledName);
            }
          }
        });
        scrollFlag = true;
      }
    };
    window.addEventListener('scroll', toggleScrolledAttr, {
      passive: true
    });
  },
  activeGlobalHeader: () => {
    const pagePath = window.location.pathname;
    const pageHash = window.location.hash;
    const activeClassName = 'global-nav__item-link--active';
    const globalNavItem = document.querySelectorAll('.global-nav__item > a');
    const addActiveClassName = (_keyName) => {
      globalNavItem.forEach((_e) => {
        const href = _e.attributes.href && _e.attributes.href.value;
        if (href === _keyName) {
          _e.classList.add(activeClassName);
        } else {
          _e.classList.remove(activeClassName);
        }
      });
    };
    globalNavItem.forEach((_e) => {
      const href = _e.attributes.href && _e.attributes.href.value;
      if (href.indexOf('#') === 0) {
        _e.addEventListener('click', (_ev) => {
          addActiveClassName(href);
          _ev.preventDefault();
        });
      }
    });
    addActiveClassName(pageHash || pagePath);
  },
  smoothScroll: (_triggerElement, _addHeightElement) => {
    const targetElement = document.querySelector(_triggerElement.getAttribute('href'));
    if (targetElement) {
      const addHeight = _addHeightElement.clientHeight;
      let scrollToTop = targetElement.getBoundingClientRect().top;
      scrollToTop = scrollToTop + window.pageYOffset - addHeight;
      _triggerElement.addEventListener('click', (_e) => {
        window.scrollTo({
          top: scrollToTop,
          behavior: 'smooth'
        });
        _e.preventDefault();
      });
    }
  },
  waitWebFontLoad: (_className) => {
    setTimeout(() => {
      document.getElementsByTagName('html')[0].classList.add(_className);
    }, 3000);
  },
  creditModal: () => {
    $('.global-footer__credit').on('click', () => {
      $('#producer').fadeIn();
    });
    $('.producer__close').on('click', () => {
      $('#producer').fadeOut();
    });
    $('.producer__link').on('click', (_e) => {
      if (_e.currentTarget.attributes.href.value.match(/^\/#/)) {
        $('#producer').fadeOut();
      }
    });

    const fixedModal = () => {
      let scrollPosition = 0;
      const ua = window.navigator.userAgent.toLowerCase();
      const isiOS = ua.indexOf('iphone') > -1 || ua.indexOf('ipad') > -1 || ua.indexOf('macintosh') > -1 && 'ontouchend' in document;

      const fixedOn = () => {
        if (isiOS) {
          scrollPosition = $(window).scrollTop();
          $('body').css({
            width: '100%',
            position: 'fixed',
            top: `-${scrollPosition}px`
          });
        } else {
          $('body').css({
            overflow: 'hidden'
          });
        }
      };

      const fixedOff = () => {
        if (isiOS) {
          $('body').css({
            width: '',
            position: '',
            top: ''
          });
          $(window).scrollTop(scrollPosition);
        } else {
          $('body').css({
            overflow: ''
          });
        }
      };

      return {
        fixedOn,
        fixedOff
      };
    };

    const initFixedModal = () => {
      const onOffModal = fixedModal();
      $('.global-footer__credit').on('click', () => {
        onOffModal.fixedOn();
      });
      $('.producer__close').on('click', () => {
        onOffModal.fixedOff();
      });
      $('.producer__link').on('click', (_e) => {
        if (_e.currentTarget.attributes.href.value.match(/^\/#/)) {
          onOffModal.fixedOff();
        }
      });
    };

    return initFixedModal;
  },
  switchFacebookLink: (_element) => {
    const isUA = utility.decisionUA();
    if (isUA.isIPhone || isUA.isiOS) {
      _element.setAttribute('href', 'fb://page?id=160483220669629');
    } else if (isUA.isAndroid) {
      _element.setAttribute('href', 'fb://page/160483220669629');
    }
  }
};

export { utility, commonWork };
