import $ from 'jquery';
import * as lib from '../common/lib';
import commonInit from '../common/init';

window.jQuery = $;

const work = {
  slideToggle: (_e) => {
    const $target = $(
      document.querySelector(
        `[data-slide-content="${_e.currentTarget.dataset.slideTarget}"]`
      )
    );
    if ($target.is(':visible')) {
      $target.slideUp();
    } else if ($target.is(':hidden')) {
      $target.slideDown();
    }
  },
  ToggleLabel: class {
    constructor(_element) {
      this.element = _element;
      this.defaltText = this.element.textContent;
      this.replaceText = this.element.dataset.toggleLabelText;
    }

    toggleText(_flag) {
      if (_flag) {
        this.element.innerText = this.replaceText;
      } else {
        this.element.innerText = this.defaltText;
      }
    }

    clicked(_e) {
      const flag = lib.utility.toggleClickedAttr(_e);
      this.toggleText(flag === 'clicked' ? true : false);
    }
  },
  Parallax: class {
    constructor(_targets) {
      this.targets = _targets;
    }

    stylingParallax() {
      this.targets.forEach((_element) => {
        $(_element).parallax({
          imageSrc: _element.dataset.parallaxImageSrc,
        });
      });
    }
  },
  BlockOpenWighHash: class {
    constructor(_element) {
      this.element = _element;
      this.wrapper = _element.parentNode;
      this.slideTarget = this.wrapper.dataset.slideContent;
      this.toggleBotton = document.querySelector(`[data-slide-target="${this.slideTarget}"]`);
    }

    // setToggleBotton() {
    //   return
    // }

    blockOpen(_hash) {
      if (this.element.id === _hash.replace('#', '')) {
        const clickEvent = new Event('click');
        const mediaQuery = window.matchMedia('(max-width: 599px)');
        const targetAdjustTop = (mediaQuery.matches) ? 40 : 80;
        this.toggleBotton.dispatchEvent(clickEvent);
        window.scrollTo({
          top: this.wrapper.offsetTop - targetAdjustTop,
          behavior: 'auto'
        });
      }
    }
  },
  StatementTicker: class {
    constructor(_element) {
      this.element = _element;
      this.items = [...this.element.querySelectorAll('.top-statement__ticker-item')];
      this.firstItem = this.items[0];
      this.lastItem = this.items[this.items.length - 1];
      this.timer;
    }

    upDate() {
      this.items = [...this.element.querySelectorAll('.top-statement__ticker-item')];
      this.firstItem = this.items[0];
      this.firstItem.classList.add('second--time');
    }

    turnBack() {
      this.element.appendChild(this.firstItem);
      this.upDate();
    }

    autoPlay() {
      this.firstItem.classList.add('second--time');
      this.timer = setInterval(() => {
        this.turnBack();
      }, 3000);
    }
  },
};

const init = () => {
  commonInit();

  const slideToggleButton = document.querySelectorAll(
    '.js-slide-toggle-button'
  );
  slideToggleButton.forEach((_element) => {
    _element.addEventListener('click', (_e) => {
      work.slideToggle(_e);
    });
  });

  const toggelLabelElements = document.querySelectorAll('.js-toggle-label');
  toggelLabelElements.forEach((_element) => {
    const toggleElement = new work.ToggleLabel(_element);
    _element.addEventListener(
      'click',
      toggleElement.clicked.bind(toggleElement)
    );
  });

  const hiddenHeadingElement = document.querySelectorAll('.hidden-heading');
  hiddenHeadingElement.forEach((_element) => {
    const hiddenHeading = new work.BlockOpenWighHash(_element);
    hiddenHeading.blockOpen(window.location.hash);
  });

  const statementTickerElement = document.querySelector('.top-statement__ticker');
  const statementTicker = new work.StatementTicker(statementTickerElement);
  statementTicker.autoPlay();
};

window.addEventListener('load', init);
