/**
 * Vibe College - Antique Canvas Treasure Map & Route Pathfinder
 * Interactive high-DPI HTML5 Canvas 2D engine with pan, zoom, clickable landmark pins,
 * animated compass rose, and glowing route pathfinder with sailing skiff.
 */

(function () {
  'use strict';

  const CAMPUS_LANDMARKS = [
    {
      id: 'library',
      name: 'The Old Library',
      x: 230,
      y: 190,
      icon: '📚',
      type: 'Academic & Archives',
      desc: 'Spire-topped historic stone sanctuary filled with maritime folios, quiet study lofts, and rare sea scrolls.',
      nearby: ['North Quad', 'The Galley Café', 'Founders Hall', 'Arts Dock'],
      directions: 'Head past North Quad and follow the story-shaped trail.',
    },
    {
      id: 'founders',
      name: 'Founders Hall',
      x: 420,
      y: 300,
      icon: '🏛️',
      type: 'Admiralty & Governance',
      desc: 'The beating heart of Vibe College. Towering clock tower, High Admiral Sterling’s chambers, and grand auditorium.',
      nearby: ['The Old Library', 'North Quad', 'Harbour Gardens', 'Arts Dock'],
      directions: 'Follow the dotted path from the Old Library toward the heart of campus.',
    },
    {
      id: 'galley',
      name: 'The Galley Café',
      x: 610,
      y: 180,
      icon: '☕',
      type: 'Dining & Social',
      desc: 'Sunny terrace overlooking the bay. Serves spiced grog, artisan coffee, fresh bakery loaves, and sailor hearty stews.',
      nearby: ['North Quad', 'The Old Library', 'Harbour Gardens', 'Founders Hall'],
      directions: 'Take the sunny path beside North Quad. The good smells will guide ye.',
    },
    {
      id: 'arts',
      name: 'Arts Dock',
      x: 630,
      y: 430,
      icon: '🎨',
      type: 'Creative & Waterfront',
      desc: 'Waterfront studio docks where students craft maritime paintings, build robotic skiffs, and host acoustic lantern sets.',
      nearby: ['Founders Hall', 'Harbour Gardens', 'The Old Library', 'North Quad'],
      directions: 'Sail south past Founders Hall; look for creativity on the shore.',
    },
    {
      id: 'gardens',
      name: 'Harbour Gardens',
      x: 430,
      y: 480,
      icon: '🌿',
      type: 'Recreation & Botany',
      desc: 'Lush coastal botanical gardens filled with saltwater orchids, sea breezes, open-air study gazebos, and reflection ponds.',
      nearby: ['The Galley Café', 'Arts Dock', 'Founders Hall', 'North Quad'],
      directions: 'Follow the green stretch between the Galley and Arts Dock.',
    },
    {
      id: 'quad',
      name: 'North Quad',
      x: 400,
      y: 120,
      icon: '⚓',
      type: 'Open Lawn & Regatta Hub',
      desc: 'Expansive grassy commons where regatta teams train, cadets read under weeping willows, and annual pirate festivals ignite.',
      nearby: ['The Old Library', 'The Galley Café', 'Founders Hall', 'Harbour Gardens'],
      directions: 'You’re nearly there. The Old Library and Galley are just a short stroll away.',
    },
  ];

  class TreasureCanvasMap {
    constructor(canvasEl, options = {}) {
      this.canvas = canvasEl;
      this.ctx = canvasEl.getContext('2d');
      this.landmarks = CAMPUS_LANDMARKS;

      this.scale = 1;
      this.offsetX = 0;
      this.offsetY = 0;
      this.isDragging = false;
      this.dragStartX = 0;
      this.dragStartY = 0;

      this.selectedLandmark = null;
      this.hoveredLandmark = null;
      this.originLandmark = null;
      this.targetLandmark = null;

      this.dashOffset = 0;
      this.skiffProgress = 0;
      this.animId = null;

      this.onSelect = options.onSelect || null;

      this.init();
    }

    init() {
      this.resize();
      window.addEventListener('resize', () => this.resize());

      // Center map initially
      this.centerMap();

      // Mouse & touch events
      this.canvas.addEventListener('mousedown', (e) => this.handlePointerDown(e));
      window.addEventListener('mousemove', (e) => this.handlePointerMove(e));
      window.addEventListener('mouseup', () => this.handlePointerUp());

      this.canvas.addEventListener('wheel', (e) => this.handleWheel(e), { passive: false });

      this.canvas.addEventListener('touchstart', (e) => this.handleTouchStart(e), { passive: false });
      window.addEventListener('touchmove', (e) => this.handleTouchMove(e), { passive: false });
      window.addEventListener('touchend', () => this.handlePointerUp());

      // Start render loop
      this.startLoop();
    }

    resize() {
      const rect = this.canvas.parentElement.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      this.canvas.width = rect.width * dpr;
      this.canvas.height = (rect.height || 520) * dpr;
      this.canvas.style.width = `${rect.width}px`;
      this.canvas.style.height = `${rect.height || 520}px`;
      this.ctx.scale(dpr, dpr);
      this.viewWidth = rect.width;
      this.viewHeight = rect.height || 520;
    }

    centerMap() {
      this.scale = 1;
      this.offsetX = (this.viewWidth - 850) / 2;
      this.offsetY = (this.viewHeight - 600) / 2;
    }

    handlePointerDown(e) {
      const rect = this.canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      // Check pin click
      const clicked = this.getPinAt(mouseX, mouseY);
      if (clicked) {
        this.selectLandmark(clicked);
        return;
      }

      this.isDragging = true;
      this.dragStartX = mouseX - this.offsetX;
      this.dragStartY = mouseY - this.offsetY;
      this.canvas.style.cursor = 'grabbing';
    }

    handlePointerMove(e) {
      const rect = this.canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      if (this.isDragging) {
        this.offsetX = mouseX - this.dragStartX;
        this.offsetY = mouseY - this.dragStartY;
        return;
      }

      const hovered = this.getPinAt(mouseX, mouseY);
      if (hovered !== this.hoveredLandmark) {
        this.hoveredLandmark = hovered;
        this.canvas.style.cursor = hovered ? 'pointer' : 'grab';
      }
    }

    handlePointerUp() {
      this.isDragging = false;
      this.canvas.style.cursor = 'grab';
    }

    handleWheel(e) {
      e.preventDefault();
      const rect = this.canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      const zoomFactor = e.deltaY < 0 ? 1.12 : 0.88;
      const newScale = Math.min(Math.max(this.scale * zoomFactor, 0.5), 2.5);

      // Zoom towards mouse pointer
      this.offsetX = mouseX - (mouseX - this.offsetX) * (newScale / this.scale);
      this.offsetY = mouseY - (mouseY - this.offsetY) * (newScale / this.scale);
      this.scale = newScale;
    }

    handleTouchStart(e) {
      if (e.touches.length === 1) {
        const touch = e.touches[0];
        const rect = this.canvas.getBoundingClientRect();
        const mouseX = touch.clientX - rect.left;
        const mouseY = touch.clientY - rect.top;
        const clicked = this.getPinAt(mouseX, mouseY);
        if (clicked) {
          this.selectLandmark(clicked);
          return;
        }
        this.isDragging = true;
        this.dragStartX = mouseX - this.offsetX;
        this.dragStartY = mouseY - this.offsetY;
      }
    }

    handleTouchMove(e) {
      if (this.isDragging && e.touches.length === 1) {
        e.preventDefault();
        const touch = e.touches[0];
        const rect = this.canvas.getBoundingClientRect();
        this.offsetX = touch.clientX - rect.left - this.dragStartX;
        this.offsetY = touch.clientY - rect.top - this.dragStartY;
      }
    }

    screenToWorld(sx, sy) {
      return {
        x: (sx - this.offsetX) / this.scale,
        y: (sy - this.offsetY) / this.scale,
      };
    }

    getPinAt(sx, sy) {
      const world = this.screenToWorld(sx, sy);
      return this.landmarks.find((lm) => {
        const dx = lm.x - world.x;
        const dy = lm.y - world.y;
        return Math.sqrt(dx * dx + dy * dy) <= 30;
      });
    }

    selectLandmark(lm) {
      this.selectedLandmark = lm;
      if (!this.originLandmark) {
        this.originLandmark = lm;
      } else if (!this.targetLandmark && lm.id !== this.originLandmark.id) {
        this.targetLandmark = lm;
      } else {
        this.originLandmark = lm;
        this.targetLandmark = null;
      }

      if (this.onSelect) this.onSelect(lm, this.originLandmark, this.targetLandmark);
    }

    setPath(fromId, toId) {
      this.originLandmark = this.landmarks.find((l) => l.id === fromId || l.name.toLowerCase() === fromId.toLowerCase());
      this.targetLandmark = this.landmarks.find((l) => l.id === toId || l.name.toLowerCase() === toId.toLowerCase());
      this.skiffProgress = 0;
    }

    startLoop() {
      const render = () => {
        this.draw();
        this.dashOffset -= 0.6;
        if (this.originLandmark && this.targetLandmark) {
          this.skiffProgress += 0.005;
          if (this.skiffProgress > 1) this.skiffProgress = 0;
        }
        this.animId = requestAnimationFrame(render);
      };
      this.animId = requestAnimationFrame(render);
    }

    draw() {
      const ctx = this.ctx;
      const w = this.viewWidth;
      const h = this.viewHeight;

      ctx.clearRect(0, 0, w, h);

      // PARCHMENT WATER BACKGROUND
      ctx.save();
      const grad = ctx.createRadialGradient(w / 2, h / 2, 50, w / 2, h / 2, Math.max(w, h));
      grad.addColorStop(0, '#f8f1de');
      grad.addColorStop(0.7, '#ede0c4');
      grad.addColorStop(1, '#dfceac');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);
      ctx.restore();

      // Transform coordinate space for pan & zoom
      ctx.save();
      ctx.translate(this.offsetX, this.offsetY);
      ctx.scale(this.scale, this.scale);

      // DRAW NAUTICAL RHUMB LINES & COORDINATE GRID
      this.drawRhumbLines(ctx);

      // DRAW ISLAND SHORELINES
      this.drawShorelines(ctx);

      // DRAW PATH TRAILS BETWEEN NEARBY SPOTS
      this.drawStaticTrails(ctx);

      // DRAW ACTIVE GLOWING ROUTE (PATHFINDER)
      if (this.originLandmark && this.targetLandmark) {
        this.drawAnimatedPath(ctx, this.originLandmark, this.targetLandmark);
      }

      // DRAW LANDMARK PINS
      this.drawLandmarks(ctx);

      ctx.restore();

      // DRAW STATIC OVERLAY HUD (Compass Rose & Vintage Border)
      this.drawVintageCompassHUD(ctx);
    }

    drawRhumbLines(ctx) {
      ctx.save();
      ctx.strokeStyle = 'rgba(180, 150, 105, 0.22)';
      ctx.lineWidth = 1;

      // Coordinate Grid Lines
      for (let x = 0; x <= 900; x += 100) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, 650);
        ctx.stroke();
      }
      for (let y = 0; y <= 650; y += 100) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(900, y);
        ctx.stroke();
      }

      // Rhumb Lines from map center (420, 300)
      const cx = 420;
      const cy = 300;
      for (let i = 0; i < 16; i++) {
        const angle = (i * Math.PI) / 8;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + Math.cos(angle) * 700, cy + Math.sin(angle) * 700);
        ctx.stroke();
      }
      ctx.restore();
    }

    drawShorelines(ctx) {
      ctx.save();
      // Main Campus Island
      ctx.fillStyle = '#fdfaf1';
      ctx.strokeStyle = '#c6ad82';
      ctx.lineWidth = 2.5;

      ctx.beginPath();
      ctx.moveTo(180, 120);
      ctx.bezierCurveTo(320, 70, 520, 60, 660, 130);
      ctx.bezierCurveTo(740, 200, 750, 380, 690, 480);
      ctx.bezierCurveTo(610, 560, 440, 580, 340, 540);
      ctx.bezierCurveTo(220, 500, 150, 410, 140, 300);
      ctx.bezierCurveTo(130, 210, 150, 140, 180, 120);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Soft water ripple around coast
      ctx.strokeStyle = 'rgba(150, 180, 170, 0.45)';
      ctx.lineWidth = 1.2;
      ctx.stroke();

      // Sea Label
      ctx.font = 'italic 13px Georgia, serif';
      ctx.fillStyle = 'rgba(105, 130, 120, 0.6)';
      ctx.fillText('~ Bay of Discovery ~', 220, 80);
      ctx.fillText('~ Admiral’s Reach ~', 680, 350);
      ctx.fillText('~ Anchor Sound ~', 250, 580);

      ctx.restore();
    }

    drawStaticTrails(ctx) {
      ctx.save();
      ctx.strokeStyle = 'rgba(168, 140, 100, 0.45)';
      ctx.setLineDash([4, 6]);
      ctx.lineWidth = 1.8;

      const pairs = [
        ['library', 'quad'],
        ['quad', 'galley'],
        ['library', 'founders'],
        ['founders', 'galley'],
        ['founders', 'arts'],
        ['founders', 'gardens'],
        ['arts', 'gardens'],
      ];

      pairs.forEach(([idA, idB]) => {
        const a = this.landmarks.find((l) => l.id === idA);
        const b = this.landmarks.find((l) => l.id === idB);
        if (a && b) {
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      });
      ctx.restore();
    }

    drawAnimatedPath(ctx, start, end) {
      ctx.save();
      // Glowing path shadow
      ctx.shadowColor = '#d35400';
      ctx.shadowBlur = 8;
      ctx.strokeStyle = '#c0392b';
      ctx.lineWidth = 3.5;
      ctx.setLineDash([10, 8]);
      ctx.lineDashOffset = this.dashOffset;

      ctx.beginPath();
      ctx.moveTo(start.x, start.y);
      ctx.quadraticCurveTo((start.x + end.x) / 2 + 30, (start.y + end.y) / 2 - 25, end.x, end.y);
      ctx.stroke();
      ctx.restore();

      // Animate tiny sailing skiff along path
      const t = this.skiffProgress;
      const mx = (start.x + end.x) / 2 + 30;
      const my = (start.y + end.y) / 2 - 25;
      // Quadratic Bezier formula
      const px = Math.pow(1 - t, 2) * start.x + 2 * (1 - t) * t * mx + Math.pow(t, 2) * end.x;
      const py = Math.pow(1 - t, 2) * start.y + 2 * (1 - t) * t * my + Math.pow(t, 2) * end.y;

      ctx.save();
      ctx.font = '22px serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('⛵', px, py);
      ctx.restore();
    }

    drawLandmarks(ctx) {
      this.landmarks.forEach((lm) => {
        const isHovered = this.hoveredLandmark && this.hoveredLandmark.id === lm.id;
        const isSelected = this.selectedLandmark && this.selectedLandmark.id === lm.id;
        const isOrigin = this.originLandmark && this.originLandmark.id === lm.id;
        const isTarget = this.targetLandmark && this.targetLandmark.id === lm.id;

        ctx.save();
        ctx.translate(lm.x, lm.y);

        // Halo / pulse on active nodes
        if (isSelected || isOrigin || isTarget || isHovered) {
          ctx.beginPath();
          ctx.arc(0, 0, isHovered ? 26 : 22, 0, Math.PI * 2);
          ctx.fillStyle = isOrigin
            ? 'rgba(46, 204, 113, 0.25)'
            : isTarget
              ? 'rgba(231, 76, 60, 0.25)'
              : 'rgba(241, 196, 15, 0.35)';
          ctx.fill();
        }

        // Circular brass badge
        ctx.beginPath();
        ctx.arc(0, 0, 16, 0, Math.PI * 2);
        ctx.fillStyle = isOrigin ? '#27ae60' : isTarget ? '#c0392b' : isSelected ? '#d4ac0d' : '#2c3e50';
        ctx.strokeStyle = '#f1c957';
        ctx.lineWidth = 2.5;
        ctx.fill();
        ctx.stroke();

        // Icon inside pin
        ctx.font = '14px serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(lm.icon, 0, 1);

        // Landmark name banner
        ctx.font = 'bold 11px "DM Sans", sans-serif';
        const labelWidth = ctx.measureText(lm.name).width;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.fillRect(-labelWidth / 2 - 5, 20, labelWidth + 10, 16);
        ctx.strokeStyle = '#c6ad82';
        ctx.lineWidth = 1;
        ctx.strokeRect(-labelWidth / 2 - 5, 20, labelWidth + 10, 16);

        ctx.fillStyle = '#1c2826';
        ctx.fillText(lm.name, 0, 32);

        ctx.restore();
      });
    }

    drawVintageCompassHUD(ctx) {
      // Top right compass rose
      const cx = this.viewWidth - 65;
      const cy = 65;

      ctx.save();
      ctx.translate(cx, cy);

      // Astrolabe brass ring
      ctx.beginPath();
      ctx.arc(0, 0, 36, 0, Math.PI * 2);
      ctx.strokeStyle = '#b8974d';
      ctx.lineWidth = 2;
      ctx.fillStyle = 'rgba(255, 251, 240, 0.75)';
      ctx.fill();
      ctx.stroke();

      // Cardinal Points
      ctx.font = 'bold 11px Georgia, serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#9b2c2c';
      ctx.fillText('N', 0, -24);
      ctx.fillStyle = '#2c3e50';
      ctx.fillText('S', 0, 24);
      ctx.fillText('E', 24, 0);
      ctx.fillText('W', -24, 0);

      // Star Needle
      ctx.beginPath();
      ctx.moveTo(0, -20);
      ctx.lineTo(5, -4);
      ctx.lineTo(0, 0);
      ctx.lineTo(-5, -4);
      ctx.closePath();
      ctx.fillStyle = '#c0392b';
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(0, 20);
      ctx.lineTo(5, 4);
      ctx.lineTo(0, 0);
      ctx.lineTo(-5, 4);
      ctx.closePath();
      ctx.fillStyle = '#2c3e50';
      ctx.fill();

      ctx.restore();
    }
  }

  window.VibeTreasureMap = TreasureCanvasMap;
})();
