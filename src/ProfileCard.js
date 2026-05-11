const ANIMATION_CONFIG = {
  INITIAL_DURATION: 1200,
  INITIAL_X_OFFSET: 70,
  INITIAL_Y_OFFSET: 60,
  DEVICE_BETA_OFFSET: 20,
  ENTER_TRANSITION_MS: 180
};

const clamp = (v, min = 0, max = 100) => Math.min(Math.max(v, min), max);
const round = (v, precision = 3) => parseFloat(v.toFixed(precision));
const adjust = (v, fMin, fMax, tMin, tMax) => round(tMin + ((tMax - tMin) * (v - fMin)) / (fMax - fMin));

class ProfileCard {
  constructor(container, props) {
    this.container = container;
    this.props = {
      name: 'Javi A. Torres',
      title: 'Software Engineer',
      handle: 'javicodes',
      status: 'Online',
      contactText: 'Contact',
      contactUrl: '#',
      avatarUrl: '',
      miniAvatarUrl: '',
      enableTilt: true,
      enableMobileTilt: false,
      mobileTiltSensitivity: 5,
      ...props
    };

    this.state = {
      currentX: 0,
      currentY: 0,
      targetX: 0,
      targetY: 0,
      running: false,
      lastTs: 0,
      initialUntil: 0
    };

    this.rafId = null;
    this.enterTimer = null;
    this.leaveRaf = null;

    this.render();
    this.initElements();
    this.initTilt();
  }

  render() {
    this.container.innerHTML = `
      <div class="pc-card-wrapper">
        <div class="pc-behind"></div>
        <div class="pc-card-shell">
          <section class="pc-card">
            <div class="pc-inside">
              <div class="pc-shine"></div>
              <div class="pc-glare"></div>
              <div class="pc-content pc-avatar-content">
                <img class="avatar" src="${this.props.avatarUrl}" alt="${this.props.name} avatar" loading="lazy">
                <div class="pc-user-info">
                  <div class="pc-user-details">
                    <div class="pc-mini-avatar">
                      <img src="${this.props.miniAvatarUrl || this.props.avatarUrl}" alt="${this.props.name} mini" loading="lazy">
                    </div>
                    <div class="pc-user-text">
                      <div class="pc-handle">@${this.props.handle}</div>
                      <div class="pc-status">${this.props.status}</div>
                    </div>
                  </div>
                  <a href="${this.props.contactUrl}" target="_blank" rel="noopener noreferrer" class="pc-contact-btn" style="text-decoration: none; display: inline-block; pointer-events: auto;">${this.props.contactText}</a>
                </div>
              </div>
              <div class="pc-content">
                <div class="pc-details">
                  <h3>${this.props.name}</h3>
                  <p>${this.props.title}</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    `;
  }

  initElements() {
    this.wrap = this.container.querySelector('.pc-card-wrapper');
    this.shell = this.container.querySelector('.pc-card-shell');
    this.card = this.container.querySelector('.pc-card');
    
    // Apply initial styles
    if (this.props.innerGradient) {
      this.wrap.style.setProperty('--inner-gradient', this.props.innerGradient);
    }
  }

  initTilt() {
    if (!this.props.enableTilt) return;

    this.shell.addEventListener('pointerenter', (e) => this.handlePointerEnter(e));
    this.shell.addEventListener('pointermove', (e) => this.handlePointerMove(e));
    this.shell.addEventListener('pointerleave', () => this.handlePointerLeave());

    // Initial animation
    const initialX = (this.shell.clientWidth || 0) - ANIMATION_CONFIG.INITIAL_X_OFFSET;
    const initialY = ANIMATION_CONFIG.INITIAL_Y_OFFSET;
    this.setImmediate(initialX, initialY);
    this.toCenter();
    this.beginInitial(ANIMATION_CONFIG.INITIAL_DURATION);
  }

  setVarsFromXY(x, y) {
    const width = this.shell.clientWidth || 1;
    const height = this.shell.clientHeight || 1;

    const percentX = clamp((100 / width) * x);
    const percentY = clamp((100 / height) * y);

    const centerX = percentX - 50;
    const centerY = percentY - 50;

    const properties = {
      '--pointer-x': `${percentX}%`,
      '--pointer-y': `${percentY}%`,
      '--background-x': `${adjust(percentX, 0, 100, 35, 65)}%`,
      '--background-y': `${adjust(percentY, 0, 100, 35, 65)}%`,
      '--pointer-from-center': `${clamp(Math.hypot(percentY - 50, percentX - 50) / 50, 0, 1)}`,
      '--pointer-from-top': `${percentY / 100}`,
      '--pointer-from-left': `${percentX / 100}`,
      '--rotate-x': `${round(-(centerX / 5))}deg`,
      '--rotate-y': `${round(centerY / 4)}deg`
    };

    for (const [k, v] of Object.entries(properties)) {
      this.wrap.style.setProperty(k, v);
    }
  }

  step(ts) {
    if (!this.state.running) return;
    if (this.state.lastTs === 0) this.state.lastTs = ts;
    const dt = (ts - this.state.lastTs) / 1000;
    this.state.lastTs = ts;

    const DEFAULT_TAU = 0.14;
    const INITIAL_TAU = 0.6;
    const tau = ts < this.state.initialUntil ? INITIAL_TAU : DEFAULT_TAU;
    const k = 1 - Math.exp(-dt / tau);

    this.state.currentX += (this.state.targetX - this.state.currentX) * k;
    this.state.currentY += (this.state.targetY - this.state.currentY) * k;

    this.setVarsFromXY(this.state.currentX, this.state.currentY);

    const stillFar = Math.abs(this.state.targetX - this.state.currentX) > 0.05 || 
                    Math.abs(this.state.targetY - this.state.currentY) > 0.05;

    if (stillFar || document.hasFocus()) {
      this.rafId = requestAnimationFrame((t) => this.step(t));
    } else {
      this.state.running = false;
      this.state.lastTs = 0;
    }
  }

  start() {
    if (this.state.running) return;
    this.state.running = true;
    this.state.lastTs = 0;
    this.rafId = requestAnimationFrame((t) => this.step(t));
  }

  setImmediate(x, y) {
    this.state.currentX = x;
    this.state.currentY = y;
    this.setVarsFromXY(x, y);
  }

  setTarget(x, y) {
    this.state.targetX = x;
    this.state.targetY = y;
    this.start();
  }

  toCenter() {
    this.setTarget(this.shell.clientWidth / 2, this.shell.clientHeight / 2);
  }

  beginInitial(durationMs) {
    this.state.initialUntil = performance.now() + durationMs;
    this.start();
  }

  handlePointerMove(e) {
    const rect = this.shell.getBoundingClientRect();
    this.setTarget(e.clientX - rect.left, e.clientY - rect.top);
  }

  handlePointerEnter(e) {
    this.shell.classList.add('active');
    this.shell.classList.add('entering');
    if (this.enterTimer) clearTimeout(this.enterTimer);
    this.enterTimer = setTimeout(() => {
      this.shell.classList.remove('entering');
    }, ANIMATION_CONFIG.ENTER_TRANSITION_MS);

    const rect = this.shell.getBoundingClientRect();
    this.setTarget(e.clientX - rect.left, e.clientY - rect.top);
  }

  handlePointerLeave() {
    this.toCenter();
    const checkSettle = () => {
      const settled = Math.hypot(this.state.targetX - this.state.currentX, 
                                 this.state.targetY - this.state.currentY) < 0.6;
      if (settled) {
        this.shell.classList.remove('active');
        this.leaveRaf = null;
      } else {
        this.leaveRaf = requestAnimationFrame(checkSettle);
      }
    };
    if (this.leaveRaf) cancelAnimationFrame(this.leaveRaf);
    this.leaveRaf = requestAnimationFrame(checkSettle);
  }
}

export default ProfileCard;
