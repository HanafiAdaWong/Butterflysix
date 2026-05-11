export default class Masonry {
  constructor(container, options = {}) {
    this.container = container;
    this.options = {
      items: [],
      ease: 'power3.out',
      duration: 0.6,
      stagger: 0.05,
      animateFrom: 'bottom',
      scaleOnHover: true,
      hoverScale: 0.95,
      blurToFocus: true,
      colorShiftOnHover: false,
      ...options
    };

    this.container.classList.add('masonry-list');
    this.hasMounted = false;
    this.itemElements = new Map();

    this.init();
  }

  async init() {
    // Render placeholders/items immediately so they exist in DOM
    this.renderItems();
    
    // Attempt to layout immediately
    this.layout();

    // Also layout after images are likely loaded
    this.preloadImages(this.options.items.map(i => i.img)).then(() => {
        this.layout();
    });

    this.setupResizeObserver();
  }

  async preloadImages(urls) {
    return Promise.all(
      urls.map(
        src =>
          new Promise(resolve => {
            const img = new Image();
            img.src = src;
            img.onload = img.onerror = () => resolve();
          })
      )
    );
  }

  getColumns() {
    const width = this.container.offsetWidth;
    if (width >= 1500) return 5;
    if (width >= 1000) return 4;
    if (width >= 600) return 3;
    if (width >= 400) return 2;
    return 1;
  }

  renderItems() {
    this.container.innerHTML = '';
    this.itemElements.clear();
    
    this.options.items.forEach(item => {
      const wrapper = document.createElement('div');
      wrapper.className = 'masonry-item-wrapper';
      wrapper.style.width = '0'; // Will be set by layout
      wrapper.style.height = '0'; // Will be set by layout
      wrapper.style.opacity = '0';
      
      const imgContainer = document.createElement('div');
      imgContainer.className = 'masonry-item-img';
      imgContainer.style.width = '100%';
      imgContainer.style.height = '100%';
      imgContainer.style.overflow = 'hidden';
      imgContainer.style.borderRadius = '10px';
      
      const img = document.createElement('img');
      img.src = item.img;
      img.style.width = '100%';
      img.style.height = '100%';
      img.style.objectFit = 'cover';
      img.style.display = 'block';
      
      imgContainer.appendChild(img);
      
      if (this.options.colorShiftOnHover) {
        const overlay = document.createElement('div');
        overlay.className = 'color-overlay';
        overlay.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;background:linear-gradient(45deg,rgba(255,0,150,0.3),rgba(0,150,255,0.3));opacity:0;pointer-events:none;transition:opacity 0.3s;';
        imgContainer.appendChild(overlay);
      }
      
      wrapper.appendChild(imgContainer);
      this.container.appendChild(wrapper);
      
      wrapper.addEventListener('click', () => window.open(item.url, '_blank', 'noopener'));
      wrapper.addEventListener('mouseenter', (e) => this.handleMouseEnter(e, item));
      wrapper.addEventListener('mouseleave', (e) => this.handleMouseLeave(e, item));
      
      this.itemElements.set(item.id, wrapper);
    });
  }

  layout() {
    const containerWidth = this.container.offsetWidth;
    if (!containerWidth) return;

    const columns = this.getColumns();
    const colHeights = new Array(columns).fill(0);
    const columnWidth = containerWidth / columns;

    const grid = this.options.items.map(child => {
      const col = colHeights.indexOf(Math.min(...colHeights));
      const x = columnWidth * col;
      const height = child.height || 300;
      const y = colHeights[col];

      colHeights[col] += height;

      return { ...child, x, y, w: columnWidth, h: height };
    });
    
    this.container.style.height = `${Math.max(...colHeights)}px`;

    grid.forEach((item, index) => {
      const element = this.itemElements.get(item.id);
      if (!element) return;

      const animationProps = {
        x: item.x,
        y: item.y,
        width: item.w,
        height: item.h,
        opacity: 1
      };

      if (!this.hasMounted) {
        window.gsap.set(element, { opacity: 0, y: item.y + 50 });
        window.gsap.to(element, {
          ...animationProps,
          duration: 0.8,
          ease: 'power3.out',
          delay: index * this.options.stagger
        });
      } else {
        window.gsap.to(element, {
          ...animationProps,
          duration: 0.5,
          ease: 'power2.out',
          overwrite: 'auto'
        });
      }
    });

    this.hasMounted = true;
  }

  setupResizeObserver() {
    const ro = new ResizeObserver(() => {
      this.layout();
    });
    ro.observe(this.container);
  }

  handleMouseEnter(e, item) {
    const element = e.currentTarget;
    if (this.options.scaleOnHover) {
      window.gsap.to(element, { scale: this.options.hoverScale, duration: 0.3, ease: 'power2.out' });
    }
    if (this.options.colorShiftOnHover) {
      const overlay = element.querySelector('.color-overlay');
      if (overlay) window.gsap.to(overlay, { opacity: 0.3, duration: 0.3 });
    }
  }

  handleMouseLeave(e, item) {
    const element = e.currentTarget;
    if (this.options.scaleOnHover) {
      window.gsap.to(element, { scale: 1, duration: 0.3, ease: 'power2.out' });
    }
    if (this.options.colorShiftOnHover) {
      const overlay = element.querySelector('.color-overlay');
      if (overlay) window.gsap.to(overlay, { opacity: 0, duration: 0.3 });
    }
  }
}
